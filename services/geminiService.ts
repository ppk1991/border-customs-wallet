
import { GoogleGenAI, Type } from "@google/genai";
import { DigitalWallet, CrossingContext, RiskSubResult, RiskFactor } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Local data for wallet lookup with enriched travel history
export const WALLETS: Record<string, DigitalWallet> = {
  "WALLET-001": {
    wallet_id: "WALLET-001",
    owner: {
      traveler_id: "TRAV-001",
      full_name: "Alex Pop",
      nationality: "RO",
      citizenship: "Romanian",
      date_of_birth: "1995-04-12",
      frequent_traveler: true,
      risk_flags: [],
      system_alerts: [
        { 
            source: 'Customs Intel', 
            type: 'info', 
            message: 'Consistent compliance history at terrestrial BCPs (Stamora Moravița). Recommended for Blue Lane expedited customs.', 
            timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() 
        }
      ],
      crossing_history: [
        { 
          date: "2024-03-25", 
          origin: 'FR', 
          destination: 'IE', 
          outcome: 'Approved',
          bcp_name: 'Dublin Airport (DUB)',
          transport_mode: 'Air',
          // Note: Ireland is EU but not Schengen, so an identity check occurs, 
          // but for EU citizens it's freedom of movement, not EES.
          visa_type: 'EU_FREEDOM_OF_MOVEMENT'
        },
        { 
          date: "2023-11-05", 
          origin: 'RO', 
          destination: 'RS', 
          outcome: 'Approved',
          bcp_name: 'Stamora Moravița (Land)',
          transport_mode: 'Terrestrial (Auto)',
          // Serbia (RS) is non-EU/non-Schengen, so border check occurs.
          customs_clearance_id: 'CUST-RO-2023-001',
          visa_type: 'EU_FREEDOM_OF_MOVEMENT'
        }
      ]
    },
    credentials: [
      {
        cred_type: "eID",
        issuer: "RO Government",
        id_number: "RO12345678",
        valid_from: "2020-01-01",
        valid_to: "2030-01-01",
        metadata: { "document_type": "passport", "mrz_check": "passed" }
      }
    ],
    last_updated: new Date().toISOString(),
    version: "1.0"
  },
  "WALLET-002": {
    wallet_id: "WALLET-002",
    owner: {
      traveler_id: "TRAV-002",
      full_name: "Mariam K.",
      nationality: "GE",
      citizenship: "Georgian",
      date_of_birth: "1988-10-02",
      frequent_traveler: false,
      risk_flags: ["overstay_history"],
      system_alerts: [
        { 
            source: 'Europol', 
            type: 'warning', 
            message: 'Subject linked to network with known overstay patterns in Schengen zone.', 
            timestamp: new Date().toISOString() 
        },
        { 
            source: 'Customs Intel', 
            type: 'warning', 
            message: 'Secondary inspection at CDG (2022-08-15) confirmed undeclared high-value electronics.', 
            timestamp: "2022-08-16T12:00:00Z"
        }
      ],
      crossing_history: [
        { 
          date: "2024-01-15", 
          origin: 'GE', 
          destination: 'DE', 
          outcome: 'Approved',
          bcp_name: 'Berlin Brandenburg (BER)',
          transport_mode: 'Air',
          stamp_id: 'EES-VIS-GE-04',
          visa_type: 'SCHENGEN_C'
        },
        { 
          date: "2022-08-15", 
          origin: 'GE', 
          destination: 'FR', 
          outcome: 'Secondary Inspection',
          bcp_name: 'Paris Charles de Gaulle (CDG)',
          transport_mode: 'Air',
          stamp_id: 'EES-ERR-GE-01'
        }
      ]
    },
    credentials: [],
    last_updated: new Date().toISOString(),
    version: "1.0"
  },
  "WALLET-003": {
    wallet_id: "WALLET-003",
    owner: {
      traveler_id: "TRAV-003",
      full_name: "Igor S.",
      nationality: "UA",
      citizenship: "Ukrainian",
      date_of_birth: "1979-01-27",
      frequent_traveler: false,
      risk_flags: ["past_refusal"],
      system_alerts: [
        { 
            source: 'Interpol', 
            type: 'critical', 
            message: 'Red Notice: Subject wanted for questioning in relation to financial crimes.', 
            timestamp: new Date().toISOString() 
        }
      ],
      crossing_history: [
        { 
          date: "2024-03-01", 
          origin: 'UA', 
          destination: 'PL', 
          outcome: 'Approved',
          bcp_name: 'Warsaw Chopin (WAW)',
          transport_mode: 'Air',
          stamp_id: 'EES-POL-UA-77',
          visa_type: 'TEMPORARY_PROTECTION'
        },
        { 
          date: "2023-02-01", 
          origin: 'UA', 
          destination: 'PL', 
          outcome: 'Denied',
          bcp_name: 'Medyka-Shehyni',
          transport_mode: 'Terrestrial (Auto)'
        }
      ]
    },
    credentials: [],
    last_updated: new Date().toISOString(),
    version: "1.0"
  }
};

const RISK_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.STRING, description: "Risk score from 0-100" },
    level: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] },
    color: { type: Type.STRING, enum: ["green", "orange", "red"] },
    factors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: ["identity", "customs", "alert"] },
          message: { type: Type.STRING }
        }
      }
    },
    decision_path: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          node_name: { type: Type.STRING, description: "Title of the logic node" },
          status: { type: Type.STRING, enum: ["PASSED", "FLAGGED", "CRITICAL"] },
          observation: { type: Type.STRING, description: "Brief reason for status" }
        },
        required: ["node_name", "status", "observation"]
      }
    }
  },
  required: ["score", "level", "color", "factors", "decision_path"]
};

export const analyzeBorderRisk = async (wallet: DigitalWallet, ctx: CrossingContext): Promise<RiskSubResult> => {
  const prompt = `Perform a Border Security Risk Analysis. 
  
  Nodes:
  1. Identity Check
  2. Database Lookup (SIS II / Interpol)
  3. Context Analysis (Origin: ${ctx.origin_port} -> Arrival: ${ctx.arrival_port})
  4. Intent Verification (${ctx.trip_intent})

  Traveler: ${JSON.stringify(wallet.owner)}
  Context: ${JSON.stringify(ctx)}
  
  Evaluate if the route (${ctx.origin_country} to ${ctx.destination_country}) or ports used suggest security anomalies. Return JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: RISK_SCHEMA
    }
  });

  return JSON.parse(response.text);
};

export const analyzeCustomsRisk = async (wallet: DigitalWallet, ctx: CrossingContext): Promise<RiskSubResult> => {
  const prompt = `Perform a Customs Compliance Risk Analysis.

  Nodes:
  1. Declaration Audit (Goods: ${ctx.goods_type}, Value: ${ctx.declared_goods_value}, Usage: ${ctx.goods_usage})
  2. Route Profiling (${ctx.origin_port} to ${ctx.arrival_port})
  3. Revenue Protection (Thresholds for ${ctx.destination_country})
  4. Commodity Anomaly

  Traveler: ${JSON.stringify(wallet.owner)}
  Context: ${JSON.stringify(ctx)}
  
  Evaluate if ${ctx.goods_usage} items worth ${ctx.declared_goods_value} are consistent with ${ctx.trip_intent} for this traveler. Return JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: RISK_SCHEMA
    }
  });

  return JSON.parse(response.text);
};

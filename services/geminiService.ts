
import { DigitalWallet, CrossingContext, RiskResult } from '../types';

const today = new Date();
const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
const past5Years = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
const past2Years = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
const past3Years = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
const past1Year = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
const past10Years = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());

// Define a representative list of EU member states for risk calculation logic.
const EU_COUNTRIES = [
    'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 
    'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'
];


const walletsData: Record<string, DigitalWallet> = {
  "WALLET-001": {
    wallet_id: "WALLET-001",
    owner: {
      traveler_id: "TRAV-001",
      full_name: "Alex Pop",
      nationality: "RO",
      date_of_birth: new Date(1995, 3, 12).toISOString().split('T')[0],
      frequent_traveler: true,
      risk_flags: [],
      system_alerts: [],
      crossing_history: [
        { date: new Date(2023, 10, 5).toISOString().split('T')[0], origin: 'RO', destination: 'RS', outcome: 'Approved' },
        { date: new Date(2023, 7, 21).toISOString().split('T')[0], origin: 'RS', destination: 'RO', outcome: 'Approved' },
        { date: new Date(2023, 5, 1).toISOString().split('T')[0], origin: 'RO', destination: 'US', outcome: 'Approved' },
      ]
    },
    credentials: [
      {
        cred_type: "eID",
        issuer: "RO Government",
        id_number: "RO12345678",
        valid_from: past5Years.toISOString().split('T')[0],
        valid_to: nextYear.toISOString().split('T')[0],
        metadata: { "document_type": "passport", "mrz_check": "passed" }
      },
      {
        cred_type: "Vaccination",
        issuer: "EU DCC",
        id_number: "EU-VACC-987654",
        valid_from: past2Years.toISOString().split('T')[0],
        valid_to: nextYear.toISOString().split('T')[0],
        metadata: { "vaccine": "COVID-19", "doses": "3" }
      },
      {
        cred_type: "Visa",
        issuer: "USA",
        id_number: "USA-VISA-456789",
        valid_from: past1Year.toISOString().split('T')[0],
        valid_to: nextYear.toISOString().split('T')[0],
        metadata: { "type": "B1/B2", "category": "Visitor" }
      },
      {
        cred_type: "Visa",
        issuer: "Canada",
        id_number: "CAN-VISA-123456",
        valid_from: past2Years.toISOString().split('T')[0],
        valid_to: nextYear.toISOString().split('T')[0],
        metadata: { "type": "visitor", "category": "V-1" }
      }
    ],
    last_updated: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    version: "1.0"
  },
  "WALLET-002": {
    wallet_id: "WALLET-002",
    owner: {
      traveler_id: "TRAV-002",
      full_name: "Mariam K.",
      nationality: "GE",
      date_of_birth: new Date(1988, 9, 2).toISOString().split('T')[0],
      frequent_traveler: false,
      risk_flags: ["overstay_history"],
      system_alerts: [
        { source: 'Europol', type: 'warning', message: 'Subject linked to network with known overstay patterns.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { source: 'Customs Intel', type: 'info', message: 'Previous travel involved high-value personal electronics.', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }
      ],
      crossing_history: [
        { date: new Date(2022, 8, 15).toISOString().split('T')[0], origin: 'GE', destination: 'FR', outcome: 'Secondary Inspection' },
        { date: new Date(2021, 2, 10).toISOString().split('T')[0], origin: 'FR', destination: 'GE', outcome: 'Approved' },
      ]
    },
    credentials: [
      {
        cred_type: "eID",
        issuer: "GE Government",
        id_number: "GE99887766",
        valid_from: past3Years.toISOString().split('T')[0],
        valid_to: nextYear.toISOString().split('T')[0],
        metadata: { "document_type": "passport", "mrz_check": "passed" }
      },
      {
        cred_type: "Visa",
        issuer: "Schengen",
        id_number: "SCH-554433",
        valid_from: past1Year.toISOString().split('T')[0],
        valid_to: nextYear.toISOString().split('T')[0],
        metadata: { "type": "multiple_entry", "category": "C" }
      },
    ],
    last_updated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    version: "1.0"
  },
  "WALLET-003": {
    wallet_id: "WALLET-003",
    owner: {
      traveler_id: "TRAV-003",
      full_name: "Igor S.",
      nationality: "UA",
      date_of_birth: new Date(1979, 0, 27).toISOString().split('T')[0],
      frequent_traveler: false,
      risk_flags: ["past_refusal"],
      system_alerts: [
        { source: 'Interpol', type: 'critical', message: 'Red Notice: Subject wanted for questioning in relation to financial crimes.', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { source: 'National Police', type: 'warning', message: 'Name matches subject with history of undeclared goods.', timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
      ],
      crossing_history: [
        { date: new Date(2023, 1, 1).toISOString().split('T')[0], origin: 'UA', destination: 'PL', outcome: 'Denied' },
        { date: new Date(2022, 6, 12).toISOString().split('T')[0], origin: 'PL', destination: 'UA', outcome: 'Approved' },
      ]
    },
    credentials: [
      {
        cred_type: "eID",
        issuer: "UA Government",
        id_number: "UA55555555",
        valid_from: past10Years.toISOString().split('T')[0],
        valid_to: nextYear.toISOString().split('T')[0],
        metadata: { "document_type": "passport", "mrz_check": "passed" }
      }
    ],
    last_updated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    version: "1.0"
  }
};

export const WALLETS = walletsData;

export const computeRiskScore = (wallet: DigitalWallet, ctx: CrossingContext): RiskResult => {
  let score = 10;
  const explanations: string[] = [];

  // System Alerts
  wallet.owner.system_alerts.forEach(alert => {
    if (alert.type === 'critical') {
      score += 50;
      explanations.push(`CRITICAL ALERT from ${alert.source}: ${alert.message}`);
    } else if (alert.type === 'warning') {
      score += 25;
      explanations.push(`Warning from ${alert.source}: ${alert.message}`);
    }
  });


  // Identity & History Risk
  if (wallet.owner.risk_flags.includes("past_refusal")) {
    score += 40;
    explanations.push("Past border refusal recorded.");
  }
  if (wallet.owner.risk_flags.includes("overstay_history")) {
    score += 30;
    explanations.push("History of overstay in destination country.");
  }

  // Customs-specific risks
  const predefinedGoodsTypes = ["personal", "commercial", "dual-use", "high-risk"];
  if (ctx.goods_type === "dual-use") {
    score += 40;
    explanations.push("Dual-use goods declared – strategic risk.");
  } else if (ctx.goods_type === "high-risk") {
    score += 30;
    explanations.push("High-risk goods category (e.g., excisable / controlled).");
  } else if (ctx.goods_type === "commercial") {
    score += 15;
    explanations.push("Commercial shipment, additional scrutiny required.");
  } else if (ctx.goods_type && !predefinedGoodsTypes.includes(ctx.goods_type)) {
    score += 5; // Small risk for any non-standard "other" goods.
    explanations.push(`Custom goods type declared: ${ctx.goods_type}.`);
  }

  if (ctx.declared_goods_value > 10000) {
    score += 25;
    explanations.push("High total value > 10,000 EUR.");
  } else if (ctx.declared_goods_value > 5000) {
    score += 10;
    explanations.push("Medium goods value > 5,000 EUR.");
  }

  if (ctx.num_items > 50) {
    score += 10;
    explanations.push("High number of individual items.");
  }

  // Declaration Behaviour
  if (!ctx.has_customs_declaration && ctx.declared_goods_value > 0) {
    score += 30;
    explanations.push("Goods value declared but no formal customs declaration submitted.");
  }
  
  // Contextual Risk
  if (ctx.border_type === "land" && (ctx.transport_mode === "truck" || ctx.transport_mode === "bus")) {
    score += 15;
    explanations.push("Land border crossing with commercial-type vehicle.");
  }

  // Updated logic: Check for entry into the EU from a non-EU country
  if (ctx.direction === 'entry' && !EU_COUNTRIES.includes(ctx.origin_country) && EU_COUNTRIES.includes(ctx.destination_country)) {
    score += 10;
    explanations.push("Origin from non-EU country for entry into EU zone.");
  }

  // Mitigating Factors
  if (wallet.owner.frequent_traveler && ctx.goods_type === 'personal') {
    score -= 5;
    explanations.push("Frequent traveler with personal goods profile.");
  }

  score = Math.max(0, Math.min(score, 100));

  let level: 'LOW' | 'MEDIUM' | 'HIGH';
  let color: 'green' | 'orange' | 'red';
  if (score < 30) {
    level = "LOW";
    color = "green";
  } else if (score < 60) {
    level = "MEDIUM";
    color = "orange";
  } else {
    level = "HIGH";
    color = "red";
  }

  if (explanations.length === 0) {
    explanations.push("No specific risk factors or alerts triggered; baseline score applied.");
  }

  return {
    score: String(score),
    level: level,
    color: color,
    explanation: explanations.join(" ")
  };
};
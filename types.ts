
export interface Credential {
  cred_type: string;
  issuer: string;
  id_number: string;
  valid_from: string;
  valid_to: string;
  metadata: Record<string, string>;
}

export type TransportMode = 'Terrestrial (Auto)' | 'Terrestrial (Rail)' | 'Air' | 'Maritime';

export interface CrossingHistoryEntry {
  date: string;
  origin: string;
  destination: string;
  outcome: 'Approved' | 'Secondary Inspection' | 'Denied';
  bcp_name: string;
  transport_mode: TransportMode;
  stamp_id?: string;
  customs_clearance_id?: string;
  visa_type?: string;
  stay_limit_days?: number;
  entry_timestamp?: string;
}

export interface SystemAlert {
  source: 'National Police' | 'Europol' | 'Interpol' | 'Customs Intel';
  type: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
}

export interface TravelerProfile {
  traveler_id: string;
  full_name: string;
  nationality: string;
  citizenship: string;
  date_of_birth: string;
  frequent_traveler: boolean;
  risk_flags: string[];
  system_alerts: SystemAlert[];
  crossing_history: CrossingHistoryEntry[];
}

export interface DigitalWallet {
  wallet_id: string;
  owner: TravelerProfile;
  credentials: Credential[];
  last_updated: string;
  version: string;
}

export interface CrossingContext {
  direction: 'entry' | 'exit';
  border_type: 'land' | 'air' | 'sea';
  origin_country: string;
  origin_port: string;
  destination_country: string;
  arrival_port: string;
  transport_mode: 'car' | 'truck' | 'bus' | 'train' | 'air' | 'sea';
  has_customs_declaration: boolean;
  declared_goods_value: number;
  goods_type: string;
  goods_usage: 'personal' | 'commercial' | 'gift';
  num_items: number;
  trip_intent?: 'tourism' | 'business' | 'transit' | 'family_visit' | 'other';
}

export interface RiskFactor {
  category: 'identity' | 'customs' | 'alert';
  message: string;
}

export interface DecisionNode {
  node_name: string;
  status: 'PASSED' | 'FLAGGED' | 'CRITICAL';
  observation: string;
}

export interface RiskSubResult {
  score: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  color: 'green' | 'orange' | 'red';
  factors: RiskFactor[];
  decision_path: DecisionNode[];
}

export interface RiskResult {
  border?: RiskSubResult;
  customs?: RiskSubResult;
  overall_level?: 'LOW' | 'MEDIUM' | 'HIGH';
}

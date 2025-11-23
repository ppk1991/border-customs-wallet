export interface Credential {
  cred_type: string;
  issuer: string;
  id_number: string;
  valid_from: string; // Using string for date to simplify
  valid_to: string;
  metadata: Record<string, string>;
}

export interface CrossingHistoryEntry {
  date: string;
  origin: string;
  destination: string;
  outcome: 'Approved' | 'Secondary Inspection' | 'Denied';
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
  date_of_birth: string; // Using string for date
  frequent_traveler: boolean;
  risk_flags: string[];
  system_alerts: SystemAlert[];
  crossing_history: CrossingHistoryEntry[];
}

export interface DigitalWallet {
  wallet_id: string;
  owner: TravelerProfile;
  credentials: Credential[];
  last_updated: string; // Using string for datetime
  version: string;
}

export interface CrossingContext {
  direction: 'entry' | 'exit';
  border_type: 'land' | 'air' | 'sea';
  origin_country: string;
  destination_country: string;
  transport_mode: 'car' | 'truck' | 'bus' | 'train' | 'air' | 'sea';
  has_customs_declaration: boolean;
  declared_goods_value: number;
  goods_type: string;
  num_items: number;
}

export interface RiskResult {
  score: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  color: 'green' | 'orange' | 'red';
  explanation: string;
}
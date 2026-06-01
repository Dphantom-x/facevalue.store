// Shared client/server data shapes (mirror the API responses).
export type Drop = {
  id: string;
  artist: string;
  event: string;
  venue: string;
  date: string;
  faceValue: number;
  remaining: number;
  totalInventory: number;
  maxPerHuman: number;
  mode: string;
};

export type Trust = {
  allow: boolean;
  route: string;
  score: number | null;
  tier: string | null;
  riskLevel: string | null;
  reasons: string[];
  agentName: string | null;
  worldIdVerified: boolean;
  agentId: string;
  chain: string;
};

export type PurchaseResp = {
  decision: string;
  message: string;
  ticketId?: string;
  remaining?: number;
  faceValue?: number;
  stage?: string;
  code?: string;
  trust?: Trust;
};

export type ApiResp<T> = { status: number; data: T };

// Small formatting helpers + the demo agent constants (ported from the design's FV.* helpers).
export const FAN_AGENT = { agentId: "25459", chain: "ethereum" };
export const SCALPER_AGENT = { agentId: "1226", chain: "solana" };

export function fmtMoney(n: number): string {
  return "$" + Number(n).toLocaleString("en-US");
}

export function shortHash(h: string | null): string {
  if (!h) return "—";
  return h.slice(0, 8) + "…" + h.slice(-4);
}

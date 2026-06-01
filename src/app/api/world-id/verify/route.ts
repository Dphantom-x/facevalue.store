import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

/**
 * POST /api/world-id/verify
 *
 * SIMULATED World ID proof-of-personhood for the demo. Returns a `nullifierHash`
 * that uniquely identifies a (human, action) — our one-ticket-per-human key.
 *
 * To go LIVE: set WORLDID_REAL=1 and verify the IDKit proof here (verifyCloudProof
 * and/or Valiron.verifyWorldId), returning the real nullifier_hash. See CLAUDE.md (Phase 3).
 */
export async function POST(req: NextRequest) {
  if (process.env.WORLDID_REAL === "1") {
    const proof = await req.json().catch(() => null);
    // TODO(real): verifyCloudProof(proof, app_id, action) + Valiron.verifyWorldId(...)
    return NextResponse.json(
      { error: "Real World ID verification not yet wired", gotProof: !!proof },
      { status: 501 }
    );
  }

  const nullifierHash = "0x" + randomBytes(24).toString("hex");
  return NextResponse.json({
    ok: true,
    simulated: true,
    nullifierHash,
    verificationLevel: "device",
  });
}

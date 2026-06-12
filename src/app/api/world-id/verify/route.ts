import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHmac } from "crypto";
import { getSessionUser, bindNullifier } from "@/lib/auth";

/**
 * POST /api/world-id/verify
 *
 * SIMULATED World ID proof-of-personhood. Returns a `nullifierHash` — the
 * unique-per-(human, action) value that is our one-ticket-per-human key.
 *
 * Logged-in: the nullifier is DETERMINISTIC per user (re-verifying returns the
 * same one — exactly how real World ID nullifiers behave) and is BOUND to the
 * account (one human = one account, enforced by a uniqueness check).
 * Logged-out (legacy demo pages): returns a random nullifier, as before.
 *
 * To go LIVE: set WORLDID_REAL=1 and verify the IDKit proof here
 * (verifyCloudProof and/or Valiron.verifyWorldId). See CLAUDE.md.
 */
export async function POST(req: NextRequest) {
  if (process.env.WORLDID_REAL === "1") {
    const proof = await req.json().catch(() => null);
    return NextResponse.json(
      { error: "Real World ID verification not yet wired", gotProof: !!proof },
      { status: 501 }
    );
  }

  const user = getSessionUser(req);

  if (!user) {
    // Legacy demo behavior — random human each call.
    const nullifierHash = "0x" + randomBytes(24).toString("hex");
    return NextResponse.json({
      ok: true,
      simulated: true,
      nullifierHash,
      verificationLevel: "device",
    });
  }

  // Deterministic per human (per account) — idempotent re-verification.
  const nullifierHash =
    user.nullifierHash ??
    "0x" +
      createHmac("sha256", process.env.WORLDID_SIM_SECRET || "fv-worldid-sim")
        .update(user.id)
        .digest("hex")
        .slice(0, 48);

  const bound = bindNullifier(user.id, nullifierHash);
  if (!bound.ok) return NextResponse.json({ error: bound.error }, { status: 409 });

  return NextResponse.json({
    ok: true,
    simulated: true,
    bound: true,
    nullifierHash: bound.nullifierHash,
    verificationLevel: "device",
  });
}

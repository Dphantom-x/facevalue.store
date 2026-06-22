# FaceValue "The Fusion" — CapCut Build Guide (Animation · Titles · Sound)

Tailored to your 42s, 1:1, no-VO promo. Where it says **panel**, **tab**, or **diamond**, those are the literal CapCut Desktop (Windows) control names. Brand-matched to your actual tokens: serif display = **Newsreader**, body = **Hanken Grotesk**, mono = **JetBrains Mono**, accent blue **#3257e8**, verified green **#1c9d6b**, ink **#1b1e26**. The end card is monochrome — the only places color is *allowed* to leak in are the **"✓"** and **"Built on Valiron"** (use the blue), and the live-ALLOW moment (green). Everything else: white on black.

---

## 1. CAPCUT PROJECT SETUP → 1:1 (1080×1080)

1. **New Project** (CapCut has no ratio dialog at creation — you set it in the editor).
2. Drop ONE clip on the timeline so the **Player** wakes up. Top of the **Player** preview → **Ratio** dropdown → **1:1**. Canvas snaps square. **Do this first**, before placing any text or framing — everything you lay out now is measured against the square.
   - If your build (≈v5.9+) only shows presets and no "Custom" field, that's fine: the **1:1 preset = 1080×1080** once you set 1080p at export. You do not need custom input.
3. **Frame rate:** CapCut inherits fps from your first clip and finalizes it at export. Decide now and stay consistent: **30 fps** unless you shoot 60. For the SNAP whip (Section 4) you want frames you can count — 30 fps means each frame ≈ 33 ms, and a 4-frame whip ≈ 0.13s. If you shoot 60, a whip is 6–8 frames. Don't mix.
4. **Safe area:** CapCut has **no labeled safe overlay**. Eyeball an inner **~10% margin** on all four sides (≈108px in from each edge on a 1080 canvas) and keep all text inside it — X overlays a play button and crops the feed preview. Two ways to enforce it:
   - Temporarily enable a **grid** in the Player and align to the inner thirds, or
   - Build a one-time **guide PNG**: a transparent 1080×1080 with a thin 108px-inset rectangle. Drop it on the top track while you place titles, then delete/disable it before export. (This is one asset Claude can render for you — see Section 8.)
5. **Bottom third stays clear of the logo.** Your title cards live in the vertical center; the end-card logo sits dead-center. Keep the very bottom ~120px empty so X's UI doesn't clip "facevalue.store."

---

## 2. THE END CARD (logo reveal + 4s hold) — fully pre-shoot-able

This is the one piece you can finish 100% today. Black 1080×1080, logo reveals clean, four text lines, holds ~4s, soft sound underneath. Target total length **~5.5s** (0.6s fade-up + reveal, then ~4s hold, then ~0.8s it can sit before the music tail ends).

### 2a. Build the black bed
- **Media → Upload** a solid black 1080×1080 PNG (or use CapCut's **Background → Color → black** on an empty track). Put it on **Track 1**. Length ~5.5s.

### 2b. Import + place the logo (the same PNG you flash at 0:20)
1. **Media → Upload** your logo PNG (must have transparency).
2. Drag it onto **Track 2** (above black). In the **Player**, drag to center; use the Player's **horizontal + vertical center** alignment buttons for true dead-center. Scale it to sit in the upper-middle (~38–42% canvas height) so the four text lines have room beneath it.

### 2c. The clean logo reveal (keyframes — exact values)
Select the logo clip. In the right panel you'll see the **diamond** keyframe icons next to **Scale**, **Position**, **Opacity**.
1. Playhead at logo **start (0.0s)**:
   - **Opacity** → set **0** → click its **diamond** (keyframe 1).
   - **Scale** → set **92%** → click its **diamond** (keyframe 1).
2. Playhead at **+0.6s**:
   - **Opacity** → **100**
   - **Scale** → **100%**
   CapCut auto-creates the in-between keyframes. You now have a clean fade-up + a 92→100% settle. This reads as "premium settle," not "slide-in gimmick."
3. **Ease it:** open the keyframe **Speed/Graph editor** (or **Alt+K**) and set **Ease Out** on the second keyframe so it's fast-then-slow.
4. Optional luxe touch: add a third keyframe at **+2.5s** nudging **Scale to 101%** — an almost-imperceptible breathing drift while it holds. Don't exceed 101%.
5. **Hold:** after the last keyframe, **drag the clip's right edge** out so the logo sits frozen for **~4s**. With no further keyframes the values stay locked — it's perfectly still.

### 2d. The four text lines (Newsreader-style display + mono accent)
Add these as **separate text clips** on **Track 3**, stacked vertically below the logo, so you can stagger their fade-ins. Use **Text → Add Text** for each.

- Line 1: **`FaceValue`** — serif/display feel. Pick **Newsreader** if it's in CapCut's font list; if not, the closest elegant serif (e.g. a "Times/Playfair"-style). Size large, white **#FFFFFF**, bold off (Newsreader reads premium at regular/medium weight).
- Line 2: **`Real fans. Real tickets. Face value.`** — Hanken Grotesk-style sans (any clean grotesk), white, medium. Smaller than line 1.
- Line 3: **`Built on Valiron`** — same sans, set the fill to the **accent blue #3257e8** (this is the *only* colored text on the card besides the ✓). Smaller still.
- Line 4: **`facevalue.store`** — **JetBrains Mono**-style monospace if available, otherwise any mono; color **#767d8a** (muted) so the URL recedes. Sit it just above the safe-area bottom margin.
- If you want the brand tagline check, render **`Face value ✓`** with the ✓ in green **#1c9d6b** — but only do this if it doesn't crowd the four lines; usually skip on the end card to keep it clean.

**Legibility on black is easy** — you don't need stroke or scrim here (the bed is pure black). Just make sure the white is true #FFFFFF and don't apply shadow (unnecessary on black, and it muddies serif edges).

### 2e. Stagger the text fade-ins
For each text clip: **Animation → In → Fade**, duration **0.4s**. Offset their **start times** so they cascade after the logo settles:
- Logo settled at 0.6s.
- Line 1 (FaceValue) starts **0.7s**.
- Line 2 starts **0.95s**.
- Line 3 (Built on Valiron) starts **1.2s**.
- Line 4 (URL) starts **1.45s**.
All hold to the end. No **Out** animation — they should still be on screen when the video ends (or add a shared 0.4s **Fade Out** on the final 0.4s if you want it to dissolve to black).

### 2f. Sound under the end card
- A single **soft "confirm" / resolve tone** as the logo completes its settle (~0.6s mark) — search the **Sound effects** tab for **"confirm," "soft ding," "UI success."** Keep it quiet (−10 to −14 dB).
- The **calm half of your music arc** (Section 5) resolves and tails out under the hold. Add a **1.5s Fade Out** on the music so it doesn't clip.

---

## 3. THE FIVE TITLE CARDS

Since there's no VO, these carry the entire message. Build all five today as **text clips with placeholder timing**, then slide them to the exact frames once footage is in.

### 3a. The reusable RECIPE (apply identically to all 5)
1. **Add:** park playhead → **Text → Add Text** → type the line.
2. **Frame:** drag to **vertical center**, inside the **10% safe margin**. Max **2 lines**; if a line is long, break it deliberately (see per-card breaks below).
3. **Style for "legible muted"** (these must read even when someone scrolls past at low attention, and over your grimy footage in cards 1–2):
   - **Font:** clean grotesk (Hanken Grotesk-style), **white #FFFFFF**, **medium/semibold**.
   - **Stroke** (Basic tab → Stroke): enable, **dark / #1b1e26**, low thickness (~6–8%). This is the single most reliable readability fix over busy footage.
   - **Background** (Basic tab → Background): toggle ON a **semi-transparent black scrim box**, opacity **~35–45%**. Subtle — it's a legibility pad, not a label.
   - **Do NOT** stack heavy shadow + glow + stroke. Stroke + light scrim is enough. Monochrome only — no colored title text except where noted (card 5 / end card).
4. **In / Out animation:** **Animation → In → Fade** (0.3s) as the default; **Out → Fade** (0.3s). Two cards get a different In (specified below). Keep durations short — fast fades read premium; slow drifts read amateur.
5. **Duration on screen:** each card **~2.5–3.0s** readable. Drag either edge to set length; zoom the timeline (bottom-right slider) and snap edges to the playhead for frame-accuracy.

### 3b. The five cards — placement, animation, and the SFX that hits each

| # | Text (with line break) | ~Time | In animation | SFX that lands ON it |
|---|---|---|---|---|
| 1 | `Real fans get shut out.` / `Every single drop.` | 0:15 | **Fade** 0.3s | **Ticking countdown** runs under it; layer **rapid tap SFX** + a **freeze/error sting** as the "shut out" beat hits |
| 2 | `So we built the gate.` | 0:20 | **NONE — hard cut on the SNAP** (let the whip + impact reveal it; see §4) | **Riser → clean impact** on the SNAP; the card appears on the impact frame |
| 3 | `A real Valiron check.` / `Not scripted.` | 0:26 | **Fade** 0.3s (or **Typewriter** on line 1 only, ~0.6s, to feel "live/terminal") | **Single soft UI tap**, then **near-silence**, then the **"confirm" tone** on the live ALLOW |
| 4 | `No fighting. No bots.` / `You just get in.` | 0:31 | **Rise / Slide-up** 0.4s (calm, confident — matches the "clean world") | **Bright "you're in" chime** on "get in" |
| 5 | `Real fans. Real tickets. Face value.` / `Built on Valiron.` | end card | Handled by §2 (this IS the end card text) | Soft confirm tone + music resolve |

**Notes that matter for this video:**
- **Card 2 is special:** don't give it a Fade-In. The *transition itself* is the reveal — the whip blur clears and "So we built the gate." is already on the clean frame. That's what makes the SNAP land.
- **Card 3 ("Not scripted")** is your credibility line — pairing **Typewriter** on "A real Valiron check." with **near-silence then a confirm tone** mirrors the actual product (a real terminal call). It's worth the extra 30 seconds to set the Typewriter In duration so the type finishes right as the ALLOW resolves.
- **Card 1's stroke+scrim is non-negotiable** — it sits over the grimy "old way" footage, the busiest background in the piece.

---

## 4. TRANSITIONS

### 4a. The ~0:20 hard SNAP (grimy → clean FaceValue world)
This is the hinge of the whole edit. Two ways; do **Option A** unless you have time to hand-animate.

**Option A — built-in whip (fastest premium result):**
1. Butt the last "old way" clip and the first "clean" clip together on the **same track** (the SNAP needs a real cut point — a seam between two clips, not one clip).
2. Trim the cut so it lands exactly on the **music's impact beat** (use beat markers, §5).
3. **Transition** tab (top toolbar) → **Camera** category → **Camera Blur / Whip** (or **Spin Blur** for more violence). Double-click to drop it on the seam.
4. Click the seam's transition icon → **Duration ≤ 0.3s** (short = snappy), **Ease In/Out** on. Align so the blur peak sits on the fastest motion.
5. For extra punch, add a **2–4 frame Flash** (Transition → **Light/Hit** → Flash) — but only if the whip alone feels soft. Don't double up to the point of seizure.

**Option B — custom whip (full control, if footage cooperates):**
- Keyframe **Position** to fling clip A off-frame (e.g. X: 0 → −1080) over **4 frames**, and clip B in from the opposite side (X: +1080 → 0) over the next **4 frames**. Add **motion blur** if your CapCut build exposes it. Snap the midpoint to the beat. This is the cleanest "impact cut" but needs the shots framed to allow the fling.

**The sound is half the SNAP:** a **riser** that *ends exactly on the cut frame*, then a **clean impact/boom** on the cut. Build the riser to resolve on the beat marker, not after it (§5).

### 4b. The fade to the end card
- Simplest and cleanest: on the **last live clip**, drag the **Fade Out** slider (Basic panel) to ~**0.6s** so it fades to black, then **hard-cut into the black end-card bed** (§2). Because the bed is already black, the eye reads one continuous fade-to-black → logo reveal.
- Alternative: apply a **Cross Fade / Dissolve** transition (≤0.8s) on the seam between the last clip and the black bed. Either works; the manual Fade Out is more predictable.
- Time it so the **logo reveal (§2c) begins right as black is reached** — the confirm tone + music resolve should feel like the payoff of the fade.

---

## 5. SOUND DESIGN IN CAPCUT

No VO means **sound + titles are the whole soundtrack of meaning.** Build the SFX/music selection today; place final hits once footage exists.

### 5a. Add music + SFX
- Left toolbar → **Audio** → sub-tabs **Music** and **Sound effects**. Hover to preview, click **+/download** to drop at the playhead.
- **Put SFX on their own tracks above the music** so you can nudge each ±1–2 frames onto a cut. Stagger different SFX on different tracks; trim tails so they don't muddy each other.
- **Your own/royalty-free files:** **Audio → Upload** (MP3/WAV/M4A).

### 5b. The two-act music arc (tense → calm) + ducking
- Use **two tracks** or one track split at the SNAP: **Act 1 = tense** (ticking, pulse, rising tension) under 0:00–0:20; **Act 2 = calm/confident** (warm, resolved) from the SNAP to the end card. Cut the swap **on the SNAP beat**.
- **Beat sync:** right-click the music clip → **Add Beat Markers** (yellow dots). For syncopated tracks, play and tap **M** to hand-place. Snap your cuts (especially the SNAP) and the end-card reveal to markers.
- **Ducking (no one-click auto-ducker in CapCut desktop — do it with volume keyframes):** under each emphasis SFX (the freeze sting, the confirm tone, the "you're in" chime, the SNAP impact), set **four volume keyframes** on the music to form a **V-dip**: two at full just before/after, two lowered (**−12 to −18 dB**) across the SFX. This makes the key SFX pop without muting the bed. Repeat per emphasis beat.
- **Fades:** Basic panel → **Fade in/out** sliders, ~1–1.5s on the music head/tail so nothing clips. End-card music gets a **1.5s Fade Out**.

### 5c. Mapped SFX cue sheet (search terms in the **Sound effects** tab)

| Beat (~time) | SFX | Search the SFX tab for | Notes |
|---|---|---|---|
| 0:00–0:18 | **Ticking countdown** | "clock," "tick," "countdown" | Runs under Act 1; builds dread of the drop |
| during taps | **Rapid tap SFX** | "click," "tap," "keyboard," "UI click" | Sync to on-screen taps; ±1–2 frames |
| 0:14–0:16 | **Freeze / error sting** | "error," "glitch," "buzzer," "stinger" | Lands on "shut out" (card 1); duck music under it |
| ~0:18 | **Unlock ping** | "unlock," "notification," "ping" | The hinge — the gate opening before the SNAP |
| **0:20** | **Riser → clean impact** | "riser," "build-up" + "impact," "boom," "hit" | Riser **ends on the cut frame**; impact **on** the cut. The signature moment |
| (diegetic) | **Actor's "no no no"** | from your footage | Keep it **diegetic** — sits in the old-way section, ducked just under the riser. Don't replace with library SFX |
| ~0:24 | **Single soft UI tap** | "soft tap," "pop," "click" | One deliberate tap before the live check (card 3) |
| ~0:26 | **Near-silence → "confirm" tone** | "confirm," "success," "approve tone" | Drop music to near-zero for ~0.5s, then the confirm tone on the live **ALLOW**. This sells "real, not scripted" |
| ~0:32 | **Bright "you're in" chime** | "chime," "sparkle," "ding," "positive" | On "You just get in" (card 4) |
| end card | **Soft confirm/resolve tone** | "soft ding," "resolve," "UI success" | Under the logo settle; quiet |

### 5d. ⚠️ Licensing caution (this is going to X AND a Valiron feature — i.e. branded/commercial)
- **Do not assume CapCut's built-in Music library is cleared.** Per ByteDance terms, library tracks are licensed **personal, non-commercial**, and the "trending/licensed song" clearances cover **TikTok only** — they **do not extend to X**. Branded/promo content = commercial use regardless of platform. Off-platform, recognizable music gets caught by **Content ID** (muted/struck) within minutes.
- **CapCut Pro** carries a broader commercial license for much of the library but is **not** a blanket safe-harbor for label songs.
- **Safest path for an X + sponsor-featured post:** source **both music and the recognizable SFX** from truly royalty-free, no-attribution libraries and **Audio → Upload** them:
  - **Pixabay** (Pixabay License, CC0-style, ~30k tracks + 120k+ SFX, no credit needed) — pixabay.com/music + pixabay.com/sound-effects
  - **Mixkit** (Mixkit License, free, no attribution, explicitly OK for social/ads) — mixkit.co/free-sound-effects
- CapCut's **own SFX** (ticks, whooshes, UI clicks, impacts) are far lower-risk than recognizable music, but for a sponsor-facing piece, sourcing the **music** from Pixabay/Mixkit is the clean call. The generic SFX you can pull from CapCut's library if needed.

---

## 6. EXPORT SETTINGS for X (1:1)

In **Export**:
- **Resolution:** **1080p** → yields **1080×1080** at 1:1. (Don't export 4K — X re-compresses and 1080 looks cleaner.)
- **Frame rate:** **30 fps** (or match source; only use 60 if you shot 60 — never up-convert).
- **Bit rate:** **"Higher"**, or **Custom ≈ 20–25 Mbps**, **VBR** if offered. Overshoot deliberately — X re-encodes, so a high feed bitrate preserves detail.
- **Codec:** **H.264** (NOT HEVC/H.265 — X handles H.264 most reliably).
- **Format:** **MP4**. **Audio: AAC, 48 kHz, ≥256 kbps.**
- **Constraints:** keep **under 512 MB** and **≤140s** (you're at ~42s — fine).
- All burned-in text/titles render into the frame automatically on export. **Do not** export an SRT — X won't show it in-feed, and your titles are the burned-in layer anyway.

---

## 7. BUILD-NOW vs NEEDS-FOOTAGE

### ✅ Build TODAY (pre-shoot)
- [ ] **Project template:** new 1:1 project, 30 fps decided, the **108px safe-area guide PNG** on a top track.
- [ ] **End card (Section 2) — finish it entirely:** black bed + logo reveal keyframes (0→100 opacity, 92→100% scale, ease-out) + four text lines (FaceValue / tagline / Built on Valiron in blue / facevalue.store in muted mono) + staggered fades + soft confirm tone + music resolve tail. Export a standalone copy so it's locked.
- [ ] **All five title cards** as styled text clips (white, stroke #1b1e26, ~40% black scrim) on a track at placeholder times — text, framing, and animation presets all set. You'll just slide them later.
- [ ] **SFX/music selection:** download the full cue sheet (§5c) from **Pixabay/Mixkit** and CapCut's SFX tab; lay the **two-act music arc** on the timeline with beat markers added. Pre-place the **ticking**, **riser**, **impact**, **confirm tone**, **chime** roughly.
- [ ] **The mid-video logo flash (~0:20):** it's the same PNG as the end card — pre-build a 4–6 frame flash clip (logo, short, with a 2-frame in/out fade) so it's ready to drop on the SNAP.

### 🎬 WAITS for the shoot
- [ ] The **grimy "old way"** footage and the **clean FaceValue** footage either side of the SNAP.
- [ ] The actor's **diegetic "no no no"** (it comes off the footage's own audio — keep it, duck it).
- [ ] The **real live Valiron ALLOW** screen capture (record the real run per VIDEO_SCRIPT.md — `npm run warm` first; the on-screen ALLOW + `…ms` must be genuine).
- [ ] **Final SNAP construction** (needs both clips to butt against) and **final SFX placement to frames** (needs the cuts locked).
- [ ] **Ducking V-dips** (need the real SFX sitting on real cuts).

---

## 8. CAN AI EDIT THIS FOR YOU? (honest answer + the real path)

**No tool drives your CapCut timeline for you, and no Google model edits footage you hand it.** But an AI coding assistant CAN render finished, drop-in assets you import into CapCut. Here's the truthful breakdown for THIS video:

- **CapCut's own AI** is assistive, not autonomous: auto-captions (you'd proofread "FaceValue / Valiron / World ID" — it mis-transcribes brand terms every time), AutoCut, background removal, auto-color. All run **inside** CapCut on your timeline — **there's no public API for an external agent to operate the editor.** And you have **no VO**, so auto-captions are irrelevant here anyway; your text is the burned-in title layer you build by hand.
- **Gemini / Veo can't edit your timeline.** Veo only "extends" its *own* prior generations; everything else is **generation**, not editing — it will not trim, rearrange, add your title overlays, or burn text onto your raw footage. Useful only if you wanted *new* generated B-roll, which this piece doesn't need.
- **The real programmatic path — what Claude (me) can render for you as finished files:**

**Worth having me render programmatically (FFmpeg — low effort, deterministic, best ROI):**
- ✅ **The entire end card as a finished MP4** — black bed + your logo PNG faded/scaled in + the four text lines, exact timing, exact brand colors (#3257e8, #1c9d6b, muted mono URL), with the confirm-tone + music muxed under it. Render once, import as a single clip, done. This removes all the per-line CapCut fiddling in Section 2.
- ✅ **The five title cards as transparent-background PNGs (or short MOVs)** — pixel-exact Newsreader/Hanken/JetBrains type, correct stroke + scrim, sized to the 1:1 safe area. You drop them on a track and only set timing. More consistent than re-styling five text clips by hand.
- ✅ **The 108px safe-area guide PNG** and **the mid-video logo-flash clip** (4–6 frame fade).
- ✅ A **muxed scratch audio bed** (ticking → riser/impact → confirm → chime laid to a rough timeline) you can drop in as one reference track, then refine in CapCut.

**Keep in CapCut by hand (needs live judgment against footage):**
- ❌ The **SNAP whip** — it must align to *your* footage's fastest motion frame and the music beat; do it in CapCut against the real clips.
- ❌ **Final SFX-to-frame placement and the ducking V-dips** — these are timing calls against the actual cuts.
- ❌ Anything touching the **real Valiron capture**.

**Recommendation:** have me render the **end card MP4** and the **five title PNGs** + the **guide/flash** assets now — those are deterministic, brand-exact, and erase the most tedious CapCut steps. Build the **SNAP, the SFX sync, and the live-ALLOW** by hand in CapCut once footage is in. If you want, point me at the **logo PNG path and a black-bg confirmation** and I'll produce the end-card MP4 and the title-card PNGs with FFmpeg.

---

**Relevant files reviewed (absolute paths):**
- `C:\Users\aldom\Desktop\antigravity\facevalue\docs\VIDEO_SCRIPT.md` — the 120s demo script (the *other* video; confirms the live-Valiron ALLOW capture flow and `npm run warm`/`POST /api/dev/reset` reset for the screen-record element of this promo).
- `C:\Users\aldom\Desktop\antigravity\facevalue\src\app\globals.css` — brand tokens used to spec exact end-card/title colors and fonts (accent `#3257e8`, fan-green `#1c9d6b`, ink `#1b1e26`, muted `#767d8a`; Newsreader / Hanken Grotesk / JetBrains Mono).
- Logo PNG: not found in-repo (only `public/*.svg` placeholders and `design/`, `walkthrough/` screenshots exist) — the FaceValue logo image the user references is held outside the repo; supply its path if you want the end-card MP4 / title PNGs rendered.
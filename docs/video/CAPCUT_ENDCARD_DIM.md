# Two CapCut Moves, Properly Understood

A beginner's guide to (A) a clean end-card reveal and (B) dimming your background when a title-card fades in — CapCut **desktop**, 2026 UI. Written to teach the *why*, so you can reuse these on any future edit, not just this 42-second promo.

First, a 30-second map of the screen so the steps make sense. CapCut desktop has four zones: **top-left** = your Media/Import library, **top-center** = the Player (preview), **top-right** = the **Inspector** (the context panel — its tabs change depending on what you've selected: Video, Audio, Animation, etc.), and the **bottom** = the Timeline (your tracks). Almost everything below happens in the **Inspector** and the **Timeline**.

---

## 1. The mental model (read this once — it unlocks everything)

Four ideas. Get these and the rest is just clicking.

**1. Tracks stack top-over-bottom.** Your timeline has layers. Whatever sits on a **higher track is drawn on top** of what's below it. This is literal and it is the single most important rule in this guide. Text on a track above footage = text appears over footage. A dark layer between them = footage gets darkened but the text on top stays bright. You'll lean on this constantly.

**2. Keyframes = "set a value here, a different value there, CapCut animates the in-between."** A keyframe is a saved snapshot of one property (opacity, scale, brightness…) at one moment in time. Set Opacity = 0 at point A, then Opacity = 100 at point B, and CapCut **automatically fills every frame between** so the clip smoothly fades up. You're not animating frame-by-frame; you're dropping two pins and letting CapCut connect them. The button that drops a pin is a small **diamond (◆)** next to each property.

**3. Three different things can create motion — don't confuse them:**
- **An Animation preset** (Inspector → **Animation** tab) = a *built-in* in/out move for **that one clip**. One click, one slider. Think "Fade In," "Fade Out." Fast, but you get limited control.
- **A manual keyframe** (the ◆ diamonds in **Video → Basic**) = *you* define the exact values and timing. More steps, total control. This is how you get a "fade *plus* a subtle scale" — something a single preset can't do as precisely.
- **An Adjustment layer** = a *separate transparent clip on its own track* whose only job is to **change everything on the tracks beneath it** (e.g. darken). It's not motion on one clip; it's a tinted sheet of glass laid over the layers below.

**4. The Inspector is where the controls live.** Select a clip, look top-right. For visuals you'll use the **Video** tab → its **Basic** section at the top, which holds **Position, Scale, Rotation, Opacity** — each with a ◆ diamond beside it. That diamond is your keyframe toggle. Memorize that location; both techniques return to it.

> One naming heads-up CapCut itself warns about: they reorganize menus between versions. If a button isn't exactly where I say, it's usually one tab over or reachable via the timeline **+**. The *names* below are current for 2026.

---

## 2. Technique A — the end-card reveal (fade + subtle scale, then hold)

**The goal:** your last footage fades to black, then the end card *loads in* — gently fading up while pushing from 92% to full size (a soft "logo settle"), then sits still on screen for a few seconds.

We'll build it in four moves. I'll use **manual keyframes** for the reveal because they give you the fade-*and*-scale combo cleanly. (If you ever want the 10-second version, the Animation → In → **Fade In** preset alone is a fine, quick substitute — see the note at the end of this section.)

### Step 1 — Put the end card at the very end
- Top-left **Media** panel → **Import** → choose your end-card PNG/JPG. It lands in **Media → Local**.
- **Drag it onto the timeline, flush against the right end of your last clip** — snapping helps it click into place with no gap. Put it on a **track above** your last footage clip (so we can fade to black *underneath* it cleanly).

*Why above, not on the main track:* keeping the card on its own upper track lets the fade-to-black happen on the footage below without touching the card's own animation. Layers doing one job each = fewer headaches.

### Step 2 — Build the reveal with two keyframes (Opacity + Scale)
Select the end-card clip, then open **Inspector → Video tab → Basic** (top of the panel). You'll see Position, Scale, Rotation, Opacity, each with a ◆.

**Set the START (reveal begins):**
1. Drag the **playhead** to the **first frame** of the end card.
2. Set **Opacity = 0** → click its **◆**. (A keyframe pin appears on the clip.)
3. Set **Scale = 92%** → click **Scale's ◆**.

**Set the END (reveal lands) — move forward ~0.5–0.6s:**
4. Drag the playhead **~0.5–0.6 seconds to the right** (this distance *is* your fade duration).
5. Set **Opacity = 100** → CapCut **auto-creates** the second keyframe (you don't re-click the diamond; changing the value at a new playhead position makes the pin for you).
6. Set **Scale = 100%** → second Scale keyframe auto-creates.

You now have a card that fades 0→100 while easing up 92%→100% — that subtle grow reads as the logo "arriving."

*Why 92%, not 50%?* A small scale move (8%) feels like a confident settle. A big one feels like a zoom and draws attention to the motion instead of the logo. Subtle is what makes it look pro.

### Step 3 — Add ease so it doesn't feel robotic
By default CapCut moves between keyframes at a constant speed (linear) — slightly mechanical. Fix it:
- **Right-click one of the keyframe diamonds** on the clip → choose **Ease Out** (or **Ease In and Out**).

*Why Ease Out:* it makes the motion **decelerate as it settles** — fast at first, then gently coming to rest, like a real object stopping. That deceleration is the difference between "animated" and "polished." (Newer builds may show a little curve/graph picker instead of named options; the named **Ease Out** is the reliable path.)

### Step 4 — Hold the card, and fade to black *into* it
**Hold it:** the trick is that both your keyframes sit near the *start* of the clip. After the last keyframe, the values **stay at 100/100 for the rest of the clip's length** — so the card just holds. To set how long it holds:
- **Drag the clip's right edge** rightward to lengthen it, **or**
- Right-click the clip (or use the **Duration / clock icon** above the timeline) → type an exact value. **~4s total** is a comfortable hold for a logo card. (Stills stretch freely — no quality loss.)

**Fade to black into it** — pick one (most cinematic first):

- **A) Black-overlay opacity keyframe (most control):** drop a solid **black clip** on the footage track at the seam, select it, and in **Video → Basic → Opacity** keyframe **0 → 100** across ~0.5–0.8s. The screen darkens to true black, then your card reveals over/after it.
- **B) Animation → Out → Fade Out on the last footage clip:** select the last footage clip → **Inspector → Animation → Out → Fade Out** → set duration ~0.5–0.8s. *Gotcha:* a plain Fade Out reveals whatever track is **beneath** it — if that's not black, you'll fade to *that* instead of black. Put a **black clip underneath** to guarantee true black.
- **C) Fade-to-black transition (quickest):** click the small **transition icon between the two clips** on the timeline → pick **Fade / Dissolve** → drag its edges (or use the slider) to set length.

Keep any of these in the **0.5–1.2s** range — that's the natural-feeling window for a fade.

> **Quick version (if you're short on time):** skip Steps 2–3. Select the card → **Animation → In → Fade In** → set the duration slider to ~0.6s. You lose the scale push but keep a clean fade. Then hold (Step 4) and fade-to-black (Step 4) as above.

---

## 3. Technique B — dim the background behind fading text

**The goal:** when your title-card text fades in, the footage behind it **dims to ~30–40%** so the words pop; when the text fades out, the footage **comes back up** — and crucially, the dim **ramps in and out in lockstep with the text's fade**.

I'll give you the **simplest reliable method first** (a black overlay you keyframe), then the slightly more "correct" alternative (an Adjustment layer). Both produce the same look; pick one.

### The layer sandwich (true for both methods)
From bottom to top: **footage** → **dim layer** → **text**. The dim sits *over* the footage but *under* the text — so the picture darkens and the words stay bright. (Remember rule #1: higher track = on top.)

### Method 1 (simplest, works in every build) — black overlay + keyframed Opacity

**A. Get a black layer on a track between footage and text.**
Easiest route: timeline **+ / Overlay → Color tab → pick black** to add a solid color clip (or import a 1920×1080 black PNG and drag it in). Drop it on a track **above the footage, below the text**.

**B. Trim it to the text.** Drag the black clip's **left and right edges** to line up exactly with the text clip's start and end (snapping helps).

**C. Set the dim depth.** Select the black clip → **Inspector → Video → Basic → Opacity**. ~**35%** is the sweet spot — enough to mute the footage, not so much you lose it. *(Optional richer look: set the black clip's **blend mode to Multiply** — it darkens while protecting highlights.)*

**D. Keyframe Opacity to ramp with the text — this is the part that sells it.**

First, **give the text its fade** so you have exact timestamps to match: select the text → **Animation → In → Fade In** and **Animation → Out → Fade Out**, ~0.5s each. Note on the timeline where the fade-in *finishes* and where the fade-out *begins*.

Now drop **four keyframes** on the black clip's **Opacity** (this 4-point shape — up, hold, down — is exactly why we keyframe instead of using a simple fade):

| # | Move playhead to… | Set Opacity to | What it does |
|---|---|---|---|
| 1 | where the text's **fade-in starts** | **0%** | dim invisible |
| 2 | where the text's **fade-in ends** (text fully in) | **~35%** | dim fully on, *ramped in with the text* |
| 3 | where the text's **fade-out begins** | **~35%** | holds the dim steady while text sits |
| 4 | where the text's **fade-out ends** | **0%** | dim gone, *ramped out with the text* |

How to place them: playhead to position 1 → click the **◆ next to Opacity** (value 0). Move to 2 → set 35% (keyframe 2 auto-creates; the ramp 1→2 now matches the fade-in). Move to 3 → re-enter 35% (holds it flat). Move to 4 → set 0% (ramp 3→4 matches the fade-out). Done.

### Method 2 (the "proper" tool) — Adjustment layer

An **Adjustment layer** is a transparent clip that dims *everything beneath it* by lowering brightness — no black plate needed. Same sandwich, same keyframe logic; you just animate **Brightness** instead of Opacity.

1. **Top toolbar → Adjustment** (last icon in the row above the timeline: Media · Audio · Text · Stickers · Effects · Transitions · Filters · **Adjustment**) → **Custom Adjustment** → click the **+** on its tile. It drops in as its own clip. (Or use the timeline **+ → Adjustment**.)
2. **Drag it to a track above the footage, below the text.** It affects every track under it — so footage dims, text doesn't.
3. **Trim its edges** to the text's duration.
4. Select it → right panel shows **Basic** (Brightness, Exposure, Contrast, Shadows…). Drag **Brightness** (and/or **Exposure**) left to darken — roughly **−30 to −60**, judge by eye.
5. **Keyframe Brightness** with the same 4-point pattern, swapping the values: start at **0 / normal** (fade-in start) → **−45** (fade-in end) → **−45** (fade-out begin) → **0 / normal** (fade-out end).

> **Heads-up on the two "Adjustments":** the **Adjustment _panel_** (appears when you select any clip) only color-corrects *that one clip*. The **Adjustment _layer_** (added from the toolbar) is the standalone clip that affects everything below. You want the **layer**. (An old guide claims CapCut has no adjustment layer — that's outdated; it does.)

*Which to choose?* If you want the absolute-simplest, most predictable ramp, use **Method 1** — Opacity is one obvious slider and impossible to misread. If you'd rather not stack a black plate and prefer a "real" brightness pull, use **Method 2**. Same result on screen.

> **Bonus — if you only want a plate behind the *words* (not the whole frame):** select the text → in the **Text** style panel scroll to **Background**, tick it, set black, lower its opacity. It rides with the text automatically — zero syncing. Use this when a full-frame dim is more than you need.

---

## 4. Putting it together for your 42s promo

A clean running order for the whole piece:

1. **Title-card section (mid-video):** lay footage on the main track, text on top, dim layer sandwiched between. Fade the text in/out (~0.5s), then keyframe the dim **0 → 35% → 35% → 0** to match (Technique B).
2. **End-card section (final ~4s):** fade the last footage to black (overlay/transition/Fade Out), then reveal the end card on the track above with **Opacity 0→100 + Scale 92→100 over ~0.5–0.6s, Ease Out** (Technique A), and **hold ~4s** by dragging its right edge.

### The 3 gotchas that trip up beginners
1. **Layer order.** Text must be **above** the dim layer; the dim must be **above** the footage. Get this wrong and either the dim covers your text (text below) or it does nothing visible (dim below footage). When something looks off, check track order *first*.
2. **Duration mismatch = a visible "pop."** The dim clip's edges (and its first/last keyframes) must land on the **same timecodes** as the text's fade. If keyframe #2 sits before the text finishes fading in, you'll see the dim snap ahead of the words. Line them up; use snapping. *Pro touch:* let the dim ramps run a hair *longer* than the text fades — easing the dim slightly before/after the text reads more cinematic than a perfectly hard match.
3. **Forgetting ease / forgetting black backing.** Linear keyframes feel mechanical — **right-click → Ease Out** on the end-card reveal. And a bare **Fade Out** fades to whatever's underneath, not black — always back it with a **black clip** for a true fade-to-black.

You've got this — both effects are just "two pins and let CapCut connect them," applied to the right property on the right layer. Build the title-card dim once and the end-card reveal once, and you'll never have to look it up again.

---

**Key file references for the reader (none — this is a CapCut UI guide, not code).** All steps live in two places on screen: the **top-right Inspector** (Video → Basic for keyframes; Animation tab for presets) and the **bottom Timeline** (track order, trimming, transitions).
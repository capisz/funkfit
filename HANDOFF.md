# FunkFit — Handoff / Continue on another computer

A React Native (Expo) calorie-tracking app fronted by **Pepper**, a Duolingo-style
skunk coach. This file is everything needed to pick the work back up on a new
machine. Companion docs: `IMPLEMENTATION.md` (architecture) and `.env.example`.

- **Repo:** https://github.com/capisz/funkfit.git
- **Local path (old machine):** `~/Downloads/funkfit`

---

## ⚠️ 0. Before you leave this computer — push your work

As of this handoff, the latest commit is `d103576 "redesign of elephit"`, but the
**entire Duolingo redesign session is uncommitted** in the working tree. Push it or
you'll lose it:

```bash
cd ~/Downloads/funkfit
git checkout -b duolingo-redesign        # optional: work on a branch
git add -A
git commit -m "Duolingo-style redesign: 3D buttons, conversational onboarding, streaks, editable profile"
git push -u origin duolingo-redesign     # or: git push origin main
```

(No `gh` CLI is set up; pushing over HTTPS will use your stored GitHub PAT. None of
these changes touch `.github/workflows`, so the workflow-scope limitation doesn't
apply.)

---

## 1. Set up on the new computer

### Prereqs
- **Node** 18+ and npm (same major you used before is safest).
- **Xcode** + iOS Simulator (for iOS) — required for the *first* native build.
- Optional: `uv` or `pipx` if you later want to install graphify (see §6).

### Get the code + dependencies
```bash
git clone https://github.com/capisz/funkfit.git
cd funkfit
git checkout duolingo-redesign     # if you pushed to a branch
npm install                        # restores node_modules (not committed)
```

### Run it
```bash
npm start          # starts Metro using the LOCAL expo (no global install)
```
Then, in the Metro terminal:
- Press **`s`** until it says **"Using development build"** (NOT "Using Expo Go" —
  Expo Go can't open this project; it's on a newer SDK).
- Press **`i`** to build + open on the iOS simulator.

> **First run on a fresh machine is the slow one.** `i` (or `npx expo run:ios`)
> triggers a native Xcode build (compiles + CocoaPods). It can take several minutes
> and the very first `xcodebuild` may ask for **admin rights** to install Apple
> components. After that first build, the app is installed on the simulator and you
> never rebuild for JS/TS changes.

---

## 2. Day-to-day running (no rebuild, no admin)

Once the dev build is installed on the simulator:
- `npm start` → press **`s`** to "development build" → **tap the funkfit (skunk)
  icon** on the simulator home screen. It connects to Metro on its own.
- **Reload JS:** press **`r`** in the Metro terminal, or **⌘D → Reload** in the sim.
- **Fast Refresh** is on by default — saving a file reloads automatically.
- Stale/odd caching: `npm start -- -c` (clears Metro cache).

**Gotchas learned the hard way:**
- **Never press `i` while it says "Using Expo Go"** — that tries to *download Expo
  Go*, which may be blocked and won't open this project anyway. Press `s` first.
- **Pressing `i` rebuilds via `xcodebuild`** (needs admin). To just *launch* the
  already-installed app, **tap the icon** instead — no admin, no build.
- In the iOS Simulator, **⌘R = Record Screen**, not reload. Use `r` in Metro or ⌘D.

---

## 3. Food search (FatSecret) — currently "not configured"

Food search is **off because no API keys are set**, not because anything was
disabled. `lib/fatsecret.ts` reads `EXPO_PUBLIC_FATSECRET_CLIENT_ID` /
`EXPO_PUBLIC_FATSECRET_CLIENT_SECRET`; only `.env.example` (blank template) exists.

To enable:
```bash
cp .env.example .env
# edit .env, paste your FatSecret Platform API credentials:
#   EXPO_PUBLIC_FATSECRET_CLIENT_ID=...
#   EXPO_PUBLIC_FATSECRET_CLIENT_SECRET=...
npm start -- -c     # restart Metro so the new env is embedded
```

**Important caveats:**
- `EXPO_PUBLIC_*` values are **baked into the app bundle** — the secret is only
  semi-private. For production, proxy FatSecret through a small backend instead of
  shipping the secret (as the original Elephit web app did).
- FatSecret's Platform API enforces **IP whitelisting** in the developer dashboard.
  Even with correct keys, calls fail unless your current public IP is allowed (or IP
  restrictions are cleared). This is the most likely reason it "stopped working."
- Without keys the app is fully usable — food is logged **manually** on the Log Food
  screen (`app/food-log.tsx`).

---

## 4. What changed in the Duolingo redesign session

Hybrid direction: keep the teal/cream brand + Pepper, adopt Duolingo's structure.

**New shared components** (`components/`):
- `DuoButton.tsx` — chunky 3D press-button (built-in `Animated`).
- `SpeechBubble.tsx`, `PepperPrompt.tsx` (onboarding scaffold), `ChoiceCard.tsx`,
  `EditProfileModal.tsx`.

**Onboarding** (`app/onboarding/`) — rebuilt into a conversational, one-question-
per-screen flow: `intro` (Pepper introduces itself) → `name` → `goal` → `sex` →
`age` → `height` → `weight` → `activity` → `health`. Old grouped `body.tsx` removed.
`login.tsx` now routes to `/onboarding/intro`.

**Infra:**
- `contexts/ThemeContext.tsx` — auto light/dark from system (`useColorScheme`) with a
  persisted manual override.
- `lib/onboardingDraft.ts` — draft persisted to AsyncStorage (survives reload).
- `constants/Colors.ts` — added `tealEdge`/`coralEdge`/`sandEdge` tokens.

**Daily loop + moments:**
- `lib/core/streak.ts` (`computeStreak`); Today shows a 🔥 streak chip + dynamic
  Pepper message; `streak.tsx` uses real data.
- `goal-hit` and `adjustment-popup` / `adjustment-down` fire from real conditions on
  Today, once-per-day guarded, with real deltas. First-run empty state folded into
  Today; standalone `first-day.tsx` mock removed. Notifications preview reachable
  from Profile.

**Editable profile** — `EditProfileModal` edits name/goal/sex/age/height/weight/
activity via `draftFromProfile`/`profileFromDraft`; opened from the Profile card and
Goal/Activity rows.

State: `npx tsc --noEmit` is clean (keep it that way).

---

## 5. Project conventions / gotchas
- **Do NOT add `react-native-reanimated`.** All animation uses the built-in
  `Animated` API; reanimated's worklets setup breaks `pod install`. If `npm install`
  re-adds it, remove it and delete `ios/` before rebuilding.
- **TypeScript strict, 0 errors.** Run `npx tsc --noEmit` before committing.
- **Theme everything.** New UI must pull colors from `useTheme()`; never hardcode hex
  (a few legacy mock screens still do — fair game to clean up).
- Real data layer: `contexts/DataContext.tsx` + `lib/core/*` (AsyncStorage-backed).

---

## 6. Outstanding / next ideas
- **FatSecret:** add keys + fix IP whitelist (§3); ideally move to a backend proxy.
- **Apple Health:** data is still mock — wire `lib/core/health.ts` to real
  HealthKit (active/resting energy, steps, weight) so target adaptation is live.
- **graphify (optional):** building a code knowledge graph needs the `graphifyy`
  PyPI package, which was blocked by a security/admin policy this session. Install
  when you can (`uv tool install graphifyy`), then run it on `app/ components/ lib/`.
- **Nunito font (optional):** load via `expo-font` in `app/_layout.tsx` for a more
  rounded Duolingo type feel (System weights already read as rounded on iOS).
- Consider editing onboarding step order/grouping if the single-question flow feels
  long; the `PepperPrompt` scaffold makes adding/removing steps cheap.

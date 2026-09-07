# WhyLIM Balanced Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the map-led personal narrative while replacing the visual and animation implementation with a polished, accessible GSAP-driven experience.

**Architecture:** React continues to own discrete UI state such as theme, language, stage, and Bento page. GSAP owns all continuous animation through one registered runtime, component-scoped `useGSAP()` contexts, an application intro timeline, SplitText title reveals, and Flip-powered Bento transitions. Tailwind and semantic CSS variables own responsive layout and theme surfaces.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4, Leaflet, GSAP, `@gsap/react`, GSAP SplitText and Flip, Phosphor Icons, Fontsource variable fonts.

---

## File map

- Create `src/lib/gsap.ts`: register and export the single GSAP runtime and plugins.
- Create `src/components/GlassButton.tsx`: shared accessible icon-button surface without animation ownership.
- Modify `package.json` and `pnpm-lock.yaml`: replace Framer Motion and Lucide, add GSAP, Phosphor, and Fontsource.
- Modify `src/main.tsx`: load self-hosted font CSS.
- Modify `src/index.css`: semantic tokens, typography, map filters, surface styling, focus states, marquee fallback, and reduced motion.
- Modify `src/App.tsx`: application shell, responsive grid, intro timeline, and stage rendering.
- Modify `src/components/MapBackground.tsx`: OpenStreetMap tiles, attribution, filter hooks, and shorter Leaflet transitions.
- Modify `src/components/Hero.tsx`: SplitText title reveal, layout hierarchy, social accessibility, and GSAP entrances.
- Modify `src/components/AnimationControl.tsx`: Phosphor icons and compact control styling.
- Modify `src/components/LanguageToggle.tsx`: Phosphor icon and localized accessible label.
- Modify `src/components/ThemeToggle.tsx`: Phosphor icon and localized accessible label.
- Modify `src/components/BentoGrid.tsx`: card composition, Flip transitions, quickTo spotlight, scroll reset, and typographic time metrics.
- Modify `src/lib/i18n.ts`: complete interface translations and accessible control labels.

### Task 1: Replace dependencies and create the GSAP runtime

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `src/lib/gsap.ts`

- [ ] **Step 1: Record the current production build baseline**

Run:

```powershell
.\node_modules\.bin\vite.cmd build
Get-ChildItem dist\assets | Select-Object Name,Length
```

Expected: the existing build completes and the current asset sizes are recorded before dependency replacement.

- [ ] **Step 2: Replace animation, icon, and font dependencies**

Remove the old runtime and add the replacement packages with the project package manager:

```powershell
pnpm remove framer-motion lucide-react
pnpm add @fontsource-variable/manrope @fontsource-variable/newsreader @gsap/react @phosphor-icons/react gsap
```

If pnpm reports that the existing `node_modules` uses a different store, run one forced installation to regenerate the modules directory and lockfile:

```powershell
pnpm install --force
```

Expected: installation succeeds and `pnpm-lock.yaml` contains the five new packages but no Framer Motion or Lucide package entry required by this project.

- [ ] **Step 3: Create the single plugin registration module**

Create `src/lib/gsap.ts`:

```ts
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, Flip, SplitText);

export { Flip, gsap, SplitText, useGSAP };
```

- [ ] **Step 4: Verify dependency and registration state**

Run:

```powershell
rg -n "framer-motion|lucide-react" package.json pnpm-lock.yaml src
rg -n "registerPlugin" src
.\node_modules\.bin\tsc.cmd --noEmit
```

Expected: the first search finds nothing, the second search finds only `src/lib/gsap.ts`, and TypeScript exits with code 0.

- [ ] **Step 5: Commit the animation runtime**

```powershell
git add package.json pnpm-lock.yaml src/lib/gsap.ts
git commit -m "refactor: replace motion runtime with gsap"
```

### Task 2: Establish typography and visual tokens

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/index.css`
- Create: `src/components/GlassButton.tsx`

- [ ] **Step 1: Load self-hosted variable fonts**

Add before the local stylesheet import in `src/main.tsx`:

```ts
import '@fontsource-variable/manrope';
import '@fontsource-variable/newsreader';
```

- [ ] **Step 2: Replace global CSS with semantic design tokens**

Remove the Google Fonts `@import`. Define Tailwind font tokens and semantic variables for both themes:

```css
@import "tailwindcss";

@theme {
  --font-sans: "Manrope Variable", "PingFang SC", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Newsreader Variable", "Songti SC", STSong, "Noto Serif SC", ui-serif, Georgia, serif;
  --font-mono: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
  --color-gold-400: #c6a15b;
  --color-gold-500: #a77d32;
  --color-gold-600: #7b591f;
}

:root {
  color-scheme: light;
  --page: #f4f3ef;
  --ink: #1d2423;
  --muted: #626a67;
  --surface: rgb(252 251 247 / 0.82);
  --surface-strong: rgb(252 251 247 / 0.94);
  --line: rgb(29 36 35 / 0.1);
  --shadow: 0 22px 60px rgb(43 50 48 / 0.13);
}

[data-theme="dark"] {
  color-scheme: dark;
  --page: #111410;
  --ink: #f2f0e9;
  --muted: #a7aca5;
  --surface: rgb(23 27 23 / 0.84);
  --surface-strong: rgb(20 24 20 / 0.94);
  --line: rgb(242 240 233 / 0.12);
  --shadow: 0 24px 70px rgb(0 0 0 / 0.32);
}
```

Add `.glass-panel`, `.bento-card`, `.map-tiles-light`, `.map-tiles-dark`, `.focus-ring`, and reduced-motion rules. Gate `.animate-marquee` behind `prefers-reduced-motion: no-preference`; under reduced motion make it a static, horizontally scrollable row.

- [ ] **Step 3: Create a shared icon-button surface**

Create `src/components/GlassButton.tsx`:

```tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  label: string;
  active?: boolean;
}

export default function GlassButton({ children, label, active = false, className = '', ...props }: GlassButtonProps) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className={`focus-ring inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] shadow-sm backdrop-blur-xl transition-[color,background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-gold-400/50 hover:text-gold-500 active:translate-y-0 ${active ? 'border-gold-400/60 text-gold-500' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Verify styling compiles**

Run:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
.\node_modules\.bin\vite.cmd build
```

Expected: both commands exit with code 0 and no Google Fonts URL remains in `src/index.css`.

- [ ] **Step 5: Commit visual foundations**

```powershell
git add src/main.tsx src/index.css src/components/GlassButton.tsx
git commit -m "style: establish editorial visual system"
```

### Task 3: Rebuild the app shell and map presentation

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/MapBackground.tsx`

- [ ] **Step 1: Replace timer orchestration with a scoped GSAP timeline**

In `App.tsx`, remove `AnimatePresence`, `motion`, and the stage timer effect. Add an app root ref, `introRun` counter, and a scoped `useGSAP` timeline:

```tsx
const appRef = useRef<HTMLElement>(null);
const introTimeline = useRef<gsap.core.Timeline | null>(null);
const [introRun, setIntroRun] = useState(0);

useGSAP(() => {
  if (skipAnimation || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setStage(3);
    return;
  }

  setStage(1);
  introTimeline.current = gsap.timeline()
    .call(() => setStage(2), [], 2.2)
    .call(() => setStage(3), [], '+=1.8');

  return () => {
    introTimeline.current = null;
  };
}, { scope: appRef, dependencies: [introRun, skipAnimation], revertOnUpdate: true });
```

Replay increments `introRun`; explore sets stage 4. Retain existing discrete theme, language, geolocation, distance, and localStorage behavior.

- [ ] **Step 2: Replace the app shell layout**

Use `data-theme={theme}`, `min-h-[100dvh]`, a `max-w-[1440px]` content frame, and a desktop grid that changes from one column to `lg:grid-cols-[minmax(21rem,0.82fr)_minmax(40rem,1.18fr)]` at stage 4. Keep a single mobile page scroll and remove the desktop outer-right scroll owner.

- [ ] **Step 3: Replace map tiles and restore attribution**

In `MapBackground.tsx`:

```tsx
const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
```

Set `attributionControl`, pass `className={theme === 'dark' ? 'map-tiles-dark' : 'map-tiles-light'}` to `TileLayer`, and reduce Leaflet fly duration from 3 seconds to 1.6 seconds when animation is enabled.

- [ ] **Step 4: Verify shell and map behavior**

Run the local Vite server and verify:

- Root height follows the dynamic viewport.
- The map loads without API-key watermark.
- Attribution is visible but subdued.
- Stage 4 gives Bento more width without introducing a second desktop scroll owner.

- [ ] **Step 5: Commit the shell and map**

```powershell
git add src/App.tsx src/components/MapBackground.tsx
git commit -m "feat: refine map-led stage experience"
```

### Task 4: Rebuild Hero and control animations

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/AnimationControl.tsx`
- Modify: `src/components/LanguageToggle.tsx`
- Modify: `src/components/ThemeToggle.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace Hero motion wrappers with semantic elements**

Use a root ref, a title ref, and explicit CSS classes. Preserve the stage-dependent title content, Hitokoto loading/fallback, distance, explore action, and social destinations.

- [ ] **Step 2: Add scoped SplitText and Hero entrance timelines**

Use this pattern inside `Hero.tsx`:

```tsx
useGSAP(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !titleRef.current) return;

  SplitText.create(titleRef.current, {
    type: 'lines,chars',
    mask: 'lines',
    autoSplit: true,
    aria: 'auto',
    onSplit(self) {
      return gsap.fromTo(
        self.chars,
        { yPercent: 80, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.62, stagger: 0.018, ease: 'power3.out' },
      );
    },
  });

  gsap.fromTo(
    '.hero-support',
    { y: 12, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out' },
  );
}, { scope: rootRef, dependencies: [stage, language], revertOnUpdate: true });
```

Do not combine SplitText with `text-wrap: balance`; let `autoSplit` recalculate after font load and width changes.

- [ ] **Step 3: Apply the 42/58 editorial layout hierarchy**

Keep stages 1-3 centered. In stage 4 left-align the Hero at desktop, constrain it to about 520px, use `text-5xl md:text-7xl xl:text-8xl`, and simplify the support stack to quote, distance/action row, and social row. Remove the animated mobile scroll arrow.

- [ ] **Step 4: Replace all control icons and entry animations**

Replace Lucide imports with Phosphor equivalents and render each through `GlassButton`. Animate the control group once from `{ y: -10, autoAlpha: 0 }` with a short staggered GSAP timeline scoped to the header rather than independent component delays.

- [ ] **Step 5: Verify Hero states**

Check stages 1-4 in English and Chinese. Confirm headings remain at most two visual lines on desktop, supporting controls remain visible, and the reduced-motion condition renders readable unsplit text immediately.

- [ ] **Step 6: Commit Hero and controls**

```powershell
git add src/App.tsx src/components/Hero.tsx src/components/AnimationControl.tsx src/components/LanguageToggle.tsx src/components/ThemeToggle.tsx
git commit -m "feat: add gsap editorial hero choreography"
```

### Task 5: Redesign Bento composition and transitions

**Files:**
- Modify: `src/components/BentoGrid.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Remove generic card labels and mixed accents**

Delete `CornerLabel`, the per-card blue/orange/purple hover rings, the vertical school title, and overlaid image labels. Use the gold token for interactive states and place image captions in a distinct card content area.

- [ ] **Step 2: Replace time progress tracks with a typographic metric grid**

Replace `ProgressBar` with:

```tsx
function TimeMetric({ label, progress }: { label: string; progress: number }) {
  return (
    <div className="flex flex-col gap-2 border-t border-[var(--line)] pt-3">
      <div className="flex items-end justify-between gap-3">
        <span className="text-sm text-[var(--muted)]">{label}</span>
        <span className="font-mono text-2xl tabular-nums text-[var(--ink)]">{Math.round(progress)}%</span>
      </div>
      <span className="h-px origin-left bg-gold-500" style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  );
}
```

Arrange the four metrics in a 2×2 grid at desktop and one column on small screens.

- [ ] **Step 3: Add one scoped card spotlight implementation**

Use a Bento root ref and `gsap.quickTo()` for `--spotlight-x`, `--spotlight-y`, and `--spotlight-opacity` on `.bento-card` elements only when `(pointer: fine)` and reduced motion is not requested. Register pointer listeners inside `useGSAP`, batch initial DOM reads, and remove listeners in the returned cleanup.

- [ ] **Step 4: Add Flip page transitions and scroll reset**

Wrap page-changing event callbacks with `contextSafe()`. Capture `Flip.getState(gridRef.current)`, update the page, reset the Bento scroll owner to top, then call `Flip.from()` after React commits using a layout effect or `requestAnimationFrame`. Use `duration: 0.58`, `ease: 'power3.inOut'`, `simple: true`, and skip Flip entirely under reduced motion.

- [ ] **Step 5: Add the compact responsive grid**

Use three elastic desktop rows plus one 32px navigation row, 12px gaps, and `min-h-0`. Preserve every content item exactly once. Under 768px collapse to one column, remove internal overflow, and allow the app page to scroll naturally.

- [ ] **Step 6: Verify the original scroll regression**

At 1280×720:

1. Open Bento overview.
2. Switch to the second page.
3. Scroll the Bento owner to the bottom if scrolling is available.
4. Return to overview.

Expected: the overview starts at its top, all primary cards appear, and no large blank area remains.

- [ ] **Step 7: Commit Bento changes**

```powershell
git add src/components/BentoGrid.tsx src/index.css
git commit -m "feat: redesign bento interactions and hierarchy"
```

### Task 6: Complete localization, accessibility, and cleanup

**Files:**
- Modify: `src/lib/i18n.ts`
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/BentoGrid.tsx`
- Modify: `src/components/AnimationControl.tsx`
- Modify: `src/components/LanguageToggle.tsx`
- Modify: `src/components/ThemeToggle.tsx`

- [ ] **Step 1: Add complete interface translations**

Add typed translation keys for personality, visit, coding statement, CV link, blog link, gallery link, theme labels, language label, replay label, and skip-animation state. Replace every hard-coded interface string in the components with these keys.

- [ ] **Step 2: Add accessible names and focus states**

Give each social link a localized `aria-label`, ensure all icon buttons use `GlassButton`, and apply `.focus-ring` to text links and card actions. Decorative graphics must use `alt=""` and semantic content images must keep descriptive alt text.

- [ ] **Step 3: Run mechanical design audits**

Run:

```powershell
rg -n "—|–|h-screen|framer-motion|lucide-react|hover:ring-(blue|orange|purple)|writing-vertical|Scroll Indicator" src
rg -n "uppercase.*tracking|tracking.*uppercase" src/components
rg -n "window\.addEventListener\(['\"]scroll|scrollY|requestAnimationFrame.*set" src
```

Expected: the banned-pattern searches are empty. Any remaining uppercase/tracking use has a semantic reason and stays below the eyebrow limit.

- [ ] **Step 4: Commit localization and accessibility**

```powershell
git add src/lib/i18n.ts src/components
git commit -m "fix: complete localized accessible interactions"
```

### Task 7: Full verification and final visual audit

**Files:**
- Verify all modified source and dependency files.

- [ ] **Step 1: Run static verification**

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
.\node_modules\.bin\vite.cmd build
git diff --check
git status --short
```

Expected: TypeScript and production build exit with code 0, diff check reports no whitespace errors, and only the pre-existing `.arts/` directory remains untracked.

- [ ] **Step 2: Inspect final asset sizes**

```powershell
Get-ChildItem dist\assets | Sort-Object Length -Descending | Select-Object Name,Length
```

Expected: the report identifies GSAP and font assets clearly enough to compare against the baseline. Remove unused plugins or font weights if the bundle increase is disproportionate.

- [ ] **Step 3: Run desktop visual verification**

At 1280×720 verify:

- Light and dark themes have readable Hero, quote, controls, cards, footer, and attribution.
- English and Chinese show no clipped card title or hard-coded interface-language mismatch.
- The map has no API-key watermark.
- The first visit reaches overview in about four seconds.
- Replay, skip, explore, Bento forward/back, theme, and language controls work.
- Bento overview and second page do not compete with nested desktop scrollbars.

- [ ] **Step 4: Run responsive and reduced-motion verification**

At approximately 390×844 verify one-column flow, 40px control targets, no horizontal overflow, a stable dynamic viewport, and one vertical scroll owner. Emulate reduced motion and verify immediate stage 3, static tech stack, no SplitText reveal, no Flip transition, and no repeated indicators.

- [ ] **Step 5: Inspect browser runtime**

Check browser console for uncaught exceptions, React state-update warnings, GSAP target warnings, failed font assets, and failed map tiles. Check animation performance for avoidable layout events and long tasks.

- [ ] **Step 6: Final pre-flight audit**

Re-read every visible string and run the design-taste pre-flight matrix against the rendered page. Fix any failed item before claiming completion.

- [ ] **Step 7: Commit verification fixes if needed**

```powershell
git add package.json pnpm-lock.yaml src
git commit -m "chore: finalize visual refresh verification"
```

Do not create an empty commit when no verification fix was required.

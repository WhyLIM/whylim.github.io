# Single-screen Research Atlas Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the approved map-led profile into a no-scroll single-screen research atlas with readable intro timing, working skip behavior, an animated theme reveal, and radically distinct non-photographic cards.

**Architecture:** Keep `App.tsx` as the narrative and viewport coordinator, with one owned GSAP intro timeline and a small theme-transition utility. Keep `BentoGrid.tsx` as the atlas layout and Flip coordinator while moving the three complex overview cards and the detailed-page compositions into focused leaf components. Use CSS container queries to fit the fixed viewport without React resize state.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, GSAP 3 with `@gsap/react`, SplitText and Flip, Phosphor Icons, React Leaflet.

---

### Task 1: Location, intro timing, and immediate skip

**Files:**
- Modify: `src/config.ts`
- Modify: `src/App.tsx`
- Modify: `src/components/AnimationControl.tsx`
- Modify: `src/lib/i18n.ts`

- [ ] **Step 1: Move the owner coordinate to HKUMed**

Replace the coordinate in `src/config.ts` with:

```ts
ownerLocation: [22.2675, 114.1280] as [number, number],
```

- [ ] **Step 2: Give App ownership of the active intro timeline**

Add this ref beside the existing refs:

```ts
const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
```

Replace both 1.6 second tweens with 2.8 second tweens. Store the paused timeline in `introTimelineRef.current`, start it on the next animation frame, and clear the ref in cleanup only when it still refers to that timeline.

- [ ] **Step 3: Make fast-forward act immediately**

Replace the current preference-only callback with:

```ts
const handleSkip = () => {
  if (stage < 3) {
    introTimelineRef.current?.kill();
    introTimelineRef.current = null;
    setStage(3);
    setSkipAnimation(true);
    return;
  }

  setSkipAnimation((value) => !value);
};
```

Pass `handleSkip` to `AnimationControl`. Replay must set stage 1 and increment `introRun`; it must not overwrite the saved preference.

- [ ] **Step 4: Clarify bilingual labels**

Use labels equivalent to “Skip intro now” during stages 1-2 and preference labels afterward. Add a `duringIntro` boolean prop to `AnimationControl` so the control exposes the correct title and accessible name.

- [ ] **Step 5: Verify and commit**

Run:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
```

Expected: exit code 0. In browser, replay the intro and verify the three headings at 0.5, 3.1, and 5.9 seconds. Click fast-forward during stage 1 and verify stage 3 appears immediately.

Commit:

```powershell
git add src/config.ts src/App.tsx src/components/AnimationControl.tsx src/lib/i18n.ts
git commit -m "fix: make intro readable and skippable"
```

### Task 2: Single-viewport shell and Hero typography

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Remove the Hero eyebrow**

Delete the `data-hero-detail` eyebrow paragraph. Change the title reveal timeline to target the optional detail only when it exists. Use language-aware title leading:

```tsx
className={`${language === 'zh' ? 'leading-[1.08]' : 'leading-[0.96]'} ...`}
```

The Chinese title wrapper must reserve `pb-1` so glyphs are not clipped by the SplitText mask.

- [ ] **Step 2: Lock the document to one viewport**

Change the root and content shell to:

```tsx
<main className="relative h-[100dvh] overflow-hidden ...">
<section className={`relative z-20 h-full overflow-hidden ${stage === 4 ? 'atlas-shell' : ''}`}>
```

Move the footer to an absolute bottom overlay. It must not add document height.

- [ ] **Step 3: Add compact exploration behavior**

Use `.atlas-shell` and `.hero-shell` component classes so desktop keeps `42% 58%`, while `<768px` uses a fixed identity band above a two-column atlas. Use `clamp()` for title, quote, card padding, and gaps. Under `@media (max-height: 760px)`, reduce quote padding and secondary text before hiding any content.

- [ ] **Step 4: Verify and commit**

Check these viewports: 1440x900, 1280x720, and 390x700. For each, verify:

```js
document.documentElement.scrollHeight === document.documentElement.clientHeight
document.documentElement.scrollWidth === document.documentElement.clientWidth
```

Commit:

```powershell
git add src/App.tsx src/components/Hero.tsx src/index.css
git commit -m "feat: fit profile into one viewport"
```

### Task 3: Exploration focus and circular theme reveal

**Files:**
- Create: `src/lib/themeTransition.ts`
- Modify: `src/App.tsx`
- Modify: `src/components/ThemeToggle.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Implement the theme transition helper**

Create a typed helper that accepts the click point and synchronous commit callback:

```ts
type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

export function revealTheme(
  point: { x: number; y: number },
  commit: () => void,
) {
  const documentWithTransition = document as ViewTransitionDocument;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!documentWithTransition.startViewTransition || reduceMotion) {
    commit();
    return;
  }

  const radius = Math.hypot(
    Math.max(point.x, innerWidth - point.x),
    Math.max(point.y, innerHeight - point.y),
  );
  const transition = documentWithTransition.startViewTransition(commit);
  transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${point.x}px ${point.y}px)`, `circle(${radius}px at ${point.x}px ${point.y}px)`] },
      {
        duration: 650,
        easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
        pseudoElement: '::view-transition-new(root)',
      },
    );
  });
}
```

Use `flushSync` in `App.tsx` when constructing the commit callback so React updates inside the view-transition capture.

- [ ] **Step 2: Pass the click origin from ThemeToggle**

Change its callback to `(point: { x: number; y: number }) => void` and call it with `event.clientX` and `event.clientY`.

- [ ] **Step 3: Strengthen exploration focus**

In the stage-4 overlay use `rgb(var(--canvas-rgb) / 0.82)` plus `backdrop-blur-[5px]`. Keep the non-exploration gradient unchanged.

- [ ] **Step 4: Add view-transition CSS**

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-new(root) { z-index: 999; }
::view-transition-old(root) { z-index: 1; }
```

- [ ] **Step 5: Verify and commit**

Toggle both ways repeatedly, once before and once after Explore. Verify focus is retained, the reveal originates at the theme button, and reduced motion is instant.

Commit:

```powershell
git add src/lib/themeTransition.ts src/App.tsx src/components/ThemeToggle.tsx src/index.css
git commit -m "feat: add circular theme reveal"
```

### Task 4: Research-atlas overview cards

**Files:**
- Create: `src/components/atlas/PersonalitySpecimen.tsx`
- Create: `src/components/atlas/TechnologyOrbit.tsx`
- Create: `src/components/atlas/CodingFolio.tsx`
- Modify: `src/components/BentoGrid.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Build the personality specimen**

Render one semantic article with a cropped background word, the existing advocate image, a right-aligned title, and traits as plain marginal text. Use `data-bento-card` and no pill containers. The whole card remains a single external link target.

- [ ] **Step 2: Build the technology orbit**

Place the ten existing technology marks on a responsive ellipse using index-derived CSS custom properties. The component owns a ref and uses scoped `gsap.quickTo()` rotation functions from pointer position. Gate the handler with `matchMedia('(hover: hover) and (pointer: fine)')`; reduced motion and touch stay static.

- [ ] **Step 3: Build the coding folio**

Compose the existing coding-cat image with a clipped diagonal plane, a localized heading, and a short static fragment:

```text
observe()
map()
make()
```

Use CSS transforms for hover depth and no autonomous animation.

- [ ] **Step 4: Replace old overview markup**

Import the three leaf components into `BentoGrid.tsx`. Keep the Hometown, current institute, and undergraduate `ImageCard` implementations visually unchanged. Remove the marquee implementation and its duplicated technology icon DOM.

- [ ] **Step 5: Add atlas styles**

Add component classes for specimen typography, orbital positioning, folio clipping, and container-query size adjustments. Every hover transform must be inside `@media (hover: hover) and (pointer: fine)`.

- [ ] **Step 6: Verify and commit**

Run TypeScript and inspect both languages and themes. Confirm exactly six overview cells, no label clipping, no hover-only information, and no document scroll.

Commit:

```powershell
git add src/components/atlas src/components/BentoGrid.tsx src/index.css
git commit -m "feat: redesign overview as research atlas"
```

### Task 5: Chronograph and distinct destinations

**Files:**
- Create: `src/components/atlas/Chronograph.tsx`
- Create: `src/components/atlas/DestinationCards.tsx`
- Modify: `src/components/BentoGrid.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Build the chronograph**

Move the immutable date calculations from `BentoGrid.tsx` into `Chronograph.tsx`. Render the date in the center and four readings around it. Each reading uses a partial `conic-gradient` arc with no background track. Keep a text percentage for assistive and visual reading.

- [ ] **Step 2: Build three distinct destination compositions**

Expose `CvDossier`, `BlogSlice`, and `PhotoAperture` from `DestinationCards.tsx`. All are anchors with `data-bento-card`, but their internals differ:

- CV: vertical spine, indexed document title, FileText mark.
- Blog: offset reading columns, BookOpenText mark.
- Photography: CSS conic aperture, Camera mark.

Use only the global accent and existing radius scale.

- [ ] **Step 3: Integrate with fixed-region Flip**

Replace `TimeCard`, `TimeMetric`, and `SiteCard` in `BentoGrid.tsx`. Keep the current `Flip.getState(gridRef.current)` page-change flow and scroll reset removal, because the document no longer scrolls.

- [ ] **Step 4: Verify and commit**

Switch overview/detail at least five times. Confirm Flip remains interruptible, no blank state appears, all three links are keyboard focusable, and the fixed region never overflows.

Commit:

```powershell
git add src/components/atlas src/components/BentoGrid.tsx src/index.css
git commit -m "feat: create atlas detail compositions"
```

### Task 6: Final audit and visual verification

**Files:**
- Modify only files required by defects found during verification.

- [ ] **Step 1: Run static checks**

```powershell
.\node_modules\.bin\tsc.cmd --noEmit
.\node_modules\.bin\vite.cmd build
git diff --check
rg "framer-motion|lucide-react|AnimatePresence|motion\\.|h-screen|animate-marquee|scrollIntoView|[—–]" src package.json
```

Expected: typecheck and build exit 0; residual scan has no matches.

- [ ] **Step 2: Run visual checks**

Test intro, immediate skip, replay, Explore, both atlas pages, both languages, and both themes. Check 1440x900, 1280x720, and 390x700. Confirm exact viewport dimensions, no browser console errors, no horizontal or vertical scrollbar, and visible OpenStreetMap attribution.

- [ ] **Step 3: Run animation pre-flight**

Confirm every animated target uses transform, opacity, or the sanctioned view-transition clip; hover movement is fine-pointer gated; reduced motion removes translation/orbit/clip movement; GSAP selectors are scoped; event-created tweens use `contextSafe` or are explicitly killed.

- [ ] **Step 4: Commit verification fixes**

```powershell
git add src
git commit -m "fix: polish single-screen atlas"
```

Skip this commit if verification required no source changes.

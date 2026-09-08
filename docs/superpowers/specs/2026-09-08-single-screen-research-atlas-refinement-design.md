# Single-screen Research Atlas Refinement

**Date:** 2026-09-08  
**Status:** Approved direction, pending written-spec review  
**Base design:** `2026-09-08-balanced-visual-refresh-design.md`

## Design intent

Keep the existing map-led narrative and four stages, but make the final portfolio view read as a single composed research atlas rather than a collection of conventional glass cards. The page remains bilingual, supports light and dark themes, and preserves all current destinations and legal text.

Design dials for this refinement:

- `DESIGN_VARIANCE: 9` - asymmetric and experimental card compositions.
- `MOTION_INTENSITY: 7` - deliberate narrative motion plus a memorable theme transition.
- `VISUAL_DENSITY: 5` - all content fits in one viewport without feeling like a dashboard.

## Location source of truth

The owner marker moves to the University of Hong Kong Li Ka Shing Faculty of Medicine at 21 Sassoon Road, Pokfulam, Hong Kong.

- Coordinate: `[22.2675, 114.1280]`
- Address source: HKUMed official materials identify 21 Sassoon Road, Pokfulam.
- Coordinate source: Wikidata item Q4164603 reports `22°16'3.0\"N, 114°7'40.8\"E`, converted to decimal degrees.

The existing distance calculation remains unchanged and uses the new owner coordinate.

## Narrative timing and controls

The intro remains a three-beat map narrative:

1. Owner location and greeting.
2. Visitor location or location-unavailable message.
3. Relationship overview and Explore action.

Each reading beat lasts 2.8 seconds, for a total automatic sequence of about 5.6 seconds. Title transitions remain masked character reveals but use language-aware line height: compact for English and at least `1.08` for Chinese.

The Hero eyebrow is removed. The display title becomes the first textual element.

The fast-forward control has immediate behavior:

- During stages 1 or 2, pressing it kills the active timeline and moves directly to stage 3.
- The same action enables the stored skip preference for later visits.
- At stage 3 or 4, pressing it toggles the stored preference without navigating.
- Replay always disables the current skip action temporarily and runs the full sequence once.

Control labels explain current behavior in both languages.

## Theme transition

Theme switching uses the browser View Transitions API when available. The new theme is revealed by a circular clip expanding from the theme-button click position over 650 ms with `cubic-bezier(0.77, 0, 0.175, 1)`.

Fallback behavior uses the existing token transition without blocking interaction. `prefers-reduced-motion: reduce` switches instantly. Only color, opacity, and the view-transition clip are animated; no layout properties move.

## Single-viewport composition

The document is locked to `100dvh` with `overflow: hidden`; no horizontal or vertical document scrollbar is permitted.

Desktop exploration keeps the 42/58 Hero-to-atlas split. The header controls and legal footer are overlay layers that reserve visual space but do not increase document height. The atlas grid fills the available height using bounded rows and container-responsive type and spacing.

On viewports below 768 px, the exploration state becomes a compact composition:

- A shallow identity band contains the name, distance, and social actions.
- The atlas becomes a two-column by three-row grid for the overview page.
- Secondary details reduce in scale before any content is removed.
- The second atlas page uses the same fixed region and replaces its contents in place.

The minimum supported viewport for the no-scroll acceptance check is 390 by 700 CSS pixels. Shorter viewports may reduce quote visibility, but primary identity, navigation, and all six overview cells remain visible.

## Map focus in exploration

The map stays recognizable but becomes a supporting layer after Explore:

- Canvas-colored mask opacity increases to approximately 82 percent.
- A 5 px backdrop blur reduces label noise.
- Dark mode uses the same hierarchy rather than making the map disappear.
- Attribution remains visible and legible.

## Research-atlas card system

The Hometown, current institute, and undergraduate cards retain their photographic treatment. Their dimensions may adapt to the fixed viewport, but their visual language does not change.

Every other card receives a distinct composition:

### Personality specimen

- Large cropped `INFJ` typography acts as the dominant object.
- The advocate illustration appears as a clean cutout crossing the letter field.
- Description and traits are arranged as marginal annotations, not chips or pills.
- The external link is integrated as a small folio reference.

### Technology orbit

- The marquee is removed.
- Technology marks form a radial constellation around a central code symbol.
- Pointer movement produces a small, interruptible orbital rotation on fine pointers only.
- Labels remain readable and the reduced-motion state is completely static.

### Coding folio

- The coding cat overlaps a diagonal paper-like plane.
- A short code fragment and the localized coding title create depth through scale and clipping.
- Hover uses subtle parallax, not continuous autonomous motion.

### Chronograph

- Day, week, month, and year percentages become four typographic readings around a central date.
- Partial arcs provide comparison without filled background progress tracks.
- Values are calculated from independent immutable date objects.

### Destination cards

- CV becomes a research dossier with a vertical file spine and section index.
- Blog becomes an editorial reading slice with offset text columns.
- Photography becomes an aperture composition using CSS conic geometry and the Phosphor camera mark.
- The three cards share navigation semantics and radius rules but do not share the same internal layout.

## Motion behavior

- Intro: GSAP timeline, 2.8 seconds per narrative beat.
- Hero title: SplitText masked reveal, transform and opacity only.
- Atlas entry: 30-80 ms stagger with `power3.out`.
- Atlas page replacement: Flip preserves spatial continuity inside the fixed region.
- Pointer effects: `gsap.quickTo`, fine pointers only, and no React state updates per frame.
- Theme change: circular view transition, occasional state-change animation.

Every motion path has a reduced-motion fallback. Frequently used controls retain only 100-160 ms press feedback.

## Accessibility and resilience

- All controls retain accessible names in English and Chinese.
- Focus rings and button contrast remain WCAG AA compliant.
- No information is available only through hover.
- Image card links remain full-card keyboard targets.
- Location denial continues to show a neutral unavailable state.
- Failed quote loading retains the current local fallback.

## Acceptance criteria

- Intro stages are readable and complete in approximately 5.6 seconds.
- Fast-forward immediately reaches stage 3 and persists the preference.
- Replay runs all three stages even when persistent skip is enabled.
- The Hero eyebrow is absent and Chinese display text is not clipped.
- Owner location and distance calculations use `[22.2675, 114.1280]`.
- Explore applies a visibly stronger mask and blur.
- No document scrollbar appears at 1440 by 900, 1280 by 720, or 390 by 700.
- Hometown, current institute, and undergraduate retain photographic styling.
- All other cards use the approved research-atlas compositions.
- Theme switching has a circular reveal in supported browsers and an instant reduced-motion fallback.
- TypeScript, production build, residual dependency scan, keyboard checks, both themes, and both languages pass.

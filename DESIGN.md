# DESIGN.md — The Unspoken Screen (หน้าจอที่อยากให้ครอบครัวเห็น)

---

## 1. Design Philosophy

The Unspoken Screen bridges an emotional gap between students and their families. The visual language must reflect **warmth, safety, and empathy** — not clinical data presentation. Every design decision should make visitors (especially parents) feel they are being invited into a conversation, not lectured at.

Core principles:
- **Warmth over sterility** — avoid cold whites and stark contrast
- **Empathy through softness** — rounded forms, generous spacing, gentle transitions
- **Trust through clarity** — readable hierarchy, never overwhelming
- **Human before data** — statistics support stories, not the other way around

---

## 2. Color Palette

| Role | Name | Hex | Usage |
|---|---|---|---|
| Background | Warm Parchment | `#f9f4eb` | Page background, section fills — creates a paper/journal warmth |
| Primary | Calm Blue | `#2f597a` | Headers, nav, primary buttons, links — conveys trust and stability |
| Secondary | Deep Burgundy | `#562634` | Section dividers, supporting headings, blockquotes, decorative accents |
| Accent | Vibrant Orange | `#ff751f` | CTAs, highlights, hover states, data emphasis, attention-grabbing moments |
| Text (body) | Near-black | `#1a1a1a` | Body copy — full readability on warm background |
| Text (muted) | Warm Gray | `#6b6055` | Captions, labels, secondary text |
| Surface | Soft Cream | `#f0e9d8` | Cards, input fields, quote blocks — a step warmer than background |
| Surface Dark | Midnight Blue | `#1e3a4f` | Dark section backgrounds (footer, hero overlays) |

### Color Usage Notes

- **Never** use pure white (`#ffffff`) — the warm off-white background makes white elements feel disconnected.
- The accent orange (`#ff751f`) should be used sparingly to preserve its impact — primarily for CTAs and key statistics.
- Burgundy (`#562634`) pairs with orange for a rich, emotionally grounded contrast without feeling alarming.
- Primary blue (`#2f597a`) on Warm Parchment background passes WCAG AA contrast for body text at 16px+.

---

## 3. Typography

### Font Families

| Role | Font | Fallback |
|---|---|---|
| Thai + Latin Headings | Sarabun | sans-serif |
| Thai + Latin Body | Sarabun | sans-serif |
| Accent / Quotes | Lora | Georgia, serif |

> Sarabun is a Google Font designed for Thai–Latin bilingual readability. Lora adds an editorial, literary warmth to quoted student voices.

### Type Scale

| Level | Size | Weight | Usage |
|---|---|---|---|
| Display | 56–72px | 700 | Hero headline |
| H1 | 40px | 700 | Section titles |
| H2 | 28px | 600 | Sub-section headers |
| H3 | 20px | 600 | Card titles, labels |
| Body Large | 18px | 400 | Lead paragraphs, important copy |
| Body | 16px | 400 | General body text |
| Small | 14px | 400 | Captions, footnotes, metadata |
| Quote | 22px | 400–500 italic | Student voice pull-quotes (Lora) |

### Line Height
- Body: `1.75` — generous leading for both Thai and Latin scripts
- Headings: `1.25`

---

## 4. Spacing System

Base unit: `8px`

| Token | Value | Usage |
|---|---|---|
| xs | 4px | tight gaps |
| sm | 8px | inline spacing |
| md | 16px | component padding |
| lg | 24px | between components |
| xl | 40px | section padding (mobile) |
| 2xl | 64px | section padding (desktop) |
| 3xl | 96px | major section breaks |

Max content width: `1200px`, centered with `auto` horizontal margin.

---

## 5. Styling Rules — Tailwind First

> **Mandate:** All components MUST be styled with Tailwind CSS utility classes as the primary method. Inline `style={{}}` props are only permitted for values that Tailwind cannot express (e.g., dynamic JS-computed values like canvas `transform: translate(${x}px, ${y}px)`, SVG attributes, or truly one-off computed colors). Never use inline styles for static design values.

### When to use Tailwind (always prefer this)
- Colors, backgrounds, borders → `bg-us-blue`, `text-us-orange`, `border-us-burg`
- Spacing, padding, margin → `px-5`, `py-6`, `gap-4`, `mb-10`
- Typography → `text-[15px]`, `font-bold`, `tracking-[3px]`, `leading-snug`
- Flex/grid layout → `flex`, `grid`, `items-center`, `justify-between`
- Responsive variants → `sm:px-10`, `md:grid-cols-2`, `lg:grid-cols-3`
- Borders, radius, shadows → `rounded-xl`, `shadow-sm`, `border-l-4`
- Hover/focus/transition → `hover:bg-orange-500`, `transition-colors`, `duration-200`
- Opacity → `opacity-35`, `text-us-cream/60`

### When inline `style={{}}` is allowed (exceptions only)
- **Dynamic transforms** driven by JS state: `transform: translate(${offset.x}px, ${offset.y}px)`
- **Animated widths** driven by JS-computed percentages: `style={{ width: \`${width}%\` }}`
- **SVG-specific attributes** that have no Tailwind equivalent
- **Canvas/animation frame** values written by `requestAnimationFrame`

### What is forbidden
- `style={{ fontSize: 14 }}` — use `text-[14px]`
- `style={{ color: '#ff751f' }}` — use `text-us-orange` or `text-[#ff751f]`
- `style={{ background: 'var(--us-dark)' }}` — use `bg-us-dark`
- `style={{ fontFamily: "'Sarabun', sans-serif" }}` — use `font-sans` or the project font class
- `style={{ borderRadius: 8 }}` — use `rounded-lg`
- `style={{ display: 'flex', alignItems: 'center' }}` — use `flex items-center`
- `style={{ padding: '7px 12px' }}` — use `px-3 py-[7px]`
- `style={{ whiteSpace: 'nowrap' }}` — use `whitespace-nowrap`
- `style={{ cursor: 'pointer' }}` — use `cursor-pointer`
- `style={{ flexShrink: 0 }}` — use `shrink-0`
- `style={{ overflow: 'hidden' }}` — use `overflow-hidden`

---

## 6. Component Design

### 6.1 Navigation Bar

- Background: `bg-us-blue`
- Logo: `text-us-cream font-bold text-[15px] tracking-[0.3px]`
- Nav links: `text-us-cream/80 text-[13px] hover:text-us-cream transition-colors duration-150`
- Mobile: hamburger (`sm:hidden`) with dropdown drawer (`bg-us-blue/95`)
- Desktop links: `hidden sm:flex gap-7`

### 6.2 Hero Section

- Section: `min-h-screen bg-us-dark flex flex-col relative overflow-hidden`
- Headline: `text-[clamp(36px,8vw,72px)] font-bold text-us-cream leading-[1.12]`
- Quote block: `text-us-cream/70 italic border-l-2 border-us-orange/50 pl-4 transition-opacity duration-300`
- CTA primary: `bg-us-orange text-white rounded-full px-6 sm:px-8 py-3 font-bold hover:bg-orange-500 transition-colors duration-200`
- CTA secondary: `bg-transparent text-us-cream/85 border-2 border-us-cream/40 rounded-full hover:border-us-cream/70 transition-all duration-200`

### 6.3 Statistics / Data Cards

- Card: `bg-us-surface rounded-xl px-6 py-7 shadow-sm flex-1 min-w-40`
- Stat number: `text-[clamp(40px,6vw,58px)] font-bold text-us-orange leading-none`
- Stat label: `text-[15px] font-semibold text-us-dark mt-2 leading-snug`
- Grid: `grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5`

### 6.4 Quote / Voice Blocks

- Section: `bg-us-burg py-14 sm:py-20 px-5 sm:px-10 relative overflow-hidden`
- Quote card: `bg-white/7 rounded-xl px-5 sm:px-10 py-6 sm:py-9 border-l-4 border-us-orange`
- Quote text: `italic text-[clamp(16px,2.5vw,21px)] text-us-cream leading-[1.85]`
- Attribution: `text-[12px] text-us-cream/45 tracking-[0.5px]`

### 6.5 Buttons

| Variant | Tailwind classes |
|---|---|
| Primary | `bg-us-orange text-white rounded-full px-8 py-3 font-bold hover:bg-orange-500 transition-colors duration-200` |
| Secondary | `bg-us-blue text-white rounded-full px-8 py-3 font-bold hover:bg-[#244868] transition-colors duration-200` |
| Outlined | `bg-transparent text-us-blue border-2 border-us-blue rounded-full px-7 py-3 hover:bg-us-blue hover:text-white transition-all duration-200` |
| Ghost | `bg-transparent text-us-orange hover:underline` |

### 6.6 Anonymous Wall

The wall's top bar, filter chips, submit panel, and canvas overlay must be migrated to Tailwind. Only exception: the canvas `transform: translate()` and animated dot-grid SVG.

- Top bar: `flex items-center gap-2 px-3 sm:px-5 h-[52px] bg-us-dark border-b border-white/8 shrink-0 z-30 overflow-x-auto`
- Filter chips (active): `bg-us-orange text-white rounded-full px-3 py-1 text-[11px] whitespace-nowrap cursor-pointer transition-all duration-150`
- Filter chips (inactive): `bg-white/8 text-us-cream/60 border border-white/12 rounded-full px-3 py-1 text-[11px] whitespace-nowrap cursor-pointer`
- Submit panel: `flex items-start gap-3 px-3 sm:px-5 py-3 bg-us-bg border-b-2 border-us-dark/60 shrink-0 z-[29]`
- Submit button: `bg-us-orange text-white rounded px-4 py-[10px] text-[13px] font-bold flex items-center gap-1.5 cursor-pointer`
- Avatar button: `bg-white/8 border border-white/15 rounded-full w-9 h-9 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer`

### 6.7 Section Dividers

Use full-width wave SVG dividers between sections:
- `#f9f4eb` → `#1e3a4f` → `#f9f4eb` → `#f0e9d8`
- SVG: `block w-full mt-auto` with `preserveAspectRatio="none"`

### 6.8 Footer

- Section: `bg-us-dark border-t border-white/6 py-10 px-5 sm:px-10`
- Content: `max-w-240 mx-auto flex flex-col items-center gap-4 text-center`
- Tagline: `italic text-[16px] text-us-cream/65 leading-[1.7]`
- Links: `text-[12px] text-us-cream/40 hover:text-us-cream/70 transition-colors duration-150`

---

## 7. Page Layout — Section Order

```
┌─────────────────────────────────┐
│  NAV BAR                        │  #2f597a
├─────────────────────────────────┤
│  HERO                           │  #1e3a4f
│  Headline + Subtext + CTA       │
├─────────────────────────────────┤
│  THE PROBLEM (Rationale)        │  #f9f4eb
│  Key stats as large numbers     │
│  30% / 4% / 80%                 │
├─────────────────────────────────┤
│  FIELDWORK INSIGHTS             │  #f0e9d8
│  Two insight cards side by side │
├─────────────────────────────────┤
│  STUDENT VOICES (Quote Wall)    │  #562634
│  Rotating/scrolling quotes      │
├─────────────────────────────────┤
│  THE UNASKED QUESTIONS          │  #f9f4eb
│  Interactive question dashboard │
├─────────────────────────────────┤
│  DATA & EVIDENCE                │  #f0e9d8
│  Charts, wordcloud, bar, pie    │
├─────────────────────────────────┤
│  ANONYMOUS WALL                 │  #f9f4eb
│  Submit form + live message feed│
├─────────────────────────────────┤
│  PROPOSED SOLUTIONS             │  #1e3a4f
│  3 cards: Dialogue / Stability  │
│  / Normalizing Failure          │
├─────────────────────────────────┤
│  FOOTER                         │  #1e3a4f
└─────────────────────────────────┘
```

---

## 8. Iconography & Illustration

- Style: **line icons** with a slight warmth — not sharp/tech, not overly cute
- Icon stroke color: `#2f597a` default, `#ff751f` for emphasis
- Illustrations (if used): simple, inclusive characters — no realistic faces
- Avoid medical/clinical imagery (red crosses, clinical whites)
- Preferred metaphors: bridges, open doors, letters, waves, hands

---

## 9. Motion & Animation

- Principle: **gentle and purposeful** — nothing that feels flashy or distracting from the emotional content
- Scroll animations: `fade-up` on section entry, `200ms` delay, `ease-out`
- Stat counters: count-up animation when entering viewport
- Quote cards: slow crossfade or horizontal slide (4–6s auto-advance)
- Hover transitions: `150–200ms ease`
- No looping background animations on heavy sections (respect low-motion preferences)
- Respect `prefers-reduced-motion` media query — disable all motion for users who need it

---

## 10. Responsive Breakpoints

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 640px | Single column, larger touch targets |
| Tablet | 640–1024px | 2-column grids where applicable |
| Desktop | > 1024px | Full layout, max 1200px content width |

- Stack two-column layouts to single column on mobile
- Hero font scales down: Display → 36px on mobile
- Navigation collapses to hamburger at < 768px

---

## 11. Accessibility

- Color contrast: all text/background combos meet WCAG AA (4.5:1 for body, 3:1 for large text)
- Focus indicators: visible `2px solid #ff751f` outline on all interactive elements
- Anonymous wall form: proper `<label>` elements, ARIA roles on live regions
- Charts: include text alternatives / data tables accessible to screen readers
- Thai language: set `lang="th"` on document, switch to `lang="en"` on English spans

---

## 12. Tone Alignment

Every visual element should feel like it was made by someone who **cares**, not a corporation. The palette's warm parchment, the burgundy depth, the orange spark — together they say: *"This is a safe place. We see you."*

The Unspoken Screen is not a data dashboard. It is a letter.

# Design Notes

## Palette

White / blue / gold / grey / black, defined as tokens in `css/theme.css`.

Two blues, split by **role** rather than by location:

- `--accent` (`#2070e0`) — anything interactive: links, venue tags, titles on
  hover, focus rings.
- `--accent-muted` (`#7e9cc4`) — structural marks only, currently the short rule
  before each section heading. Keeping these separate is what stops a decorative
  bar from reading as a link.

`--amber` (`#d99a00`) is reserved for teaser figures, so a gold element on the
page always means "there is a picture here". Neutrals are near-neutral greys
with only a trace of warmth, so white reads as white.

## Timeline (Experience / Education)

The dotted vertical rail was **retired** in favour of hairline-separated rows.
In a ~350px column the rail spent horizontal width on decoration and encoded
chronology that the dates already state.

Current vs. past:

- The first item in a timeline is current **by default**.
- Add `is-past` to demote it — used on the NTU Research Associate entry, whose
  role ended while still being the most recent one.
- Add `is-current` to promote a non-first item.
- The current entry is marked on its **date text** (blue in Experience, gold in
  Education), not with a ring or badge around the logo. Institution logos are
  bare; they are already circular crests, and a second border fights them.

Past entries fade their heading, role and logo. Logos keep a fixed 46px layout
box — the slight size bump on the current entry uses `transform: scale()`, never
`width`, so every row's text stays on the same baseline across both columns.

## Teaser figures

Papers with a figure show a small gold pill after the title; papers without show
nothing, so the list never looks ragged. Hover reveals the figure at 230px,
click opens the shared modal.

- The popover is **right-anchored**. The icon trails a title of any length, so it
  can sit at the right edge of the column; anchoring left would overflow.
- The icon sits on the text **baseline**. Aligning to `middle` aligns to the line
  box, which is taller than the text and makes the icon look dropped.
- A `← Preview` hint appears on the first hover of a paper that has a figure,
  once per session (`sessionStorage`), and clears on `mouseleave`. Listeners are
  detached on the first reveal so a second paper cannot light up while the first
  hint is still running.
- Both the popover and the hint are hidden under `@media (hover: none)`, where
  they could be neither triggered nor dismissed.

## Layout gotchas

- **Section indent.** The heading accent rule shifts heading text 0.7rem right;
  section bodies carry the same `padding-left` so they align to that edge rather
  than hanging left of it.
- **Bottom padding must live in the `.page-wrapper` shorthand.** A separate
  `padding-bottom` rule earlier in `main.css` gets reset by the later
  `padding: 0 16px 96px` shorthand. A bottom *margin* does not work either — it
  collapses, and the fixed footer ends up covering the last element.

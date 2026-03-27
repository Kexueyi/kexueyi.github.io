# Design Notes

## Timeline Dot Alignment

Timeline dots need to vertically center against each item's content area, not the full `.timeline-item` (which includes `padding-bottom` spacing).

**Solution:**
- Non-last items: `top: calc(50% - 0.75rem)` — offsets half the `padding-bottom: 1.5rem`
- Last item: `top: 50%` — no padding, center directly
- All dots: `transform: translateY(-50%)` for precise centering

This ensures dots align to the visual center of the logo + text, regardless of item spacing.

---
title: "One accent colour, one job"
description: "We nearly shipped our own site with a pastel green that failed contrast on cream. What we learned about picking a brand accent that actually works."
date: 2026-10-14
type: article
---

Our first pass at the cozy palette had a soft, pastel sage. It looked lovely in the Figma frame. On the warm paper background we'd chosen for the site, it hit roughly 2:1 contrast. Links were unreadable. Icons disappeared.

## The fix was depth, not a new colour

We kept the hue and pushed it darker until text on the paper background cleared 4.5:1. The result is the sage you see on this site. It still reads as warm and green; it's just confident enough to carry a link.

The lesson generalises. If an accent isn't working, try the same hue at a different depth before you swap it for something else. Hue is what people remember as "your colour". Depth is what makes it usable.

## Give the accent one job

Once the accent passes contrast, be disciplined about where it goes. Ours shows up on links, primary buttons, icon strokes, and the occasional highlight. That's it. Headings are ink. Backgrounds are paper. Borders are a quiet grey.

When every element gets a little bit of brand colour, nothing stands out. When the accent appears in four places, your eye knows those four places are interactive or important.

## If you need a lighter version

Don't pick a lighter hex. Use the same colour with transparency, so it mixes with whatever is behind it:

```css
background: color-mix(in oklab, var(--color-primary) 15%, transparent);
```

That gives you tints that automatically harmonise with the surface, and you only ever have one accent value to maintain.

## Checklist

- Accent on background clears 4.5:1 for text, 3:1 for icons and borders.
- Accent appears on interactive and important elements only.
- Tints come from transparency, not extra hex values.
- Hover and active states are a deeper version of the same hue.

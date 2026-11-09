# FORGE Lab: post cover artwork

Use this guide when creating artwork for a FORGE Lab blog post. Match the
homepage's Korean-inspired ink painting, not a generic cybersecurity illustration.
Keep changes scoped to the requested post and its assets. For technical figures
inside an article, follow [Infographics and diagrams](#infographics-and-diagrams)
instead of the cover guidance.

## Visual reference

The approved direction is a Goryeo-inspired artisan working at a forge:
confident brushwork, a prominent character, detailed hands and tools, blue-gray
clothing, and restrained orange heat. It connects FORGE's research to careful
craftsmanship, discovery, and experimentation.

Look at these files before designing:

- `assets/images/goryeo-forge-refined.png`: original painting and detail quality.
- `assets/images/goryeo-forge-cutout.png`: transparent, page-ready version.
- `layouts/index.html`: current homepage composition.
- `assets/css/main.css`: page palette, framing, and motion styles.
- `assets/js/ink-landscape.js`: existing homepage interaction.
- `layouts/partials/rust-inspection.html`, `assets/css/rust-inspection.css`,
  and `assets/js/rust-inspection.js`: article-header placement and independent
  layered interaction.
- `assets/images/covers/rust-std-memory-safety/`: article master, component
  masks, reconstructed underpainting, and crack geometry.

Earlier artwork files are drafts, not the current style reference.

## Art direction

- **A painting, not an infographic.** Use original Korean sumukhwa-inspired
  ink-and-wash illustration with expressive dry-brush edges and fine detail.
- **One clear subject.** Make the character or principal object large enough to
  read at mobile size. Avoid a tiny scene lost in empty space.
- **A story-specific metaphor.** Start with the article's central idea and
  express it through a believable action or craft. Inspection might suggest
  examining a workpiece; iteration might suggest shaping heated metal. Do not
  repeat the same blacksmith merely to fill a cover slot.
- **Restrained color.** Charcoal ink, cool blue-gray washes, and small copper,
  rust, or amber accents. The page uses paper `#f7f5ef`, ink `#292b28`, muted
  text `#65665e`, and accent `#98482e`.
- **No visible image rectangle.** Prefer genuine transparency. Otherwise match
  the page's paper color exactly. Feather the outer brushwork naturally into
  the page; do not use an opaque yellow or sepia paper background.
- **Credible anatomy and objects.** Check hands, grip, wrists, tool geometry,
  contact points, and perspective. Treat the historical setting as inspired
  artwork, not a claim of archaeological accuracy.
- **Natural imperfections.** A crack should remain a dark, irregular fissure
  within the material. Preserve its texture and depth; strengthen existing
  rusty edges subtly rather than painting a uniform red stripe or glowing
  path over the object.
- **No embedded typography.** Keep titles, captions, logos, seals, watermarks,
  and UI instructions out of the painting.

Avoid neon cyberpunk, hooded hackers, padlocks, shield icons, floating chips,
circuit overlays, decorative diagrams, hard frames, muddy sepia washes, and
cartoon or glossy 3D rendering. Technical diagrams can be separate article
figures when needed; do not attach them to a painting to make it look technical.

Create original artwork. A reference can inform composition, restraint, or
medium; do not copy another site's illustration, character, or distinctive
arrangement.

## Reusable generation brief

Replace the bracketed fields with the actual article concept. Use our approved
painting as an image reference when the available tool supports it.

> Create an original, professionally art-directed editorial illustration for
> FORGE Lab, Microsoft's Frontier Offensive Research & Generative Exploitation
> Lab. The article explores [central idea]. Express this through [one subject
> performing one concrete action], using [one or two supporting objects].
>
> Contemporary Korean sumukhwa-inspired ink-and-wash painting: confident
> charcoal-black brushwork, cool blue-gray washes, delicate anatomical and
> material detail, and restrained copper/vermilion highlights at [focal point].
> [Use a Goryeo-inspired craft setting if appropriate to this concept.]
>
> Make the principal subject prominent and legible at small sizes. Use an
> asymmetric, balanced landscape composition, approximately 3:2, with modest
> breathing room and no essential details against the edges. Tools, hands,
> and contact points must be mechanically and anatomically credible.
>
> Transparent background where supported; otherwise a uniform warm off-white
> matching #f7f5ef. Brushwork should dissolve naturally into the page. No
> colored paper rectangle, border, text, caption, logo, watermark, circuitry,
> technology icons, photorealism, cartoon styling, or 3D rendering.

Review the result before integrating it. Regenerate or repair weak anatomy,
unclear subjects, distracting props, or an unsuitable background rather than
hiding them with effects.

## Preparing the image

1. Retain the editable or full-resolution master in
   `assets/images/covers/<post-slug>/`. Keep large masters out of the published
   post bundle.
2. Remove the paper background without erasing fine brushwork, skin, smoke, or
   highlights. Preserve alpha transparency and decontaminate warm edge colors
   so the artwork has no pale halo on `#f7f5ef`.
3. Export an optimized transparent WebP. A width around 1400-1600 pixels is
   normally sufficient for the current 760-pixel article column at high DPI.
   Aim for a few hundred KB when possible without damaging the painting.
4. Inspect the exported image on the actual page background, not only against
   white in an image viewer. Check desktop, narrow mobile, and high-DPI views.
5. Write concise descriptive alt text about the visible subject and action.
   Do not put the entire art brief or article abstract in the alt text.

CSS blending or a rectangular fade alone is not background removal. Avoid
heavy crops that cut off the character's head, hands, or important tools.

## Adding a cover to a post

### Placement and scale

Prefer a compact illustration in the **top-right of the article header**, beside
the title and above Contents, rather than a full-width painting before the
introduction. Keep the title, author, date, and reading time readable. The art
may extend slightly into available right-hand whitespace, but must not overlap
text, navigation, or the viewport edge.

Aim for roughly one-third to two-fifths of the header width on desktop, with
enough detail to read at that size. At narrow widths, stack the art below the
title and author line and above Contents; about 60% of the available width is
a useful starting point. Preserve the aspect ratio and use an explicit size
to avoid layout shifts. Inspect the composition rather than relying only on
these percentages. Do not shrink the title font just to fit artwork.

### Hugo integration

Use a Hugo leaf bundle for the published still and any optional layers:

```text
content/posts/my-post/
  index.md
  cover.webp
  cover-base.webp   # optional reconstructed background
  cover-head.webp   # optional moving component
  cover-hand.webp   # optional hand and tool together
```

The Rust article opts into its header illustration with:

```markdown
+++
artwork = "rust-inspection"
+++
```

This value is explicitly handled in `layouts/_default/single.html` and
`layouts/_default/baseof.html`, which select the partial and load its scoped
stylesheet. It is **not** a generic artwork registry: a new illustration needs
its own deliberate wiring. Do not reuse the Rust partial for a different scene
or assume `cover` and `image` front-matter fields render automatically.

Keep the header illustration out of the Markdown body so it appears only once.
For a post without header integration, a normal Markdown image remains a valid
static fallback:

```markdown
![An artisan examining a glowing workpiece with iron tongs.](cover.webp)
```

Use the actual publication date and an alt description matching the artwork.
For an existing post, preserve its slug and metadata when converting it to a
bundle; do not leave both `my-post.md` and `my-post/index.md`.

Use illustration-specific CSS and load its script only on the relevant post.
Do not change global homepage styles merely to add one post cover. Listing
thumbnails or generic front-matter covers require a separate template change.

## Optional motion

Default post covers to a strong static image. Add interaction only when
requested; it must enhance, not rescue, the illustration.

- Separate actual components, not just a flat painting with unrelated overlays.
  Keep all layers registered to one coordinate system.
- Put every visible part of a moving object on the same articulated layer.
  A hammer's head, front shaft, and rear handle must rotate together about the
  grip. For an inspection tool, move the hand and entire pick together, with
  the arm attached naturally at the sleeve.
- Prefer subtle **pointer-driven motion**, like the homepage, over a repeating
  idle loop. Let movement ease toward the pointer's target, settle when the
  pointer stops, and return gently to rest on pointer leave or cancellation.
- Make motion follow the depicted task. An inspection pick should trace a
  short section of the actual crack, not rotate around a fixed tip or wave
  across empty space. Derive contact positions from geometry registered to
  the source painting. An invisible SVG path may guide motion; it need not
  be drawn over the natural crack. Keep travel small enough to preserve grip,
  arm proportions, and believable tool contact.
- Reconstruct hidden surfaces exposed by movement. Avoid duplicate silhouettes,
  white cutout holes, blurred repair patches, or moving rectangles of paper.
- Let fire bend and flicker in distinct tongues, smoke follow more slowly, and
  sparks burst at a downstroke's contact point. Do not emit repeated hits from
  a stationary cursor or from returning to rest.
- Bound particle counts and lifetimes. Use time-based easing and run animation
  frames only while movement is settling. Cancel pending frames and reset
  transforms when offscreen, when the page is hidden, or when reduced motion
  is enabled. Reset pointer targets after blur or resize.
- Preserve a complete static fallback for touch, reduced motion, unavailable
  JavaScript, and failed layer loading. Keep the still visible until every
  required layer decodes successfully. Apply any color or crack enhancements
  to the still as well, so switching modes does not change the painting.
  Decorative layers must be hidden from assistive technology, have empty alt
  text, and not intercept page interaction; describe the complete still once.

The homepage script is wired to one homepage artwork. Do not assume it
automatically supports multiple post illustrations or copy its coordinates
onto a differently composed painting.

## Final review

- The cover clearly relates to the article and feels consistent with the
  approved artwork.
- The subject is prominent, anatomy and tools are credible, and there is no
  visible paper rectangle or unwanted label.
- Transparency and image quality survive export; file size is reasonable.
- The art sits beside the title on desktop and stacks before Contents on mobile,
  without collisions, duplicated covers, or horizontal scrolling.
- Existing navigation, typography, post URLs, and unrelated content are intact.
- If animated, inspect both extremes of movement, the resting state, and
  reduced-motion and failure fallbacks. Check that the tool tip stays on its
  intended surface, the hand stays attached, and frames stop after settling.

Follow [`README.md`](./README.md) for Hugo setup. From the `blog/` directory,
build with `hugo`. Preview with `hugo server -D` (`-D` includes drafts) if a
preview server is not already running. Inspect the actual post, not just
the source image. Do not commit generated `public/` or `resources/` output.

## Infographics and diagrams

Article figures explain one technical idea precisely. They are clean editorial
diagrams, not paintings: none of the cover's ink-wash treatment applies.

- **Format.** Hand-author SVG in the post bundle, such as
  `content/posts/<slug>/diagram.svg`, and embed it with
  `![alt text](diagram.svg)`. SVG stays sharp, small, and reviewable in
  diffs. Use raster images only for screenshots.
- **Canvas.** Use a `viewBox` about 600 units wide for the 760-pixel column and
  prefer vertical flows that survive narrow screens. Keep titles around 19 units
  and other text at least 16. Leave the background transparent so the page
  paper shows through.
- **Palette.** Ink `#292b28` for lines and primary text, muted `#65665e` for
  secondary labels, light fills such as `#fbfaf7`, and accent `#98482e` only for
  what goes wrong: the failing step, the attacker's path, the bug itself. Accent
  tints at low opacity can mark a region. Avoid other hues.
- **Type.** Use a system sans stack
  (`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`) for labels and a
  system monospace stack for code identifiers. An SVG embedded with `<img>`
  cannot load the site's web fonts, so do not rely on Literata, Inter, or
  JetBrains Mono inside figures. Use sentence case and short phrases;
  explanations belong in the article text.
- **Shapes.** Flat boxes with 1.5-unit strokes and about 6-unit corner radius.
  Solid ink arrows mark normal flow; dashed accent arrows mark exceptional or
  hidden paths. Draw arrowheads as plain paths rather than markers so every
  renderer orients them correctly. No gradients, shadows, 3D, icons, or clip
  art.
- **Consistency.** Label steps with the same names and identifiers the article
  and its code use. Show one idea per figure.
- **Accessibility.** Include `<title>` and `<desc>` in the SVG, write alt text
  that states the figure's point, and never rely on color alone; pair the
  accent with a dashed line or a label.

Render the figure at desktop and roughly 360-pixel mobile widths before
integrating it, and check that no label overlaps a line or a box edge.

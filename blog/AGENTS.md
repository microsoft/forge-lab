# FORGE Lab: post cover artwork

Use this guide when creating artwork for a FORGE Lab blog post. Match the
homepage's Korean-inspired ink painting, not a generic cybersecurity illustration.
Keep changes scoped to the requested post and its assets.

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
   normally sufficient for the current 680-pixel article column at high DPI.
   Aim for a few hundred KB when possible without damaging the painting.
4. Inspect the exported image on the actual page background, not only against
   white in an image viewer. Check desktop, narrow mobile, and high-DPI views.
5. Write concise descriptive alt text about the visible subject and action.
   Do not put the entire art brief or article abstract in the alt text.

CSS blending or a rectangular fade alone is not background removal. Avoid
heavy crops that cut off the character's head, hands, or important tools.

## Adding a cover to a post

The current single-post template renders the Markdown body. It does **not**
automatically render a `cover` or `image` front-matter field, and Markdown images
are not automatically resized by the current templates.

Use a Hugo leaf bundle and place the optimized cover at the start of the body:

```text
content/posts/my-post/
  index.md
  cover.webp
```

```markdown
+++
title = "Article title"
date = 2026-11-03
description = "A short, accurate summary of the research."
slug = "my-post"
+++

![An artisan examining a glowing workpiece with iron tongs.](cover.webp)

Article introduction...
```

Use the actual publication date and an alt description matching the artwork.
For an existing post, preserve its slug and metadata when converting it to a
bundle; do not leave both `my-post.md` and `my-post/index.md`.

The existing `.prose img` rule handles responsive width. Do not change global
homepage styles merely to add one post cover. Listing thumbnails or automatic
front-matter covers require a separate template change.

## Optional motion

Default post covers to a strong static image. Add interaction only when
requested; it must enhance, not rescue, the illustration.

- Separate actual components, not just a flat painting with unrelated overlays.
  Keep all layers registered to one coordinate system.
- Put every visible part of a moving object on the same articulated layer.
  A hammer's head, front shaft, and rear handle must rotate together about the
  grip. Parent its motion to the artisan so the hand does not drift away.
- Reconstruct hidden surfaces exposed by movement. Avoid duplicate silhouettes,
  white cutout holes, blurred repair patches, or moving rectangles of paper.
- Let fire bend and flicker in distinct tongues, smoke follow more slowly, and
  sparks burst at a downstroke's contact point. Do not emit repeated hits from
  a stationary cursor or from returning to rest.
- Bound particle counts and lifetimes. Stop animation work once motion settles;
  clear it when the page is hidden or reduced motion is enabled.
- Preserve a complete static fallback for touch, reduced motion, unavailable
  JavaScript, and failed layer loading. Decorative effects must be hidden from
  assistive technology and must not intercept page interaction.

The homepage script is wired to one homepage artwork. Do not assume it
automatically supports multiple post illustrations or copy its coordinates
onto a differently composed painting.

## Final review

- The cover clearly relates to the article and feels consistent with the
  approved artwork.
- The subject is prominent, anatomy and tools are credible, and there is no
  visible paper rectangle or unwanted label.
- Transparency and image quality survive export; file size is reasonable.
- The post works at narrow widths without horizontal scrolling.
- Existing navigation, typography, post URLs, and unrelated content are intact.
- If animated, inspect both extremes of movement, the resting state, and
  reduced-motion and failure fallbacks.

From the repository root, build with `hugo --source blog`. Preview with
`hugo server --source blog --baseURL http://localhost:1313/ --disableFastRender`
if a preview server is not already running. Inspect the actual post, not just
the source image. Do not commit generated `public/` or `resources/` output.

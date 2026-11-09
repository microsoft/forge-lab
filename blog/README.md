# FORGE Lab blog

The blog is a [Hugo](https://gohugo.io/) site in this `blog/` directory.
**Run the commands below inside the `blog/` directory.**

## Requirements

Install the **extended** edition of Hugo **v0.158.0 or newer** by following the
[installation guide](https://gohugo.io/installation/).

Distribution packages can be too old. We recommend downloading a release
archive from [GitHub releases](https://github.com/gohugoio/hugo/releases)
instead. On Linux x86-64, this installs it into `~/.local/bin`:

```bash
VERSION=0.169.0   # or the latest release
mkdir -p ~/.local/bin
curl -fsSL "https://github.com/gohugoio/hugo/releases/download/v${VERSION}/hugo_extended_${VERSION}_linux-amd64.tar.gz" \
  | tar -xz -C ~/.local/bin hugo
hugo version   # should report v0.158.0 or newer with +extended
```

Make sure `~/.local/bin` is on your `PATH`. For other platforms, pick the
matching `hugo_extended_*` archive from the release page.

## Create a post

Create each post as a leaf bundle so its images live beside the text:

```bash
hugo new content posts/my-post/index.md
```

This creates `content/posts/my-post/index.md` from
`archetypes/default.md`:

```text
content/posts/my-post/
  index.md
  figure.png      # optional images used by the post
```

A text-only post can instead be a single file, such as
`content/posts/welcome.md`. Both forms publish to `/posts/<slug>/`. To add
images later, move it to `<slug>/index.md` and keep the same `slug`.

## Front matter

Edit the generated front matter:

```toml
+++
title = "Article title"
date = 2026-11-04
description = "A short, accurate summary of the research."
slug = "my-post"
draft = true
+++
```

- `title`: shown on the post and in post lists.
- `date`: the publication date. Hugo skips posts dated in the future unless
  you pass `-F` (`--buildFuture`).
- `description`: used in post lists and the page's meta description.
- `author`: optional author name, shown alongside the post's date.
- `author_url`: optional profile URL linked from the author name.
- `slug`: sets the URL to `/posts/<slug>/`. Set it explicitly so the URL does
  not change if the title is edited.
- `draft`: keep `true` while writing. Remove it or set it to `false` to
  publish.

## Write the post

Write the body in Markdown below the front matter. Reference images in the
bundle with relative paths and descriptive alt text:

```markdown
![Call graph from the parser to the vulnerable copy.](figure.png)
```

Templates do not resize Markdown images, so optimize images before adding
them. For cover artwork, follow [`AGENTS.md`](./AGENTS.md).

## Preview

Start a local server that includes drafts:

```bash
hugo server -D
```

Open <http://localhost:1313/posts/my-post/>. The server reloads when files
change. The post also appears in the homepage and `/posts/` lists. If a page
looks stale after an edit, restart with `--disableFastRender` to force full
rebuilds.

## Before publishing

1. Set `draft = false` (or remove the line) and confirm the `date`.
2. Build without drafts to confirm the post is included:

   ```bash
   hugo
   ```

3. Check the post at desktop and narrow mobile widths.
4. Commit only the post bundle and any intentional asset changes. Do not
   commit the generated `public/` or `resources/` directories.

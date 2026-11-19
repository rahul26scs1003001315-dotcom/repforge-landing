#!/usr/bin/env node
/**
 * GitHub Pages serves a directory URL as `<dir>/index.html`, but `next build`
 * with `output: 'export'` and `trailingSlash: false` writes only `privacy.html`
 * plus a `privacy/` directory holding the RSC payloads. So `/privacy` works and
 * `/privacy/` returns 404 — on the one page Play review opens, and on any link
 * that a browser or a person completes with a slash.
 *
 * This copies each exported page into its own directory as `index.html`, which
 * makes both forms resolve without switching the whole site to `trailingSlash:
 * true` (that would move every canonical URL to the slash form and send the
 * store listings through a redirect).
 *
 * Runs as part of `npm run build`, after `next build`; a no-op if a directory
 * already has an index.html or the page has no directory beside it.
 */
import { copyFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const OUT = join(process.cwd(), 'out')

if (!existsSync(OUT)) {
  console.error('✖ no out/ — run `next build` first')
  process.exit(1)
}

/** Every directory under out/ that has a sibling `<name>.html`, at any depth. */
const written = []

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const full = join(dir, entry.name)
    // Next internals, well-known files and asset directories are not routes.
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue

    const page = `${full}.html`
    if (existsSync(page) && statSync(page).isFile()) {
      const index = join(full, 'index.html')
      if (!existsSync(index)) {
        copyFileSync(page, index)
        written.push(index.slice(OUT.length + 1))
      }
    }
    walk(full)
  }
}

walk(OUT)

console.log(
  written.length
    ? `✔ trailing-slash copy: ${written.join(', ')}`
    : '✔ trailing-slash copy: nothing to add'
)

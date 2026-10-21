/** @type {import('next').NextConfig} */
const REPO = 'repforge-landing'

// GitHub Pages serves a *project* site from /<repo>/, so assets need that prefix
// there. Locally we keep it off so the dev/preview server works at the root.
const isPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['127.0.0.1'],
  output: 'export',
  images: { unoptimized: true },
  // A random build id changes `_next/static/<id>/` on every build, and the Pages
  // deploy replaces the branch wholesale — so the HTML still cached by the CDN
  // pointed at a manifest directory the new commit had just deleted. Pinning the
  // id makes every deploy overwrite files in place instead of moving them.
  generateBuildId: () => 'repforge-pages',
  ...(isPages ? { basePath: `/${REPO}`, assetPrefix: `/${REPO}` } : {}),
}

module.exports = nextConfig

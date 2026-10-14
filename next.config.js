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
  ...(isPages ? { basePath: `/${REPO}`, assetPrefix: `/${REPO}` } : {}),
}

module.exports = nextConfig

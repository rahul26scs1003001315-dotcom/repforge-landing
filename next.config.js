const { readAppFacts } = require('./lib/appFacts.cjs')

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

/**
 * The figures the pages state about the app — its exercise count, the Android
 * version it supports, and the APK it serves — are read from the app checkout on
 * every build, never typed here. `lib/appFacts.cjs` explains where each comes from
 * and refuses to guess; a build without that checkout fails instead of shipping
 * yesterday's numbers.
 *
 * They go through `env` because the pages that show them are client components,
 * which cannot read the filesystem; a static export inlines these at build time.
 */
module.exports = async () => {
  const facts = await readAppFacts()
  return {
    ...nextConfig,
    env: {
      NEXT_PUBLIC_EXERCISE_COUNT: String(facts.library.total),
      NEXT_PUBLIC_EXERCISE_COUNT_REPDB: String(facts.library.repdb),
      NEXT_PUBLIC_ANDROID_MIN_VERSION: facts.android.version,
      NEXT_PUBLIC_APK_VERSION: facts.apk.version,
      NEXT_PUBLIC_APK_BYTES: String(facts.apk.bytes),
      NEXT_PUBLIC_APK_SHA256: facts.apk.sha256,
    },
  }
}

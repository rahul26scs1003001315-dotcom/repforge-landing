import type { Metadata } from 'next'
import Link from 'next/link'
import StatsPanel from '../../components/StatsPanel'

export const metadata: Metadata = {
  title: 'Counter — RepForge',
  // Unlisted rather than private: kept out of search results and out of the
  // sitemap, but anyone who has the URL can read the totals.
  robots: { index: false, follow: false },
}

export default function StatsPage() {
  return (
    <main className="min-h-screen bg-[#05060c] px-5 py-16 font-sans text-slate-200 antialiased selection:bg-rose-500/40 selection:text-white sm:px-6 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-semibold text-rose-400 transition-colors duration-200 hover:text-rose-300"
        >
          &larr; RepForge
        </Link>

        <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-balance text-white sm:text-5xl">
          Counter
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
          Everything the site knows about its own traffic. These are counts only — a date, a name
          and an integer. No visitor is identified, and there is no third-party analytics anywhere
          in this build.
        </p>

        <StatsPanel />

        <section className="mt-10 space-y-4 text-sm leading-relaxed text-slate-400">
          <p>
            <span className="font-semibold text-slate-200">Page views</span> count a page opening in a
            browser. Bots that execute JavaScript are included; there is no filtering.
          </p>
          <p>
            <span className="font-semibold text-slate-200">Download starts</span> count presses on the
            APK button. A website cannot see whether an install finished, so this is a floor, not an
            install count.
          </p>
          <p>
            <span className="font-semibold text-slate-200">Account count</span> is not published here.
            The number of registered people is business data, and this endpoint answers to any browser,
            so it is read locally with the service key instead.
          </p>
          <p className="text-slate-500">
            Nothing here is tamper-proof: the counting endpoint is public by necessity, so someone
            could inflate a number. Treat these as a smoke signal rather than a measurement.
          </p>
        </section>

        <footer className="mt-12 border-t border-white/[0.08] pt-6 text-sm text-slate-400">
          <Link className="font-semibold text-rose-400 hover:text-rose-300" href="/download">
            Download RepForge
          </Link>
          {' · '}
          <Link className="font-semibold text-rose-400 hover:text-rose-300" href="/privacy">
            Privacy policy
          </Link>
        </footer>
      </div>
    </main>
  )
}

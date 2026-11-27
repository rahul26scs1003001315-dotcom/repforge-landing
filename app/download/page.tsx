import type { Metadata } from 'next'
import Link from 'next/link'
import DownloadLink from '../../components/DownloadLink'
import StoreIntentLink from '../../components/StoreIntentLink'
import { playStoreUrl } from '../../lib/links'

export const metadata: Metadata = {
  title: 'Download RepForge — Google Play, Android APK and Vivo App Store',
  description:
    'Every way to install RepForge on Android: Google Play, the signed APK with its checksum, and the Vivo App Store.',
  alternates: { canonical: 'https://repforge.website/download' },
}

/**
 * The permanent release URL, and the three facts about the file it serves.
 *
 * These describe the APK at `releases/latest`, not `app.json`: the direct
 * download is a GitHub release asset, so it only moves when a release is cut,
 * and a page that quoted the app's version instead would advertise a checksum
 * for a file nobody can download. `npm run apk:sync` rewrites them from the
 * release APK itself (version from the build report, size and sha256 from the
 * bytes), which is the only way they should change.
 */
const APK_URL =
  'https://github.com/rahul26scs1003001315-dotcom/repforge-releases/releases/latest/download/repforge.apk'
const APK_VERSION = '1.0.39'
const APK_BYTES = 68406117
const APK_SHA256 = 'd6fbcdb81b748af06dfb40a8e741e2eb47874c4e213eed18237180245566989f'

const SIZE_MB = `${(APK_BYTES / 1048576).toFixed(1)} MB`

/**
 * Store links.
 *
 * Google Play is the exception to "search always resolves": another developer
 * publishes "RepForge: Gym Workout Tracker" as `com.srujan1527.repforge`, so a
 * name search there lands on the wrong app. The package id is the only URL that
 * cannot be confused.
 *
 * vivo is addressed by package id as well, through the market intent: vivo's own
 * developer documentation ("应用评论调起能力接入指南") gives `market://details?id=<pkg>`
 * as the way to open a listing, and the global store has no web catalogue to link
 * to instead. Huawei AppGallery is deliberately absent: it has no public
 * package-name lookup and this repository never recorded the store's own app id,
 * so every link it could carry would be a name search that may land on another
 * developer's app.
 */
type Store = {
  name: string
  note: string
  href?: string
  /** An Android intent instead of a URL: nothing on the desktop can open it. */
  intent?: string
}

const STORES: Store[] = [
  {
    name: 'Google Play',
    href: playStoreUrl('download'),
    note: 'The store install: managed updates, no sideloading, and the listing has to pass Play review before a build arrives.',
  },
  {
    // vivo's developer console exposes no web listing and the global store has no
    // public catalogue (appstore.vivo.com does not resolve; h5.appstore.vivo.com.cn
    // is the separate China store, where this package is not listed). The market
    // intent is the only link that reaches the live listing: on a vivo phone it
    // opens that store at com.repforge, elsewhere the default market app handles it.
    name: 'Vivo App Store',
    intent: 'market://details?id=com.repforge',
    note: 'Live on vivo phones as RepForge. Tap this on the phone to open the store app; browsers on a computer cannot hand off to it.',
  },
]

export default function DownloadPage() {
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
          Download RepForge
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
          Free, no account needed to start, and it runs offline once the install is done. Pick a
          route below — the APK is the same release that goes to the stores.
        </p>

        {/* Primary: the signed APK */}
        <section className="mt-10 rounded-2xl border border-white/[0.10] bg-white/[0.03] p-6 backdrop-blur-xl">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold text-white">Direct APK</h2>
            <span className="text-sm text-slate-400">
              v{APK_VERSION} · {SIZE_MB}
            </span>
          </div>

          <DownloadLink
            href={APK_URL}
            className="mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-7 py-4 text-base font-bold text-white shadow-[0_16px_40px_-12px_rgba(244,63,94,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-12px_rgba(244,63,94,0.9)] active:scale-[0.98] sm:w-auto"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
              <path d="M12 3v10.6l3.3-3.3 1.4 1.4L12 16.4l-4.7-4.7 1.4-1.4 3.3 3.3V3h2zM5 19h14v2H5v-2z" />
            </svg>
            Download the APK
          </DownloadLink>

          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Requires Android 7.0 or newer. The download is a plain {SIZE_MB} file served from the
            release page on GitHub.
          </p>

          <details className="mt-5 rounded-xl border border-white/[0.08] bg-black/20 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-slate-300">
              Check the file before installing
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Every release is signed with the same key, and the checksum below is the exact file
              on the server. If your download does not match, do not install it.
            </p>
            <p className="mt-3 font-mono text-[11px] break-all text-slate-300">{APK_SHA256}</p>
            <p className="mt-3 text-xs text-slate-500">macOS or Linux</p>
            <pre className="mt-1 overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-[11px] text-slate-300">
              shasum -a 256 repforge.apk
            </pre>
            <p className="mt-3 text-xs text-slate-500">Windows</p>
            <pre className="mt-1 overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-[11px] text-slate-300">
              certutil -hashfile repforge.apk SHA256
            </pre>
          </details>
        </section>

        {/* Sideload steps */}
        <section className="mt-8 rounded-2xl border border-white/[0.10] bg-white/[0.02] p-6">
          <h2 className="text-lg font-bold text-white">Installing an APK</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Android blocks installs from outside the Play Store until you say otherwise for that one
            source. This is normal for any store that is not Google&rsquo;s.
          </p>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
            <li>
              <span className="font-semibold text-white">1.</span> Tap the download button above and
              wait for the file to finish — {SIZE_MB} takes a moment on mobile data.
            </li>
            <li>
              <span className="font-semibold text-white">2.</span> Open it. If Android asks, allow
              installs from your browser or file manager for this one file. On Huawei devices the
              prompt lives under Settings &rarr; Security &rarr; Install unknown apps.
            </li>
            <li>
              <span className="font-semibold text-white">3.</span> Confirm, then open RepForge. The
              privacy notice appears first; nothing is stored until you accept it.
            </li>
          </ol>
        </section>

        {/* Stores */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-white">Or install from a store</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {STORES.map((store) =>
              store.intent ? (
                <StoreIntentLink
                  key={store.name}
                  name={store.name}
                  note={store.note}
                  intent={store.intent}
                />
              ) : (
                <a
                  key={store.name}
                  href={store.href}
                  className="rounded-2xl border border-white/[0.10] bg-white/[0.03] p-5 transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.06]"
                >
                  <div className="text-sm font-bold text-white">{store.name}</div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{store.note}</p>
                  <span className="mt-3 inline-block text-xs font-semibold text-rose-400">
                    Find RepForge &rarr;
                  </span>
                </a>
              )
            )}
          </div>
        </section>

        <footer className="mt-12 border-t border-white/[0.08] pt-6 text-sm text-slate-400">
          <p>
            <Link className="font-semibold text-rose-400 hover:text-rose-300" href="/privacy">
              Privacy policy
            </Link>
            {' · '}
            <Link
              className="font-semibold text-rose-400 hover:text-rose-300"
              href="/privacy-zh"
              lang="zh-Hans"
            >
              隐私政策
            </Link>
            {' · '}
            <Link
              className="font-semibold text-rose-400 hover:text-rose-300"
              href="/delete-account"
            >
              Delete your account
            </Link>
          </p>
        </footer>
      </div>
    </main>
  )
}

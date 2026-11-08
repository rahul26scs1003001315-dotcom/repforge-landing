import type { Metadata } from 'next'
import Link from 'next/link'
import DownloadLink from '../../components/DownloadLink'

export const metadata: Metadata = {
  title: 'Download RepForge — Android APK, AppGallery and Amazon Appstore',
  description:
    'Every way to install RepForge on Android: the signed APK with its checksum, Huawei AppGallery and the Amazon Appstore.',
  alternates: { canonical: 'https://repforge.website/download' },
}

/** The permanent release URL. Bump the three constants below when 1.0.16 ships. */
const APK_URL =
  'https://github.com/rahul26scs1003001315-dotcom/repforge-releases/releases/latest/download/repforge.apk'
const APK_VERSION = '1.0.24'
const APK_BYTES = 49659415
const APK_SHA256 = 'f75a7ee501b6686c4cdd82eb918df6e9535acc04f0b9d50fd3e79b395f6cc85f'

const SIZE_MB = `${(APK_BYTES / 1048576).toFixed(1)} MB`

/**
 * Store links point at each store's search results rather than a listing id.
 * A wrong listing id is a dead link, and the ids live in the consoles, not in
 * this repository; search always resolves to whatever the store is serving.
 */
const STORES = [
  {
    name: 'Huawei AppGallery',
    href: 'https://appgallery.huawei.com/search/RepForge',
    note: 'Listed as RepForge. A store copy is always behind the APK above while a release is in review — the direct download is the current build.',
  },
  {
    name: 'Amazon Appstore',
    href: 'https://www.amazon.com/s?k=RepForge&i=mobile-apps',
    note: 'For Fire tablets and Amazon-installed Android devices.',
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
          route below — the APK is the same build that goes to the stores.
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
            {STORES.map((store) => (
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
            ))}
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

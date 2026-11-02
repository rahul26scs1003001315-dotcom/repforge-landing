import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'RepForge — design demos',
  description: 'Internal design explorations. Not indexed.',
  robots: { index: false, follow: false },
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#05060c] font-sans text-slate-200 antialiased selection:bg-rose-500/40 selection:text-white">
      {children}

      {/* Switcher so both directions can be compared side by side. */}
      <div className="fixed right-4 bottom-4 z-[60] flex items-center gap-1 rounded-full border border-white/10 bg-[#0a0d18]/85 p-1 shadow-2xl backdrop-blur-xl">
        <span className="px-2 text-[10px] font-bold tracking-[0.18em] text-slate-500 uppercase">
          Demo
        </span>
        <Link
          href="/demo/a"
          className="rounded-full px-2.5 py-1 text-[11px] font-bold text-slate-300 transition-colors duration-200 hover:bg-white/10 hover:text-white"
        >
          A
        </Link>
        <Link
          href="/demo/b"
          className="rounded-full px-2.5 py-1 text-[11px] font-bold text-slate-300 transition-colors duration-200 hover:bg-white/10 hover:text-white"
        >
          B
        </Link>
      </div>
    </div>
  )
}

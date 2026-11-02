import type { Metadata } from 'next'
import { DemoAView } from './demo/a/page'

export const metadata: Metadata = {
  title: 'RepForge — Every rep is evidence',
  description:
    'A strength log built around the way you actually train: build the routine once, log each set in two taps, and watch the numbers prove the work.',
  openGraph: {
    title: 'RepForge — Every rep is evidence. RepForge keeps the record.',
    description:
      'Build the routine once, log each set in two taps, and watch the numbers prove the work.',
    type: 'website',
  },
}

/**
 * The homepage is Demo A rendered "live": same component as /demo/a, but without
 * the demo badge, the design-demo footer note or the A/B switcher. The previous
 * homepage is preserved at /classic.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#05060c] font-sans text-slate-200 antialiased selection:bg-rose-500/40 selection:text-white">
      <DemoAView live />
    </div>
  )
}

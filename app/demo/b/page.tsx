'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Mesh } from '../_components/mesh'
import { Reveal } from '../_components/reveal'

const APK_DOWNLOAD_URL =
  'https://github.com/rahul26scs1003001315-dotcom/repforge-releases/releases/latest/download/repforge.apk'

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

const TOKENS = [
  { id: 'bench', label: 'Bench Press', tint: 'from-rose-500/25 to-rose-500/5', ring: 'border-rose-400/30' },
  { id: 'shrug', label: 'Shrugs', tint: 'from-cyan-500/25 to-cyan-500/5', ring: 'border-cyan-400/30' },
  { id: 'incline', label: 'Incline DB Press', tint: 'from-indigo-500/25 to-indigo-500/5', ring: 'border-indigo-400/30' },
  { id: 'row', label: 'Cable Row', tint: 'from-emerald-500/25 to-emerald-500/5', ring: 'border-emerald-400/30' },
  { id: 'lateral', label: 'Lateral Raise', tint: 'from-violet-500/25 to-violet-500/5', ring: 'border-violet-400/30' },
  { id: 'curl', label: 'Hammer Curl', tint: 'from-amber-500/25 to-amber-500/5', ring: 'border-amber-400/30' },
]

const MATRIX_ROWS = [
  { set: 1, offset: 0, reps: 8, flag: 'Top set' },
  { set: 2, offset: -2.5, reps: 8, flag: '' },
  { set: 3, offset: -5, reps: 7, flag: '' },
  { set: 4, offset: -7.5, reps: 6, flag: 'Back-off' },
]

const STACK_NODES = [
  { name: 'Client', detail: 'Android · local-first', tone: 'from-slate-300 to-slate-500' },
  { name: 'Identity', detail: 'Supabase Auth wrapper', tone: 'from-cyan-400 to-sky-500' },
  { name: 'Database', detail: 'Postgres + row-level security', tone: 'from-emerald-400 to-teal-500' },
  { name: 'Pipeline', detail: 'Edge functions · sync queue', tone: 'from-indigo-400 to-violet-500' },
  { name: 'Delivery', detail: 'Signed APK · GitHub Releases', tone: 'from-rose-400 to-orange-500' },
]

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function DemoBPage() {
  // Lifted so the mesh can brighten with the rep under load.
  const [tension, setTension] = useState(0)

  return (
    <div className="relative">
      <Mesh intensity={tension} />
      <Nav />
      <main>
        <Hero tension={tension} setTension={setTension} />
        <TactileMatrix />
        <FluidTimeline />
        <TechMatrix />
        <JoinPortal />
      </main>
      <Footer />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Nav                                                                        */
/* -------------------------------------------------------------------------- */

function Nav() {
  const [open, setOpen] = useState(false)
  const links = [
    { label: 'Rep sandbox', href: '#sandbox' },
    { label: 'Set matrix', href: '#matrix' },
    { label: 'Timeline', href: '#timeline' },
    { label: 'Architecture', href: '#stack' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#05060c]/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="#top" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-indigo-600 shadow-[0_0_24px_rgba(244,63,94,0.35)]">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="text-base font-extrabold tracking-tight text-white">RepForge</span>
          <span className="ml-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] font-bold tracking-[0.16em] text-slate-400 uppercase">
            Demo B
          </span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-semibold text-slate-400 transition-colors duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:outline-none"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={APK_DOWNLOAD_URL}
          className="hidden rounded-full bg-white px-4 py-2 text-sm font-bold text-[#05060c] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,255,255,0.18)] active:scale-95 lg:inline-flex"
        >
          Download
        </a>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition-colors duration-200 hover:bg-white/[0.06] lg:hidden"
        >
          <svg width="16" height="12" viewBox="0 0 18 14" aria-hidden="true">
            <rect width="18" height="2" rx="1" fill="currentColor" />
            <rect y="6" width="18" height="2" rx="1" fill="currentColor" />
            <rect y="12" width="18" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/[0.06] bg-[#05060c]/95 px-5 py-4 backdrop-blur-xl lg:hidden">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/[0.06]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/* Hero — Live Rep Sandbox                                                    */
/* -------------------------------------------------------------------------- */

function Hero({
  tension,
  setTension,
}: {
  tension: number
  setTension: (value: number) => void
}) {
  const progressRef = useRef(0)
  const velocityRef = useRef(0)
  const frameRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const holdingRef = useRef(false)
  const peakedRef = useRef(false)
  const lastRef = useRef(0)
  const sentTensionRef = useRef(0)

  const [progress, setProgress] = useState(0)
  const [reps, setReps] = useState(0)
  const [peakSeen, setPeakSeen] = useState(false)

  const clearLoop = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => clearLoop, [clearLoop])

  // One ticker owns both directions, so the bar can never be left stranded by a
  // cancelled frame from a previous press.
  const runLoop = useCallback(() => {
    clearLoop()
    lastRef.current = performance.now()

    const tick = () => {
      const now = performance.now()
      const dt = Math.min(0.05, Math.max(0, (now - lastRef.current) / 1000))
      lastRef.current = now

      if (holdingRef.current) {
        velocityRef.current = 0
        progressRef.current = Math.min(1, progressRef.current + dt / 1.1)
        if (progressRef.current >= 0.97) {
          peakedRef.current = true
          setPeakSeen(true)
        }
      } else {
        velocityRef.current += dt * 5.2
        progressRef.current = Math.max(0, progressRef.current - velocityRef.current * dt)
      }

      const next = progressRef.current
      setProgress(next)
      if (Math.abs(next - sentTensionRef.current) > 0.02) {
        sentTensionRef.current = next
        setTension(next)
      }

      if (!holdingRef.current && next <= 0) {
        velocityRef.current = 0
        setPeakSeen(false)
        if (sentTensionRef.current !== 0) {
          sentTensionRef.current = 0
          setTension(0)
        }
        clearLoop()
        return
      }

      // rAF is suspended in hidden tabs, so use timers there and never freeze.
      if (document.hidden) {
        timerRef.current = setTimeout(tick, 48)
      } else {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    if (document.hidden) {
      timerRef.current = setTimeout(tick, 24)
    } else {
      frameRef.current = requestAnimationFrame(tick)
    }
  }, [clearLoop, setTension])

  const press = useCallback(() => {
    if (holdingRef.current) return
    holdingRef.current = true
    velocityRef.current = 0
    runLoop()
  }, [runLoop])

  const release = useCallback(() => {
    if (!holdingRef.current) return
    holdingRef.current = false

    if (peakedRef.current) {
      peakedRef.current = false
      setReps((count) => count + 1)
    }

    if (progressRef.current <= 0) {
      clearLoop()
      return
    }

    velocityRef.current = 0
    runLoop()
  }, [clearLoop, runLoop])

  const releaseRef = useRef(release)

  useEffect(() => {
    releaseRef.current = release
  }, [release])

  // A release that never reaches the button used to leave the bar stuck at the
  // top, so listen on the window as a safety net.
  useEffect(() => {
    const end = () => releaseRef.current()
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
    window.addEventListener('blur', end)
    return () => {
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
      window.removeEventListener('blur', end)
    }
  }, [])

  return (
    <section id="top" className="relative">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-16 pb-20 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:pt-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-bold tracking-[0.14em] text-slate-300 uppercase backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
            </span>
            Interactive demo
          </span>

          <h1 className="mt-6 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">
              Feel the rep
            </span>
            <br />
            <span className="bg-gradient-to-r from-rose-400 via-rose-500 to-indigo-400 bg-clip-text text-transparent">
              before you log it.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">
            Press and hold the plate. The bar rises with you, the room heats up at peak
            contraction, and the record drops into place the moment you let go.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={APK_DOWNLOAD_URL}
              className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-7 py-4 text-base font-bold text-white shadow-[0_16px_40px_-12px_rgba(244,63,94,0.8)] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:-translate-y-1 active:scale-[0.98]"
            >
              Download for Android
            </a>
            <a
              href="#matrix"
              className="inline-flex items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.03] px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07]"
            >
              See the set matrix
            </a>
          </div>
        </Reveal>

        {/* The sandbox */}
        <Reveal delay={110}>
          <div
            id="sandbox"
            className="relative overflow-hidden rounded-3xl border border-white/[0.10] bg-white/[0.03] p-5 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.95)] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-[0.18em] text-slate-400 uppercase">
                  Live rep sandbox
                </p>
                <p className="mt-1 font-mono text-[11px] text-slate-500">Barbell bench · 60 kg</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] font-bold tracking-[0.16em] text-slate-500 uppercase">
                  Reps
                </p>
                <p className="font-mono text-2xl font-extrabold text-white" aria-live="polite">
                  {String(reps).padStart(2, '0')}
                </p>
              </div>
            </div>

            <div className="relative mt-4 h-[300px] overflow-hidden rounded-2xl border border-white/[0.07] bg-[radial-gradient(ellipse_at_50%_80%,rgba(99,102,241,0.18),transparent_70%)]">
              {/* Load readout */}
              <div className="absolute top-3 left-1/2 z-10 -translate-x-1/2 text-center">
                <p
                  className="font-mono text-lg font-extrabold text-white transition-all duration-200"
                  style={{ textShadow: progress > 0.75 ? '0 0 22px rgba(244,63,94,0.9)' : 'none' }}
                >
                  {(60 + progress * 12).toFixed(1)}
                  <span className="ml-1 text-[10px] font-bold text-slate-400">kg</span>
                </p>
                <p className="mt-0.5 text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                  {progress > 0.96
                    ? 'Peak contraction'
                    : progress > 0.4
                      ? 'Concentric'
                      : progress > 0.05
                        ? 'Initiation'
                        : 'Racked'}
                </p>
              </div>

              {/* Rail */}
              <div className="absolute inset-x-10 top-16 bottom-8">
                <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-white/5 via-white/15 to-white/5" />

                {/* The bar + plates */}
                <div
                  className="absolute inset-x-0 top-1/2 will-change-transform"
                  style={{
                    transform: `translateY(${progress * -104}px)`,
                    transition: 'transform 60ms linear',
                  }}
                >
                  <div
                    className="relative flex h-4 items-center rounded-full bg-gradient-to-r from-slate-500 via-slate-200 to-slate-500 shadow-[0_0_24px_rgba(148,163,184,0.35)]"
                    style={{
                      boxShadow:
                        progress > 0.7
                          ? `0 0 ${18 + progress * 30}px rgba(244,63,94,${0.35 + progress * 0.45})`
                          : undefined,
                    }}
                  >
                    {/* Collars + plates */}
                    {[-1, 1].map((side) => (
                      <span key={side} className="absolute top-1/2 -translate-y-1/2" style={{ [side < 0 ? 'left' : 'right']: '14%' }}>
                        <span className="block h-10 w-2.5 rounded-sm bg-gradient-to-b from-slate-300 to-slate-500" />
                      </span>
                    ))}
                    {[-1, 1].map((side) => (
                      <span key={`outer-${side}`} className="absolute top-1/2 -translate-y-1/2" style={{ [side < 0 ? 'left' : 'right']: '8%' }}>
                        <span className="block h-14 w-3 rounded-sm bg-gradient-to-b from-rose-400 to-rose-600" />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Floor */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              {/* Tension meter */}
              <div className="absolute right-4 bottom-1/2 flex h-40 w-1.5 -translate-y-1/2 flex-col justify-end overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="w-full rounded-full bg-gradient-to-t from-indigo-500 via-rose-500 to-rose-300 transition-all duration-100"
                  style={{ height: `${progress * 100}%` }}
                />
              </div>

              {/* Peak flash */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(244,63,94,0.35),transparent_65%)] transition-opacity duration-200"
                style={{ opacity: progress > 0.8 ? (progress - 0.8) * 3.2 : 0 }}
              />
            </div>

            {/* Hold target */}
            <button
              type="button"
              onPointerDown={(event) => {
                press()
                try {
                  event.currentTarget.setPointerCapture?.(event.pointerId)
                } catch {
                  // A pointer that already ended cannot be captured; the window
                  // release listeners still finish the rep.
                }
              }}
              onPointerUp={release}
              onPointerCancel={release}
              onKeyDown={(event) => {
                if (event.key === ' ' || event.key === 'Enter') {
                  event.preventDefault()
                  press()
                }
              }}
              onKeyUp={(event) => {
                if (event.key === ' ' || event.key === 'Enter') {
                  event.preventDefault()
                  release()
                }
              }}
              onContextMenu={(event) => event.preventDefault()}
              className={`mt-4 w-full touch-none rounded-2xl border px-4 py-4 text-center select-none transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:outline-none active:scale-[0.99] ${
                progress > 0.05
                  ? 'border-rose-400/50 bg-rose-500/15 shadow-[0_0_40px_-10px_rgba(244,63,94,0.8)]'
                  : 'border-white/[0.12] bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]'
              }`}
            >
              <span className="block text-sm font-extrabold text-white">
                {progress > 0.05 ? 'Release to rack' : 'Hold to simulate rep'}
              </span>
              <span className="mt-0.5 block text-[10px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                {peakSeen ? 'Peak reached — release to count it' : 'Pointer, touch or space bar'}
              </span>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Tactile matrix                                                             */
/* -------------------------------------------------------------------------- */

function TactileMatrix() {
  const [weight, setWeight] = useState(60)
  const [dialOpen, setDialOpen] = useState(true)

  const bump = (delta: number) => {
    setWeight((current) => Math.min(300, Math.max(0, Number((current + delta).toFixed(1)))))
    setDialOpen(true)
  }

  return (
    <section id="matrix" className="mx-auto max-w-6xl px-5 pb-20 sm:px-6 lg:pb-28">
      <Reveal>
        <div className="max-w-2xl">
          <span className="text-[11px] font-bold tracking-[0.2em] text-cyan-300 uppercase">
            Tactile set matrix
          </span>
          <h2 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-4xl">
            Change four sets with one dial.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Mass edit is the feature people stay for. Tap the handle, turn the dial once, and every
            row in the block updates at the same time.
          </p>
        </div>
      </Reveal>

      <Reveal delay={130} className="mt-9">
        <div className="relative grid gap-4 lg:grid-cols-[1fr_0.72fr]">
          {/* Matrix card */}
          <div className="relative rounded-3xl border border-white/[0.09] bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
              <div>
                <p className="text-sm font-extrabold text-white">Barbell Bench Press</p>
                <p className="mt-0.5 text-[10px] font-bold tracking-[0.16em] text-slate-500 uppercase">
                  4 sets · 8 reps target
                </p>
              </div>

              {/* Mass edit floating handle */}
              <button
                type="button"
                onClick={() => setDialOpen((open) => !open)}
                aria-expanded={dialOpen}
                aria-controls="mass-edit-dial"
                className="group flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-bold text-cyan-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-500/20 focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:outline-none"
              >
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="absolute h-2 w-2 animate-ping rounded-full bg-cyan-400/70" />
                  <span className="h-1 w-1 rounded-full bg-cyan-300" />
                </span>
                Mass edit
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {MATRIX_ROWS.map((row, index) => (
                <div
                  key={`${weight}-${row.set}`}
                  className="flex animate-cascade items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/[0.06] font-mono text-[10px] font-bold text-slate-400">
                    {row.set}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[13px] font-bold text-white">
                      {Number((weight + row.offset).toFixed(1))}
                      <span className="ml-1 text-[10px] font-semibold text-slate-500">kg</span>
                    </span>
                    <span className="block text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
                      {row.flag || 'Working set'}
                    </span>
                  </span>
                  <span className="font-mono text-[12px] font-bold text-slate-300">
                    × {row.reps}
                  </span>
                  <span className="h-4 w-px bg-white/10" />
                  <span className="font-mono text-[10px] text-slate-500">✓</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.07] bg-[#05060c]/60 px-4 py-3">
              <span className="text-[10px] font-bold tracking-[0.16em] text-slate-500 uppercase">
                Block tonnage
              </span>
              <span className="font-mono text-sm font-extrabold text-cyan-300">
                {MATRIX_ROWS.reduce(
                  (total, row) => total + (weight + row.offset) * row.reps,
                  0,
                ).toLocaleString('en-US', { maximumFractionDigits: 0 })}{' '}
                kg
              </span>
            </div>
          </div>

          {/* Dial */}
          <div
            id="mass-edit-dial"
            className={`overflow-hidden rounded-3xl border border-white/[0.09] bg-[#070912]/80 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
              dialOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 border-transparent opacity-0'
            }`}
          >
            <div className="p-5">
              <p className="text-center text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                Mass edit dial
              </p>

              <div className="relative mx-auto mt-4 h-40 w-40">
                <svg viewBox="0 0 160 160" className="h-full w-full" aria-hidden="true">
                  <circle cx="80" cy="80" r="66" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                  <circle
                    cx="80"
                    cy="80"
                    r="66"
                    fill="none"
                    stroke="url(#dialGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="415"
                    strokeDashoffset={415 - (Math.min(300, weight) / 300) * 415}
                    transform="rotate(-90 80 80)"
                    style={{ transition: 'stroke-dashoffset 420ms cubic-bezier(0.175,0.885,0.32,1.275)' }}
                  />
                  <defs>
                    <linearGradient id="dialGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-3xl font-extrabold text-white">{weight}</span>
                  <span className="text-[10px] font-bold tracking-[0.18em] text-slate-500 uppercase">
                    kg
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {[-2.5, 2.5].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => bump(delta)}
                    className="rounded-xl border border-white/[0.10] bg-white/[0.04] py-3 font-mono text-sm font-extrabold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/[0.08] active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:outline-none"
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </button>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                {[-5, 5].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => bump(delta)}
                    className="rounded-xl border border-white/[0.10] bg-white/[0.04] py-3 font-mono text-sm font-extrabold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/[0.08] active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:outline-none"
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </button>
                ))}
              </div>

              <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-500">
                Every row re-renders at once — the same stroke you make in the app.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Fluid interaction timeline                                                 */
/* -------------------------------------------------------------------------- */

function FluidTimeline() {
  const [slots, setSlots] = useState<(string | null)[]>(['bench', null, null, null])
  const [dragging, setDragging] = useState<string | null>(null)
  const [hoverSlot, setHoverSlot] = useState<number | null>(null)

  const labelFor = (id: string) => TOKENS.find((token) => token.id === id)
  const placed = slots.filter(Boolean) as string[]
  const pool = TOKENS.filter((token) => !placed.includes(token.id))

  const place = (slotIndex: number, tokenId: string) => {
    setSlots((current) => {
      const next = [...current]
      // Remove the token from wherever it already sits so it never duplicates.
      for (let i = 0; i < next.length; i += 1) {
        if (next[i] === tokenId) next[i] = null
      }
      next[slotIndex] = tokenId
      return next
    })
  }

  const clearSlot = (slotIndex: number) => {
    setSlots((current) => {
      const next = [...current]
      next[slotIndex] = null
      return next
    })
  }

  return (
    <section id="timeline" className="mx-auto max-w-6xl px-5 pb-20 sm:px-6 lg:pb-28">
      <Reveal>
        <div className="max-w-2xl">
          <span className="text-[11px] font-bold tracking-[0.2em] text-violet-300 uppercase">
            Fluid interaction timeline
          </span>
          <h2 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-4xl">
            Build the routine by moving it.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Drag an exercise token into a slot. The others slide apart to make room and snap back
            into place — no dialogs, no confirmations.
          </p>
        </div>
      </Reveal>

      <Reveal delay={130} className="mt-9">
        <div className="rounded-3xl border border-white/[0.09] bg-white/[0.025] p-5 backdrop-blur-xl sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
              Push day A · draft
            </p>
            <span className="font-mono text-[10px] font-bold text-slate-500">
              {placed.length}/4 slots
            </span>
          </div>

          {/* Slots */}
          <div className="-mx-1 mt-4 flex gap-3 overflow-x-auto px-1 pb-2">
            {slots.map((tokenId, index) => {
              const token = tokenId ? labelFor(tokenId) : null
              const isTarget = hoverSlot === index
              return (
                <div
                  key={index}
                  onDragOver={(event) => {
                    event.preventDefault()
                    setHoverSlot(index)
                  }}
                  onDragLeave={() => setHoverSlot(null)}
                  onDrop={(event) => {
                    event.preventDefault()
                    const id = event.dataTransfer.getData('text/plain') || dragging
                    if (id) place(index, id)
                    setDragging(null)
                    setHoverSlot(null)
                  }}
                  onClick={() => {
                    if (dragging) {
                      place(index, dragging)
                      setDragging(null)
                    }
                  }}
                  className={`relative flex min-h-[112px] min-w-[150px] flex-1 flex-col justify-between rounded-2xl border p-3 transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                    token
                      ? `border-white/15 bg-gradient-to-br ${token.tint}`
                      : isTarget
                        ? 'scale-[1.02] border-violet-400/50 bg-violet-500/10'
                        : 'border-dashed border-white/[0.12] bg-white/[0.015]'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {token && (
                      <button
                        type="button"
                        aria-label={`Remove ${token.label}`}
                        onClick={(event) => {
                          event.stopPropagation()
                          clearSlot(index)
                        }}
                        className="rounded-md px-1 text-[11px] font-bold text-slate-400 transition-colors hover:text-white"
                      >
                        ×
                      </button>
                    )}
                  </span>

                  {token ? (
                    <span key={token.id} className="animate-pop">
                      <span className="block text-[12px] leading-snug font-extrabold text-white">
                        {token.label}
                      </span>
                      <span className="mt-1 block font-mono text-[10px] text-slate-300">
                        4 × 8 · 60 kg
                      </span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-500">
                      {isTarget ? 'Drop here' : 'Empty slot'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Token pool */}
          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              const id = event.dataTransfer.getData('text/plain') || dragging
              if (!id) return
              setSlots((current) => current.map((entry) => (entry === id ? null : entry)))
              setDragging(null)
            }}
            className="mt-4 rounded-2xl border border-white/[0.07] bg-[#05060c]/50 p-3"
          >
            <p className="mb-2 text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase">
              Exercise library · drag from here
            </p>
            <div className="flex flex-wrap gap-2">
              {pool.map((token) => (
                <button
                  key={token.id}
                  type="button"
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('text/plain', token.id)
                    event.dataTransfer.effectAllowed = 'move'
                    setDragging(token.id)
                  }}
                  onDragEnd={() => setDragging(null)}
                  onClick={() => {
                    const empty = slots.findIndex((slot) => slot === null)
                    if (empty >= 0) place(empty, token.id)
                  }}
                  aria-label={`Add ${token.label}`}
                  className={`cursor-grab rounded-xl border px-3 py-2 text-[11px] font-bold text-white transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(139,92,246,0.8)] active:cursor-grabbing active:scale-95 focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:outline-none ${token.ring} bg-gradient-to-br ${token.tint} ${
                    dragging === token.id ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  {token.label}
                </button>
              ))}
              {pool.length === 0 && (
                <span className="py-2 text-[11px] text-slate-500">
                  Every token is placed — drag one back here to remove it.
                </span>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Tech matrix                                                                */
/* -------------------------------------------------------------------------- */

function TechMatrix() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [lit, setLit] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setLit(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setLit(true)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="stack" className="mx-auto max-w-6xl px-5 pb-20 sm:px-6 lg:pb-28">
      <Reveal>
        <div className="max-w-2xl">
          <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-300 uppercase">
            Tech matrix
          </span>
          <h2 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-4xl">
            One path from your thumb to the database.
          </h2>
        </div>
      </Reveal>

      <div ref={ref} className="mt-9 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-md sm:p-7">
        <div className="grid gap-4 lg:grid-cols-5">
          {STACK_NODES.map((node, index) => (
            <div
              key={node.name}
              className={`relative transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                lit ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div
                className={`h-full rounded-2xl border px-4 py-4 transition-all duration-500 ${
                  lit
                    ? 'border-white/[0.12] bg-[#070912]/80 shadow-[0_12px_40px_-18px_rgba(16,185,129,0.6)]'
                    : 'border-white/[0.06] bg-[#070912]/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-2 w-2 items-center justify-center rounded-full transition-colors duration-500 ${
                      lit ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span className="font-mono text-[9px] font-bold tracking-[0.18em] text-slate-500 uppercase">
                    Layer {index + 1}
                  </span>
                </div>
                <p className="mt-3 text-[13px] font-extrabold text-white">{node.name}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{node.detail}</p>
                <div
                  className={`mt-3 h-px w-full bg-gradient-to-r ${node.tone} transition-opacity duration-500`}
                  style={{ opacity: lit ? 0.9 : 0.15 }}
                />
              </div>

              {index < STACK_NODES.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 -right-2.5 hidden h-1.5 w-1.5 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-400 lg:flex"
                  style={{
                    boxShadow: lit ? '0 0 12px rgba(52,211,153,0.9)' : 'none',
                    transition: 'box-shadow 500ms ease',
                    transitionDelay: `${index * 150 + 200}ms`,
                  }}
                >
                  <span className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-400/60" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Join                                                                       */
/* -------------------------------------------------------------------------- */

function JoinPortal() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <section id="join" className="mx-auto max-w-6xl px-5 pb-24 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.10] bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent p-8 shadow-[0_40px_100px_-40px_rgba(225,29,72,0.6)] backdrop-blur-2xl sm:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-indigo-500/25 blur-[80px]"
          />
          <div className="relative mx-auto max-w-xl text-center">
            <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-4xl">
              Join before the first set.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              One email, one launch note. No newsletters, no drip campaign.
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                setSent(true)
              }}
              className="mt-7 flex flex-col gap-2 sm:flex-row"
            >
              <div className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur-[14px] transition-all focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.9"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2.5" />
                  <path d="m4 7 8 6 8-6" strokeLinecap="round" />
                </svg>
                <label htmlFor="portal-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="portal-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-500 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-14px_rgba(244,63,94,0.9)] active:scale-[0.98]"
              >
                {sent ? 'You are on the list' : 'Notify me'}
              </button>
            </form>

            <p className="mt-3 text-[10px] text-slate-500">
              Design demo: nothing is stored or sent.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-6">
        <p className="text-[11px] text-slate-500">RepForge — design demo B. Not the live page.</p>
        <div className="flex items-center gap-5">
          <Link href="/" className="text-[11px] font-semibold text-slate-400 transition-colors hover:text-white">
            Live site
          </Link>
          <Link href="/privacy" className="text-[11px] font-semibold text-slate-400 transition-colors hover:text-white">
            Privacy
          </Link>
          <Link href="/delete-account" className="text-[11px] font-semibold text-slate-400 transition-colors hover:text-white">
            Delete account
          </Link>
        </div>
      </div>
    </footer>
  )
}

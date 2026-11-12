'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Mesh } from '../_components/mesh'
import { Reveal } from '../_components/reveal'
import { playStoreUrl } from '../../../lib/links'

const APK_DOWNLOAD_URL =
  // The homepage sends every download to our own page rather than straight to
  // GitHub: that page carries the checksum, the install steps and the store
  // links, and it is where a click becomes a counted download.
  '/download'

/* -------------------------------------------------------------------------- */
/* Muscle map data                                                            */
/* -------------------------------------------------------------------------- */

type Group =
  | 'chest'
  | 'delts'
  | 'rear-delts'
  | 'triceps'
  | 'biceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'quads'
  | 'calves'
  | 'traps'
  | 'lats'
  | 'glutes'
  | 'hamstrings'

const GROUP_LABEL: Record<Group, string> = {
  chest: 'Pectorals',
  delts: 'Front delts',
  'rear-delts': 'Rear delts',
  triceps: 'Triceps',
  biceps: 'Biceps',
  forearms: 'Forearms',
  abs: 'Abs',
  obliques: 'Obliques',
  quads: 'Quads',
  calves: 'Calves',
  traps: 'Traps',
  lats: 'Lats',
  glutes: 'Glutes',
  hamstrings: 'Hamstrings',
}

type Zone = { fig: 'front' | 'back'; group: Group; pts: string }

const ZONES: Zone[] = [
  // Front
  { fig: 'front', group: 'chest', pts: '46,58 58,56 58,80 47,82' },
  { fig: 'front', group: 'chest', pts: '62,56 74,58 73,82 62,80' },
  { fig: 'front', group: 'delts', pts: '28,58 44,52 46,64 38,74 28,70' },
  { fig: 'front', group: 'delts', pts: '76,52 92,58 92,70 82,74 74,64' },
  { fig: 'front', group: 'biceps', pts: '30,76 40,72 41,92 32,96' },
  { fig: 'front', group: 'biceps', pts: '80,72 90,76 88,96 79,92' },
  { fig: 'front', group: 'forearms', pts: '26,100 34,96 38,120 31,124' },
  { fig: 'front', group: 'forearms', pts: '86,96 94,100 89,124 82,120' },
  { fig: 'front', group: 'abs', pts: '50,86 70,86 68,124 52,124' },
  { fig: 'front', group: 'obliques', pts: '42,86 49,88 50,122 43,118' },
  { fig: 'front', group: 'obliques', pts: '71,88 78,86 77,118 70,122' },
  { fig: 'front', group: 'quads', pts: '50,130 59,130 58,178 50,176' },
  { fig: 'front', group: 'quads', pts: '61,130 70,130 70,176 62,178' },
  { fig: 'front', group: 'calves', pts: '51,186 58,186 57,212 52,210' },
  { fig: 'front', group: 'calves', pts: '62,186 69,186 68,210 63,212' },

  // Back
  { fig: 'back', group: 'traps', pts: '46,52 74,52 70,66 50,66' },
  { fig: 'back', group: 'rear-delts', pts: '28,58 44,52 44,68 32,74' },
  { fig: 'back', group: 'rear-delts', pts: '76,52 92,58 88,74 76,68' },
  { fig: 'back', group: 'triceps', pts: '30,76 40,70 42,92 33,96' },
  { fig: 'back', group: 'triceps', pts: '78,70 90,76 87,96 78,92' },
  { fig: 'back', group: 'lats', pts: '46,68 58,66 56,98 46,94' },
  { fig: 'back', group: 'lats', pts: '62,66 74,68 74,94 64,98' },
  { fig: 'back', group: 'glutes', pts: '50,126 59,126 59,142 50,142' },
  { fig: 'back', group: 'glutes', pts: '61,126 70,126 70,142 62,142' },
  { fig: 'back', group: 'hamstrings', pts: '50,146 59,146 58,180 50,178' },
  { fig: 'back', group: 'hamstrings', pts: '61,146 70,146 70,178 62,180' },
  { fig: 'back', group: 'calves', pts: '51,186 58,186 57,212 52,210' },
  { fig: 'back', group: 'calves', pts: '62,186 69,186 68,210 63,212' },
]

const MOVES: { id: string; name: string; groups: Group[]; detail: string; cue: string }[] = [
  {
    id: 'bench',
    name: 'Bench Press',
    groups: ['chest', 'delts', 'triceps'],
    detail: '4 × 6–8 · 60 kg',
    cue: 'Elbows tucked at 45°, bar to the sternum, drive through the floor.',
  },
  {
    id: 'squat',
    name: 'Back Squat',
    groups: ['quads', 'glutes', 'abs'],
    detail: '4 × 5 · 100 kg',
    cue: 'Brace before you unrack. Knees track over toes, chest proud.',
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    groups: ['hamstrings', 'glutes', 'lats', 'traps'],
    detail: '3 × 5 · 140 kg',
    cue: 'Pull the slack out first. Bar stays against the shins.',
  },
  {
    id: 'ohp',
    name: 'Overhead Press',
    groups: ['delts', 'triceps', 'abs'],
    detail: '4 × 8 · 40 kg',
    cue: 'Squeeze glutes, ribs down, head through at the top.',
  },
  {
    id: 'row',
    name: 'Barbell Row',
    groups: ['lats', 'biceps', 'traps'],
    detail: '4 × 10 · 65 kg',
    cue: 'Hinge to 45°, pull to the belly button, no body English.',
  },
  {
    id: 'pullup',
    name: 'Pull-up',
    groups: ['lats', 'biceps', 'forearms'],
    detail: '3 × 8 · bodyweight',
    cue: 'Start from a dead hang, lead with the elbows, chin over the bar.',
  },
]

/* -------------------------------------------------------------------------- */
/* Routine velocity data                                                      */
/* -------------------------------------------------------------------------- */

const GOALS = [
  { id: 'strength', label: 'Strength', sets: 5, reps: '3–5', rest: 180, load: '85% 1RM' },
  { id: 'hypertrophy', label: 'Hypertrophy', sets: 4, reps: '8–12', rest: 90, load: '70% 1RM' },
  { id: 'endurance', label: 'Endurance', sets: 3, reps: '15–20', rest: 45, load: '55% 1RM' },
] as const

const BLOCK_NAMES = [
  'Primary lift',
  'Secondary compound',
  'Accessory',
  'Accessory',
  'Isolation',
  'Isolation',
  'Finisher',
  'Core',
  'Carry',
]

const LIFTS = [
  'Barbell Bench Press',
  'Back Squat',
  'Romanian Deadlift',
  'Incline Dumbbell Press',
  'Cable Row',
  'Lateral Raise',
  'Leg Press',
  'Hammer Curl',
  'Face Pull',
]

const TRACKS = [
  {
    id: 'deep',
    key: 'deep-focus',
    title: 'Deep Focus',
    subtitle: 'Low, steady, no vocals',
    bars: 18,
    hue: 'cyan',
  },
  {
    id: 'tempo',
    key: 'push-tempo',
    title: 'Push Tempo',
    subtitle: '128 BPM · sets and rests',
    bars: 22,
    hue: 'indigo',
  },
  {
    id: 'rest',
    key: 'rest-window',
    title: 'Rest Window',
    subtitle: '90 seconds of quiet',
    bars: 14,
    hue: 'rose',
  },
] as const

const FEATURES = [
  {
    title: 'Two-tap set logging',
    body: 'Weight and reps prefill from your last session. Tap to confirm, hold to edit — the set is saved before you rack the bar.',
    icon: 'bolt',
  },
  {
    title: 'Routine builder',
    body: 'Push/pull/legs, upper/lower or something entirely your own. Supersets, per-exercise notes and warmup flags included.',
    icon: 'layers',
  },
  {
    title: 'Automatic rest timers',
    body: 'The clock starts the moment you finish a set, with a cue that fires on time even if the screen is off.',
    icon: 'timer',
  },
  {
    title: 'PR detection',
    body: 'Rep, weight and estimated 1RM records are recognised automatically and surfaced on the exercise you actually lifted.',
    icon: 'trophy',
  },
  {
    title: 'Volume that makes sense',
    body: 'Weekly tonnage and hard sets per muscle group, not a single meaningless total on a dashboard.',
    icon: 'chart',
  },
  {
    title: 'Works offline',
    body: 'Basement gym, no signal. Every set is written locally first and reconciles the moment you are back online.',
    icon: 'cloud',
  },
]

const STACK = [
  { name: 'Android client', detail: 'Local-first store · offline queue', tone: 'from-slate-400 to-slate-500' },
  { name: 'Identity', detail: 'Supabase Auth · email + password', tone: 'from-cyan-400 to-sky-500' },
  { name: 'Postgres', detail: 'Row-level security per account', tone: 'from-emerald-400 to-teal-500' },
  { name: 'Object storage', detail: 'Avatars and routine exports', tone: 'from-indigo-400 to-violet-500' },
  { name: 'Release pipeline', detail: 'Signed APK · GitHub Releases', tone: 'from-rose-400 to-orange-500' },
]

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Rendered at /demo/a and, with `live`, as the homepage. `live` drops the demo
 * badge and the "not the live page" footer note, nothing else.
 */
export function DemoAView({ live = false }: { live?: boolean }) {
  return (
    <div className="relative">
      <Mesh />
      <Nav live={live} />
      <main>
        <Hero />
        <Velocity />
        <FocusAudio />
        <FeatureMatrix />
        <StackCommand />
        <JoinPortal />
      </main>
      <Footer live={live} />
    </div>
  )
}

export default function DemoAPage() {
  return <DemoAView />
}

/* -------------------------------------------------------------------------- */
/* Nav                                                                        */
/* -------------------------------------------------------------------------- */

function Nav({ live }: { live: boolean }) {
  const [open, setOpen] = useState(false)
  const links = [
    { label: 'Muscle hub', href: '#hub' },
    { label: 'Routine velocity', href: '#velocity' },
    { label: 'Focus', href: '#focus' },
    { label: 'Features', href: '#features' },
    { label: 'Under the hood', href: '#stack' },
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
          {live ? null : (
            <span className="ml-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] font-bold tracking-[0.16em] text-slate-400 uppercase">
              Demo A
            </span>
          )}
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded text-sm font-semibold text-slate-400 transition-colors duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:outline-none"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={APK_DOWNLOAD_URL}
            className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#05060c] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,255,255,0.18)] active:scale-95"
          >
            Download
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition-colors duration-200 hover:bg-white/[0.06] lg:hidden"
        >
          <svg width="16" height="12" viewBox="0 0 18 14" aria-hidden="true">
            <rect y="0" width="18" height="2" rx="1" fill="currentColor" />
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
          <a
            href={APK_DOWNLOAD_URL}
            className="mt-3 block rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-[#05060c]"
          >
            Download for Android
          </a>
          <a
            href={playStoreUrl('homepage')}
            className="mt-2 block rounded-xl border border-white/[0.12] px-4 py-3 text-center text-sm font-semibold text-slate-200"
          >
            Get it on Google Play
          </a>
        </div>
      )}
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/* Hero — Kinetic Muscle Strain Hub                                           */
/* -------------------------------------------------------------------------- */

function Hero() {
  const [selected, setSelected] = useState(MOVES[0].id)
  const [hovered, setHovered] = useState<string | null>(null)

  const activeId = hovered ?? selected
  const move = MOVES.find((m) => m.id === activeId) ?? MOVES[0]

  return (
    <section id="top" className="relative">
      <div className="mx-auto grid max-w-6xl items-start gap-14 px-5 pt-16 pb-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-24">
        <Reveal className="lg:pt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-bold tracking-[0.14em] text-slate-300 uppercase backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
            </span>
            Free · No ads · No account to start
          </span>

          <h1 className="mt-6 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">
              Every rep is evidence.
            </span>
            <br />
            <span className="bg-gradient-to-r from-rose-400 via-rose-500 to-indigo-400 bg-clip-text text-transparent">
              RepForge keeps the record.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">
            A strength log built around the way you actually train: build the routine once,
            log each set in two taps, and watch the numbers prove the work.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={APK_DOWNLOAD_URL}
              className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-7 py-4 text-base font-bold text-white shadow-[0_16px_40px_-12px_rgba(244,63,94,0.8)] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:-translate-y-1 hover:shadow-[0_22px_50px_-12px_rgba(244,63,94,0.9)] active:scale-[0.98]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.87 3.23a11.4 11.4 0 0 0-9.82 0L5.22 5.92a.38.38 0 1 0-.66.38L6.4 9.48A10.9 10.9 0 0 0 .9 18h22.2a10.9 10.9 0 0 0-5.5-8.52zM7 15.25a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2zm10 0a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2z" />
              </svg>
              Download for Android
            </a>
            <a
              href={playStoreUrl('homepage')}
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/[0.12] bg-white/[0.03] px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M3.6 2.4a1.5 1.5 0 0 0-.5 1.1v17a1.5 1.5 0 0 0 .5 1.1l9.2-9.6-9.2-9.6zm10.6 8.4 2.9-3-9.3-5.3a1.5 1.5 0 0 0-.3-.1l6.7 8.4zm0 2.4-6.7 8.4c.1 0 .2 0 .3-.1l9.3-5.3-2.9-3zm4.2-1.2 2.5 1.4c1 .6 1 1.9 0 2.4l-2.5 1.4-3.2-2.6 3.2-2.6z" />
              </svg>
              Get it on Google Play
            </a>
            <a
              href="#hub"
              className="inline-flex items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.03] px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07]"
            >
              Try the muscle hub
            </a>
          </div>

          <p className="mt-4 text-sm text-slate-400">
            <a
              href="/download"
              className="font-semibold text-rose-400 transition-colors hover:text-rose-300"
            >
              All download options
            </a>{' '}
            — Google Play, direct APK, AppGallery and the Amazon Appstore.
          </p>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-3">
            {[
              { k: '160', v: 'Exercises' },
              { k: '0', v: 'Ads or trackers' },
              { k: '7.0+', v: 'Android' },
            ].map((stat) => (
              <div
                key={stat.v}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-3 py-3 backdrop-blur-md"
              >
                <dt className="text-xl font-extrabold text-white">{stat.k}</dt>
                <dd className="mt-0.5 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  {stat.v}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* The hub itself */}
        <Reveal delay={120} className="lg:pt-2">
          <div
            id="hub"
            className="rounded-3xl border border-white/[0.09] bg-white/[0.03] p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-[0.18em] text-slate-400 uppercase">
                Kinetic muscle strain
              </p>
              <span className="flex items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold text-rose-300">
                <span className="h-1 w-1 rounded-full bg-rose-400" />
                Live map
              </span>
            </div>

            <div className="mt-4">
              <BodyMap active={move.groups} />
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5" aria-live="polite">
              {move.groups.map((group) => (
                <span
                  key={group}
                  className="animate-pop rounded-full border border-rose-400/25 bg-rose-500/10 px-2.5 py-1 text-[11px] font-bold text-rose-200"
                >
                  {GROUP_LABEL[group]}
                </span>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-white/[0.07] bg-[#05060c]/60 px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-bold text-white">{move.name}</p>
                <p className="font-mono text-xs font-bold text-slate-400">{move.detail}</p>
              </div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-slate-400">{move.cue}</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {MOVES.map((item) => {
                const on = item.id === activeId
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={item.id === selected}
                    onMouseEnter={() => setHovered(item.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(item.id)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setSelected(item.id)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-[11px] font-bold transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:outline-none ${
                      on
                        ? 'border-rose-400/40 bg-rose-500/12 text-white shadow-[0_0_28px_-6px_rgba(244,63,94,0.55)]'
                        : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function BodyMap({ active }: { active: Group[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(['front', 'back'] as const).map((fig) => (
        <div
          key={fig}
          className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[radial-gradient(ellipse_at_50%_20%,rgba(99,102,241,0.16),transparent_70%)] pt-7 pb-2"
        >
          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-[0.22em] text-slate-500 uppercase">
            {fig}
          </span>
          <svg viewBox="0 0 120 240" className="h-[250px] w-full" role="img" aria-label={`${fig} view muscle map`}>
            <g fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.09)" strokeWidth="1">
              <ellipse cx="60" cy="20" rx="13" ry="16" />
              <rect x="55" y="33" width="10" height="7" rx="3" />
              <polygon points="46,124 74,124 71,138 49,138" />
              <polygon points="50,178 58,178 58,188 50,188" />
              <polygon points="62,178 70,178 70,188 62,188" />
              <ellipse cx="52" cy="228" rx="8" ry="4" />
              <ellipse cx="68" cy="228" rx="8" ry="4" />
            </g>

            {ZONES.filter((zone) => zone.fig === fig).map((zone) => {
              const on = active.includes(zone.group)
              return (
                <polygon
                  key={`${zone.fig}-${zone.pts}`}
                  points={zone.pts}
                  strokeWidth="1"
                  className={`transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                    on
                      ? 'animate-none fill-[#f43f5e] stroke-[#fecdd3] drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]'
                      : 'fill-white/[0.07] stroke-white/10'
                  }`}
                />
              )
            })}
          </svg>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Routine velocity                                                           */
/* -------------------------------------------------------------------------- */

function Velocity() {
  const [goal, setGoal] = useState<(typeof GOALS)[number]['id']>('hypertrophy')
  const [days, setDays] = useState(4)
  const [length, setLength] = useState(60)

  const plan = useMemo(() => {
    const selected = GOALS.find((g) => g.id === goal) ?? GOALS[1]
    const midReps = selected.id === 'strength' ? 4 : selected.id === 'hypertrophy' ? 10 : 17
    const perExercise = selected.sets * (midReps * 3 + selected.rest) + 75
    const exercises = Math.min(9, Math.max(4, Math.round((length * 60) / perExercise)))

    return {
      selected,
      exercises,
      totalSets: exercises * selected.sets,
      weeklySets: exercises * selected.sets * days,
      weeklyMinutes: length * days,
      rest: `${Math.floor(selected.rest / 60)}:${String(selected.rest % 60).padStart(2, '0')}`,
    }
  }, [goal, days, length])

  const signature = `${goal}-${days}-${length}`

  return (
    <section id="velocity" className="relative mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-28">
      <Reveal>
        <div className="max-w-2xl">
          <span className="text-[11px] font-bold tracking-[0.2em] text-cyan-300 uppercase">
            Routine velocity
          </span>
          <h2 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-4xl">
            Choose the goal. Watch the session build itself.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Sets, reps, rest and exercise count are not independent numbers — move one and the
            others should follow. This is the same engine that generates a routine in the app.
          </p>
        </div>
      </Reveal>

      <Reveal delay={140} className="mt-10">
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Controls */}
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl">
            <ControlGroup label="Primary goal">
              {GOALS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setGoal(option.id)}
                  aria-pressed={goal === option.id}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:outline-none active:scale-95 ${
                    goal === option.id
                      ? 'bg-white text-[#05060c] shadow-[0_8px_24px_-8px_rgba(255,255,255,0.5)]'
                      : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </ControlGroup>

            <ControlGroup label="Training days / week">
              {[3, 4, 5].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDays(option)}
                  aria-pressed={days === option}
                  className={`h-10 w-10 rounded-xl text-sm font-bold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:outline-none active:scale-95 ${
                    days === option
                      ? 'bg-white text-[#05060c]'
                      : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  {option}
                </button>
              ))}
            </ControlGroup>

            <ControlGroup label="Session length">
              {[45, 60, 90].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLength(option)}
                  aria-pressed={length === option}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:outline-none active:scale-95 ${
                    length === option
                      ? 'bg-white text-[#05060c]'
                      : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  {option} min
                </button>
              ))}
            </ControlGroup>

            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-5">
              <Metric label="Working sets" value={String(plan.totalSets)} tone="text-cyan-300" />
              <Metric label="Weekly sets" value={String(plan.weeklySets)} tone="text-indigo-300" />
              <Metric label="Rest interval" value={plan.rest} tone="text-rose-300" mono />
              <Metric label="Load target" value={plan.selected.load} tone="text-emerald-300" mono />
            </div>
          </div>

          {/* Cascading stack */}
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#070912]/70 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-[0.18em] text-slate-400 uppercase">
                Generated session
              </p>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] font-bold text-slate-300">
                {length}:00 cap · {plan.selected.label}
              </span>
            </div>

            <ol className="mt-4 space-y-2">
              {Array.from({ length: plan.exercises }).map((_, index) => (
                <li
                  key={`${signature}-${index}`}
                  className="flex animate-cascade items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5"
                  style={{ animationDelay: `${index * 55}ms` }}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] font-mono text-[10px] font-bold text-slate-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold text-white">
                      {LIFTS[index % LIFTS.length]}
                    </span>
                    <span className="block text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
                      {BLOCK_NAMES[index % BLOCK_NAMES.length]}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-mono text-[12px] font-bold text-cyan-300">
                      {plan.selected.sets} × {plan.selected.reps}
                    </span>
                    <span className="block font-mono text-[10px] text-slate-500">
                      rest {plan.rest}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-500/[0.07] px-4 py-3">
              <span className="text-[11px] font-bold tracking-wide text-cyan-200 uppercase">
                Weekly time under the bar
              </span>
              <span className="font-mono text-sm font-extrabold text-white">
                {Math.floor(plan.weeklyMinutes / 60)}h {plan.weeklyMinutes % 60}m
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 first:mt-0">
      <p className="mb-2 text-[10px] font-bold tracking-[0.18em] text-slate-500 uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function Metric({
  label,
  value,
  tone,
  mono = false,
}: {
  label: string
  value: string
  tone: string
  mono?: boolean
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
      <p className="text-[9px] font-bold tracking-[0.16em] text-slate-500 uppercase">{label}</p>
      <p className={`mt-0.5 text-lg font-extrabold ${tone} ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Focus audio                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Looping beds served from /public/audio. The files are generated by
 * scripts/make-focus-loops.mjs, where every partial completes a whole number of
 * cycles inside the loop — so the last sample runs back into the first with no
 * click and no gap, and the build ships no licensed audio.
 */
const focusTracks: Record<string, string> = {
  'deep-focus': '/audio/deep-focus.wav',
  'push-tempo': '/audio/push-tempo.wav',
  'rest-window': '/audio/rest-window.wav',
}

const FOCUS_VOLUME = 0.35

/** The one stream allowed to be audible at any moment. */
let activeAudioInstance: HTMLAudioElement | null = null
let focusVolume = FOCUS_VOLUME

type FocusListener = (key: string | null) => void
const focusListeners = new Set<FocusListener>()

function emitFocus(key: string | null) {
  focusListeners.forEach((listener) => listener(key))
}

/** Tears down whatever is playing and reports the silence back to the UI. */
function stopFocusAsset() {
  const instance = activeAudioInstance
  activeAudioInstance = null

  if (instance) {
    instance.onerror = null
    try {
      instance.pause()
      instance.currentTime = 0
    } catch {
      /* not loaded yet — nothing to rewind */
    }
  }

  emitFocus(null)
}

/**
 * Plays one loop. Any previous stream is stopped first, so two cards can never
 * overlap no matter how fast the pointer moves across them.
 */
function playFocusAsset(trackKey: string) {
  stopFocusAsset()

  const sourceUrl = focusTracks[trackKey]
  if (!sourceUrl) return

  const audio = new Audio(sourceUrl)
  audio.loop = true
  audio.preload = 'auto'
  audio.volume = focusVolume
  activeAudioInstance = audio

  const attempt = audio.play()
  if (attempt && typeof attempt.catch === 'function') {
    attempt.catch((error: unknown) => {
      // Hovering is not a user gesture, so a visitor's very first hover can be
      // refused by the autoplay policy. Stay quiet instead of throwing; the next
      // click is a gesture and will start the same loop normally.
      if (activeAudioInstance === audio) {
        activeAudioInstance = null
        emitFocus(null)
      }
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[focus-audio] playback blocked:', (error as Error)?.name)
      }
    })
  }

  emitFocus(trackKey)
}

function FocusAudio() {
  // Hover auditions a loop; a click pins it so touch visitors get the same audio.
  const [pinned, setPinned] = useState<string | null>(null)
  const [playingKey, setPlayingKey] = useState<string | null>(null)
  const [muted, setMuted] = useState(false)

  // The controller lives above the component (one stream per page), so the UI
  // subscribes to it rather than owning the element.
  useEffect(() => {
    const listener: FocusListener = (key) => setPlayingKey(key)
    focusListeners.add(listener)
    return () => {
      focusListeners.delete(listener)
    }
  }, [])

  // Mute keeps the loop running at zero gain, so unmuting resumes mid-phrase.
  useEffect(() => {
    focusVolume = muted ? 0 : FOCUS_VOLUME
    if (activeAudioInstance) activeAudioInstance.volume = focusVolume
  }, [muted])

  // Leaving this route must never leave a loop playing in the background.
  useEffect(() => stopFocusAsset, [])

  return (
    <section id="focus" className="mx-auto max-w-6xl px-5 pb-20 sm:px-6 lg:pb-28">
      <Reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold tracking-[0.2em] text-rose-300 uppercase">
              Focus mode
            </span>
            <h2 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-4xl">
              A quiet room, a loud set.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Session audio that stays out of the way: no vocals, no ads cutting in between
              sets. Hover a tile to hear its loop, or click to pin it for the whole session.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-cyan-200 uppercase">
              Generated loops
            </span>
            <button
              type="button"
              onClick={() => setMuted((value) => !value)}
              aria-pressed={muted}
              aria-label={muted ? 'Unmute focus audio' : 'Mute focus audio'}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-slate-300 uppercase transition-colors duration-200 hover:border-white/25 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:outline-none"
            >
              {muted ? 'Unmute' : 'Mute'}
            </button>
          </div>
        </div>
      </Reveal>

      <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-3">
        {TRACKS.map((track, index) => {
          const active = playingKey === track.key
          const isPinned = pinned === track.id
          return (
            <Reveal key={track.id} delay={index * 90}>
              <button
                type="button"
                onMouseEnter={() => playFocusAsset(track.key)}
                onMouseLeave={stopFocusAsset}
                onFocus={(event) => {
                  // Keyboard only: a mouse click focuses the button too, and
                  // restarting the loop there would truncate the first note.
                  if (event.currentTarget.matches(':focus-visible')) playFocusAsset(track.key)
                }}
                onBlur={stopFocusAsset}
                onClick={() => {
                  if (isPinned) {
                    setPinned(null)
                    stopFocusAsset()
                    return
                  }
                  setPinned(track.id)
                  if (playingKey !== track.key) playFocusAsset(track.key)
                }}
                aria-pressed={isPinned}
                className="group flex h-full w-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:-translate-y-1 hover:border-cyan-500/30 hover:bg-white/[0.05] hover:shadow-[0_20px_50px_-20px_rgba(6,182,212,0.55)] focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:outline-none"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white transition-colors duration-300 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/15">
                    <svg width="11" height="12" viewBox="0 0 12 13" aria-hidden="true" fill="currentColor">
                      <path d="M1 1.2v10.6c0 .5.55.8.97.55l8.6-5.3a.64.64 0 0 0 0-1.1l-8.6-5.3A.64.64 0 0 0 1 1.2z" />
                    </svg>
                  </span>
                  <span className="font-mono text-[10px] font-bold tracking-wide text-slate-500 uppercase">
                    {playingKey === track.key ? (muted ? 'Muted' : 'Playing') : 'Preview'}
                  </span>
                </div>

                {/* Wave bars */}
                <div className="mt-6 flex h-16 items-end">
                  {Array.from({ length: track.bars }).map((_, bar) => (
                    <span
                      key={bar}
                      className="mx-[2px] w-1 origin-bottom animate-wave rounded-t-md bg-gradient-to-t from-cyan-400 to-indigo-500 [animation-play-state:paused] motion-reduce:animate-none group-hover:[animation-play-state:running] group-focus-visible:[animation-play-state:running]"
                      style={{
                        height: `${22 + ((bar * 37) % 42)}px`,
                        animationDelay: `${bar * 65}ms`,
                        animationDuration: `${700 + (bar % 5) * 130}ms`,
                        animationPlayState: active ? 'running' : undefined,
                      }}
                    />
                  ))}
                </div>

                <p className="mt-5 text-sm font-bold text-white">{track.title}</p>
                <p className="mt-1 text-[12px] text-slate-400">{track.subtitle}</p>
              </button>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Feature matrix                                                             */
/* -------------------------------------------------------------------------- */

function FeatureMatrix() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 pb-20 sm:px-6 lg:pb-28">
      <Reveal>
        <div className="max-w-2xl">
          <span className="text-[11px] font-bold tracking-[0.2em] text-indigo-300 uppercase">
            The system
          </span>
          <h2 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-4xl">
            Small details, repeated 20,000 times.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            A tracker only works if logging is faster than not logging. Every one of these exists
            to remove a tap from your session.
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 70}>
            <article className="group h-full rounded-2xl border border-white/[0.10] bg-white/[0.04] p-6 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:-translate-y-1 hover:scale-[1.02] hover:border-cyan-500/20 hover:bg-white/[0.06] hover:shadow-[0_10px_30px_rgba(6,182,212,0.15)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] text-cyan-300 transition-colors duration-300 group-hover:text-cyan-200">
                <FeatureIcon kind={feature.icon} />
              </span>
              <h3 className="mt-4 text-base font-extrabold tracking-tight text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{feature.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function FeatureIcon({ kind }: { kind: string }) {
  const common = {
    width: 17,
    height: 17,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (kind) {
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
        </svg>
      )
    case 'layers':
      return (
        <svg {...common}>
          <path d="m12 3 9 5-9 5-9-5 9-5z" />
          <path d="m3 13 9 5 9-5" />
        </svg>
      )
    case 'timer':
      return (
        <svg {...common}>
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2.5M9 2h6" />
        </svg>
      )
    case 'trophy':
      return (
        <svg {...common}>
          <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
          <path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3M10 17h4M9 21h6" />
        </svg>
      )
    case 'chart':
      return (
        <svg {...common}>
          <path d="M4 19V5M4 19h16" />
          <path d="M8 15l4-5 3 3 4-6" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <path d="M6 18a4 4 0 0 1 .5-8 5.5 5.5 0 0 1 10.4 1.2A3.4 3.4 0 0 1 17 18H6z" />
          <path d="M12 12v5M9.5 14.5 12 17l2.5-2.5" />
        </svg>
      )
  }
}

/* -------------------------------------------------------------------------- */
/* Stack                                                                      */
/* -------------------------------------------------------------------------- */

function StackCommand() {
  return (
    <section id="stack" className="mx-auto max-w-6xl px-5 pb-20 sm:px-6 lg:pb-28">
      <Reveal>
        <div className="max-w-2xl">
          <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-300 uppercase">
            Under the hood
          </span>
          <h2 className="mt-3 text-3xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-4xl">
            Your data, in one accountable path.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Nothing fancy for its own sake. A local-first client, an authenticated API and a
            Postgres row that only your account can read.
          </p>
        </div>
      </Reveal>

      <Reveal delay={120} className="mt-10">
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-md sm:p-7">
          <div className="grid gap-3 lg:grid-cols-5">
            {STACK.map((node, index) => (
              <div key={node.name} className="relative">
                <div className="relative h-full rounded-2xl border border-white/[0.08] bg-[#070912]/70 px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20">
                  <span
                    className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${node.tone} text-[10px] font-extrabold text-[#05060c]`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[13px] font-extrabold text-white">{node.name}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{node.detail}</p>
                </div>

                {/* Connection node with a glowing centre mark. */}
                {index < STACK.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 -right-2 hidden h-2 w-2 -translate-y-1/2 items-center justify-center rounded-full after:absolute after:h-2 after:w-2 after:animate-ping after:rounded-full after:bg-emerald-400 lg:flex"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.07] pt-4">
            {['Row-level security', 'No ad SDK', 'No analytics SDK', 'Export or delete anytime'].map(
              (item) => (
                <span key={item} className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Join                                                                       */
/* -------------------------------------------------------------------------- */

function JoinPortal() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'done'>('idle')

  return (
    <section id="join" className="mx-auto max-w-6xl px-5 pb-24 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.10] bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent p-8 shadow-[0_40px_100px_-40px_rgba(99,102,241,0.7)] backdrop-blur-2xl sm:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-rose-500/25 blur-[80px]"
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-balance text-white sm:text-4xl">
                Start with one logged set.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300">
                Free on Android, no account needed to begin, and your first routine is ready in
                under a minute.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={APK_DOWNLOAD_URL}
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-[#05060c] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-14px_rgba(255,255,255,0.55)] active:scale-[0.98]"
                >
                  Download the APK
                </a>
                <a
                  href="#hub"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/[0.14] px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/[0.06]"
                >
                  Explore the hub
                </a>
              </div>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                setState('done')
              }}
              className="rounded-2xl border border-white/[0.10] bg-white/[0.03] p-5 backdrop-blur-xl"
            >
              <label htmlFor="join-email" className="text-[11px] font-bold tracking-[0.16em] text-slate-400 uppercase">
                iOS waitlist
              </label>
              <div className="mt-2 flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 transition-all focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#94a3b8" strokeWidth="1.9">
                  <rect x="3" y="5" width="18" height="14" rx="2.5" />
                  <path d="m4 7 8 6 8-6" strokeLinecap="round" />
                </svg>
                <input
                  id="join-email"
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
                className="mt-3 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-rose-500 px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-12px_rgba(129,90,246,0.85)] active:scale-[0.99]"
              >
                {state === 'done' ? 'Got it — thank you' : 'Join the list'}
              </button>
              <p className="mt-2.5 text-[10px] leading-relaxed text-slate-500">
                Design demo: this form stores nothing and sends nothing.
              </p>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

function Footer({ live }: { live: boolean }) {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-6">
        <p className="text-[11px] text-slate-500">
          {live
            ? 'RepForge — free workout tracker. No ads, no trackers.'
            : 'RepForge — design demo A. Not the live page.'}
        </p>
        <div className="flex items-center gap-5">
          {live ? null : (
            <Link href="/" className="text-[11px] font-semibold text-slate-400 transition-colors hover:text-white">
              Live site
            </Link>
          )}
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

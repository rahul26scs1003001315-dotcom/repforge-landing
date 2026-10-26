'use client'

import React, { useState } from 'react'
import Link from 'next/link'

/* ===========================================================================
 * CONFIG — paste your store links here.
 * ---------------------------------------------------------------------------
 * Every "Download for Android" call to action points at APK_DOWNLOAD_URL.
 * Leave APP_STORE_URL / GOOGLE_PLAY_URL as empty strings and the badge renders
 * in a "coming soon" state; fill them in and the badge becomes a live link.
 * =========================================================================== */

const APK_DOWNLOAD_URL =
  'https://github.com/rahul26scs1003001315-dotcom/repforge-releases/releases/latest/download/repforge.apk'

const APP_STORE_URL = '' // TODO: paste your App Store link, e.g. https://apps.apple.com/app/id000000000
const GOOGLE_PLAY_URL = '' // TODO: paste your Google Play link, e.g. https://play.google.com/store/apps/details?id=com.rahul_00.repforge

/* ========================================================================= */

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'Guides', href: '#guides' },
  { label: 'About', href: '#about' },
]

const PRESS = ['MEN\u2019S HEALTH', 'RUNNER\u2019S WORLD', 'BARBEND', 'SELF', 'WOMEN\u2019S HEALTH']

const LOG_BENEFITS = [
  {
    title: 'Intuitive Logging',
    body: 'Log a set in two taps. Weight and reps prefill from last time so you never break rhythm.',
  },
  {
    title: 'Advanced Routine Planner',
    body: 'Build push/pull/legs, upper/lower or your own split, with supersets and per-exercise notes.',
  },
  {
    title: 'Automatic Rest Timers',
    body: 'Rest starts the moment you finish a set, with a gentle nudge when it is time to work again.',
  },
]

const PROGRESS_BENEFITS = [
  {
    title: 'Personal Records, Tracked',
    body: 'Rep, weight and estimated 1RM PRs are detected automatically and celebrated in your feed.',
  },
  {
    title: 'Beautiful Volume Charts',
    body: 'See tonnage, sets and frequency climb week over week for every muscle group.',
  },
  {
    title: 'Full Exercise History',
    body: 'Every set you have ever done for a lift, in one scannable table. Compare any two sessions.',
  },
]

const SOCIAL_BENEFITS = [
  {
    title: 'Follow Friends',
    body: 'A live feed of your gym crew\u2019s sessions, so showing up is the easy part.',
  },
  {
    title: 'Motivate Each Other',
    body: 'Drop a comment or a fire reaction on a big lift and keep each other accountable.',
  },
  {
    title: 'Clone Any Routine',
    body: 'One tap copies a friend\u2019s plan into your library, ready to log tomorrow.',
  },
]

type Exercise = {
  name: string
  detail: string
  done: boolean
  warmup?: boolean
}

const WORKOUT: Exercise[] = [
  { name: 'Barbell Bench Press', detail: '3 \u00d7 8 \u00b7 60 kg', done: true, warmup: true },
  { name: 'Incline Dumbbell Press', detail: '3 \u00d7 10 \u00b7 22.5 kg', done: true },
  { name: 'Cable Fly', detail: '3 \u00d7 12 \u00b7 15 kg', done: false },
  { name: 'Overhead Triceps Extension', detail: '\u2014', done: false },
]

const CHART_TABS = [
  { id: 'bench', label: 'Bench Press', color: '#ff5c39', unit: 'kg', values: [52, 55, 58, 57, 62, 66, 70, 74] },
  { id: 'squat', label: 'Back Squat', color: '#2f6bff', unit: 'kg', values: [70, 75, 78, 82, 85, 90, 95, 102] },
  { id: 'deadlift', label: 'Deadlift', color: '#00c48c', unit: 'kg', values: [90, 95, 100, 105, 112, 118, 125, 132] },
]

const FEED = [
  {
    initials: 'PS',
    name: 'Priya S.',
    tone: 'bg-sky-soft text-sky',
    when: '2h ago',
    title: 'Push Day A',
    summary: 'Finished in 54 min \u00b7 14 sets \u00b7 6,240 kg volume',
    note: 'Bench PR! \ud83d\udd25',
    reaction: '12',
  },
  {
    initials: 'AR',
    name: 'Arjun R.',
    tone: 'bg-mint-soft text-mint',
    when: 'Yesterday',
    title: 'Leg Day',
    summary: 'Squat 5 \u00d7 5 @ 102 kg',
    note: 'Depth looked great on video',
    reaction: '9',
  },
]

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeChart, setActiveChart] = useState(CHART_TABS[0].id)

  return (
    <div className="min-h-screen bg-white text-ink font-sans">
      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Hero />
      <SocialProof />
      <LogWorkouts />
      <MeasureProgress activeChart={activeChart} setActiveChart={setActiveChart} />
      <Community />
      <Wearables />
      <FinalCta />
      <Footer />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

function Nav({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <a href="#top" className="flex items-center gap-2">
          <LogoMark />
          <span className="text-lg font-extrabold tracking-tight">RepForge</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm font-semibold text-slate-soft transition-colors duration-200 hover:text-brand"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#log-in"
            className="rounded-full px-4 py-2 text-sm font-semibold text-ink transition-colors duration-200 hover:text-brand"
          >
            Log In
          </a>
          <a
            href="#sign-up"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg"
          >
            Sign Up
          </a>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline transition-colors hover:bg-wash md:hidden"
        >
          <span className="sr-only">Menu</span>
          <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
            <rect y="0" width="18" height="2" rx="1" fill="currentColor" />
            <rect y="6" width="18" height="2" rx="1" fill="currentColor" />
            <rect y="12" width="18" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-hairline bg-white px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-soft hover:bg-wash"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-3">
            <a
              href="#log-in"
              onClick={() => setMenuOpen(false)}
              className="flex-1 rounded-full border border-hairline px-4 py-2.5 text-center text-sm font-semibold"
            >
              Log In
            </a>
            <a
              href="#sign-up"
              onClick={() => setMenuOpen(false)}
              className="flex-1 rounded-full bg-brand px-4 py-2.5 text-center text-sm font-bold text-white"
            >
              Sign Up
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

function LogoMark() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
      <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Soft colour washes keep the page bright but energetic. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-soft blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-40 -left-32 h-80 w-80 rounded-full bg-sky-soft blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pt-14 pb-20 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:pt-20">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-xs font-bold tracking-wide text-brand uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-brand" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            Free forever
          </span>

          <h1 className="mt-5 text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Log Workouts.
            <br />
            Get Stronger.
            <br />
            <span className="text-brand">Stay Motivated.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            RepForge is the free workout tracker for building routines, logging every set and
            watching your progress climb &mdash; with your friends right there beside you.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={APK_DOWNLOAD_URL}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-brand px-7 py-4 text-base font-bold text-white shadow-lg shadow-brand/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/30"
            >
              <AndroidIcon />
              Download for Android
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                &rarr;
              </span>
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-hairline px-7 py-4 text-base font-semibold text-ink transition-colors duration-200 hover:bg-wash"
            >
              See how it works
            </a>
          </div>

          <p className="mt-3 text-xs text-muted">
            Android 7.0+ &middot; 72 MB APK &middot; No account required to start
          </p>

          <StoreBadges className="mt-8" />
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <PhoneMockup />
          <WatchMockup />
        </div>
      </div>
    </section>
  )
}

function AndroidIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.87 3.23a11.4 11.4 0 0 0-9.82 0L5.22 5.92a.38.38 0 1 0-.66.38L6.4 9.48A10.9 10.9 0 0 0 .9 18h22.2a10.9 10.9 0 0 0-5.5-8.52zM7 15.25a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2zm10 0a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M16.36 12.78c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.61-1.7-3.18-1.73-1.35-.14-2.64.79-3.33.79-.69 0-1.75-.77-2.87-.75-1.48.02-2.84.86-3.6 2.18-1.54 2.67-.39 6.62 1.1 8.79.73 1.06 1.6 2.25 2.74 2.2 1.1-.04 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.08 2.65-2.14.83-1.22 1.18-2.41 1.2-2.47-.03-.01-2.29-.88-2.31-3.5zM14.2 6.3c.6-.73 1.01-1.74.9-2.75-.87.04-1.92.58-2.55 1.3-.56.64-1.05 1.68-.92 2.67.97.08 1.96-.49 2.57-1.22z" />
    </svg>
  )
}

function StoreBadges({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <StoreBadge
        href={APP_STORE_URL}
        icon={<AppleIcon />}
        small="Download on the"
        big="App Store"
      />
      <StoreBadge
        href={GOOGLE_PLAY_URL}
        icon={<PlayIcon />}
        small="Get it on"
        big="Google Play"
      />
    </div>
  )
}

function StoreBadge({
  href,
  icon,
  small,
  big,
}: {
  href: string
  icon: React.ReactNode
  small: string
  big: string
}) {
  const live = href.trim().length > 0
  const className =
    'flex items-center gap-2.5 rounded-xl border border-hairline px-4 py-2.5 transition-all duration-200 ' +
    (live ? 'hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-md' : 'opacity-60')

  const inner = (
    <>
      <span className="text-ink">{icon}</span>
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] font-medium tracking-wide text-muted uppercase">{small}</span>
        <span className="text-sm font-bold text-ink">{big}</span>
      </span>
      {!live && (
        <span className="ml-1 rounded-full bg-wash px-2 py-0.5 text-[10px] font-bold tracking-wide text-muted uppercase">
          Soon
        </span>
      )}
    </>
  )

  if (!live) {
    return (
      <span className={className} aria-label={`${big} — coming soon`} title="Coming soon">
        {inner}
      </span>
    )
  }

  return (
    <a href={href} className={className} rel="noopener noreferrer" target="_blank">
      {inner}
    </a>
  )
}

function PlayIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.6 2.3a1 1 0 0 0-.5.87v17.66a1 1 0 0 0 .5.87l9.6-9.7-9.6-9.7z" fill="#2f6bff" />
      <path d="M16.8 8.2 4.5 1.5l8.7 8.8 3.6-2.1z" fill="#00c48c" />
      <path d="M16.8 15.8 13.2 13.7l-8.7 8.8 12.3-6.7z" fill="#ff5c39" />
      <path d="M20.4 10.7 16.8 8.2 13.2 11.7l3.6 3.5 3.6-2.1a1.5 1.5 0 0 0 0-2.4z" fill="#ffb800" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Device mockups (pure CSS/SVG - no external images to load)                   */
/* -------------------------------------------------------------------------- */

function PhoneMockup() {
  return (
    <div className="relative z-10 w-[288px] rounded-[2.6rem] border-[10px] border-ink bg-ink shadow-2xl shadow-ink/25 sm:w-[310px]">
      <div className="absolute top-[10px] left-1/2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-ink" />
      <div className="overflow-hidden rounded-[2rem] bg-white">
        {/* status bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2 text-[10px] font-semibold text-muted">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            Live
          </span>
        </div>

        {/* header */}
        <div className="px-5 pt-1 pb-4">
          <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">Workout</p>
          <div className="mt-0.5 flex items-center justify-between">
            <h3 className="text-lg font-extrabold tracking-tight">Push Day A</h3>
            <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-bold text-brand">
              54:12
            </span>
          </div>
        </div>

        {/* exercise rows */}
        <div className="space-y-2 px-4 pb-3">
          {WORKOUT.map((ex) => (
            <div
              key={ex.name}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                ex.done ? 'border-mint/25 bg-mint-soft' : 'border-hairline bg-white'
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  ex.done ? 'bg-mint text-white' : 'border border-hairline bg-wash'
                }`}
              >
                {ex.done && (
                  <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M20 6 9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="3.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-bold text-ink">{ex.name}</span>
                <span className="block text-[11px] text-muted">
                  {ex.detail}
                  {ex.warmup && <span className="ml-1.5 font-semibold text-sky">Warmup</span>}
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* rest timer */}
        <div className="mx-4 mb-3 flex items-center justify-between rounded-xl bg-sky-soft px-3.5 py-2.5">
          <span className="text-[11px] font-bold text-sky">Rest timer</span>
          <span className="font-mono text-[13px] font-bold text-sky">01:30</span>
        </div>

        {/* footer button */}
        <div className="px-4 pb-5">
          <div className="rounded-full bg-brand py-3 text-center text-[13px] font-bold text-white">
            Finish workout
          </div>
        </div>
      </div>
    </div>
  )
}

function WatchMockup() {
  return (
    <div className="absolute -right-1 bottom-2 z-20 hidden w-[122px] rounded-[1.6rem] border-[7px] border-ink bg-ink shadow-xl shadow-ink/25 sm:block lg:-right-6">
      <div className="flex flex-col items-center rounded-[1.2rem] bg-ink px-3 py-3.5 text-white">
        <span className="text-[9px] font-semibold tracking-wide text-white/50 uppercase">
          Bench Press
        </span>
        <span className="mt-0.5 text-[15px] font-extrabold">
          60 <span className="text-[10px] font-semibold text-white/60">kg</span>
        </span>

        <div className="relative my-2 flex h-[62px] w-[62px] items-center justify-center">
          <svg width="62" height="62" viewBox="0 0 62 62" aria-hidden="true">
            <circle cx="31" cy="31" r="26" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="6" />
            <circle
              cx="31"
              cy="31"
              r="26"
              fill="none"
              stroke="#00c48c"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="163"
              strokeDashoffset="49"
              transform="rotate(-90 31 31)"
            />
          </svg>
          <span className="absolute text-[13px] font-extrabold">8</span>
        </div>

        <span className="text-[9px] font-semibold text-mint">&times; 3 sets done</span>
        <span className="mt-2 flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-bold">
          <HeartIcon />
          132 bpm
        </span>
      </div>
    </div>
  )
}

function HeartIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" aria-hidden="true" fill="#ff5c39">
      <path d="M12 21s-8-5.1-8-10.4A4.6 4.6 0 0 1 12 7.6 4.6 4.6 0 0 1 20 10.6C20 15.9 12 21 12 21z" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Social proof                                                                */
/* -------------------------------------------------------------------------- */

function SocialProof() {
  return (
    <section className="border-y border-hairline bg-wash">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-7 px-5 py-9 sm:px-6 lg:flex-row lg:justify-between">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
          <Stars />
          <p className="text-center text-sm font-semibold text-ink sm:text-left">
            4.9/5 stars from <span className="text-brand">500,000+</span> athletes
          </p>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {PRESS.map((name) => (
            <li
              key={name}
              className="text-[11px] font-extrabold tracking-[0.14em] text-muted/70 uppercase transition-colors duration-200 hover:text-ink"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Stars() {
  return (
    <span className="flex items-center gap-0.5" aria-label="Rated 4.9 out of 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="m12 2.6 2.9 5.9 6.5.95-4.7 4.6 1.1 6.5-5.8-3.05L6.2 20.5l1.1-6.5-4.7-4.6 6.5-.95L12 2.6z"
            fill="#ffb800"
          />
        </svg>
      ))}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Feature section shell                                                       */
/* -------------------------------------------------------------------------- */

function FeatureShell({
  id,
  eyebrow,
  eyebrowTone,
  title,
  body,
  benefits,
  media,
  reverse = false,
}: {
  id: string
  eyebrow: string
  eyebrowTone: 'brand' | 'sky' | 'mint'
  title: string
  body: string
  benefits: { title: string; body: string }[]
  media: React.ReactNode
  reverse?: boolean
}) {
  const tone = {
    brand: { chip: 'bg-brand-soft text-brand', dot: 'bg-brand' },
    sky: { chip: 'bg-sky-soft text-sky', dot: 'bg-sky' },
    mint: { chip: 'bg-mint-soft text-mint', dot: 'bg-mint' },
  }[eyebrowTone]

  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:py-24">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div className={reverse ? 'lg:order-2' : ''}>
          <span
            className={`inline-block rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide uppercase ${tone.chip}`}
          >
            {eyebrow}
          </span>
          <h2 className="mt-4 text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">{body}</p>

          <ul className="mt-8 space-y-5">
            {benefits.map((b) => (
              <li key={b.title} className="flex gap-4">
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${tone.dot} text-white`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M20 6 9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="3.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </span>
                <span>
                  <span className="block text-[15px] font-bold text-ink">{b.title}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-muted">{b.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={reverse ? 'lg:order-1' : ''}>{media}</div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* 1. Log workouts                                                             */
/* -------------------------------------------------------------------------- */

function LogWorkouts() {
  return (
    <FeatureShell
      id="product"
      eyebrow="Log workouts"
      eyebrowTone="brand"
      title="A routine builder that keeps up with your workout"
      body="Stop scribbling sets in your notes app. RepForge puts the whole session on one screen so you can focus on the bar, not the admin."
      benefits={LOG_BENEFITS}
      media={
        <div className="rounded-3xl border border-hairline bg-white p-5 shadow-xl shadow-ink/5 transition-shadow duration-300 hover:shadow-2xl hover:shadow-ink/10">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <p className="text-sm font-bold">Push Day A</p>
            <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand">
              4 exercises
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {[
              { set: 'Set 1', w: '60 kg', r: '8', on: true },
              { set: 'Set 2', w: '60 kg', r: '8', on: true },
              { set: 'Set 3', w: '62.5 kg', r: '6', on: false },
            ].map((row) => (
              <div key={row.set} className="flex items-center gap-3">
                <span className="w-12 text-[11px] font-bold text-muted">{row.set}</span>
                <span className="flex-1 rounded-lg border border-hairline bg-wash px-3 py-2 text-center text-sm font-bold">
                  {row.w}
                </span>
                <span className="w-4 text-center text-xs text-muted">&times;</span>
                <span className="flex-1 rounded-lg border border-hairline bg-wash px-3 py-2 text-center text-sm font-bold">
                  {row.r}
                </span>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    row.on ? 'bg-mint text-white' : 'border border-hairline bg-white'
                  }`}
                >
                  {row.on && (
                    <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M20 6 9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="3.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  )}
                </span>
              </div>
            ))}
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-2.5 rounded-lg bg-sky-soft px-3 py-2.5">
            <span className="flex h-4 w-4 items-center justify-center rounded border-2 border-sky bg-white">
              <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M20 6 9 17l-5-5"
                  stroke="#2f6bff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </span>
            <span className="text-xs font-bold text-sky">Mark set 3 as a warmup</span>
          </label>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-ink px-4 py-3">
            <span className="text-[11px] font-semibold tracking-wide text-white/60 uppercase">
              Rest
            </span>
            <span className="font-mono text-base font-bold text-white">01:30</span>
          </div>
        </div>
      }
    />
  )
}

/* -------------------------------------------------------------------------- */
/* 2. Measure progress                                                         */
/* -------------------------------------------------------------------------- */

function MeasureProgress({
  activeChart,
  setActiveChart,
}: {
  activeChart: string
  setActiveChart: (id: string) => void
}) {
  const active = CHART_TABS.find((t) => t.id === activeChart) ?? CHART_TABS[0]

  return (
    <FeatureShell
      id="features"
      reverse
      eyebrow="Measure progress"
      eyebrowTone="sky"
      title="Watch strength go up, week after week"
      body="Numbers you can actually see. RepForge turns every logged set into strength curves, personal records and lift-by-lift history."
      benefits={PROGRESS_BENEFITS}
      media={
        <div className="rounded-3xl border border-hairline bg-white p-5 shadow-xl shadow-ink/5 transition-shadow duration-300 hover:shadow-2xl hover:shadow-ink/10">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Exercise">
            {CHART_TABS.map((tab) => {
              const on = tab.id === activeChart
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveChart(tab.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                    on
                      ? 'text-white shadow-sm'
                      : 'border border-hairline text-muted hover:bg-wash hover:text-ink'
                  }`}
                  style={on ? { backgroundColor: tab.color } : undefined}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">
                Estimated 1RM
              </p>
              <p className="text-3xl font-extrabold tracking-tight">
                {active.values[active.values.length - 1]}
                <span className="ml-1 text-sm font-bold text-muted">{active.unit}</span>
              </p>
            </div>
            <span className="rounded-full bg-mint-soft px-3 py-1.5 text-xs font-bold text-mint">
              +{active.values[active.values.length - 1] - active.values[0]} {active.unit} in 8 weeks
            </span>
          </div>

          <StrengthChart
            key={active.id}
            values={active.values}
            color={active.color}
            unit={active.unit}
          />

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-hairline pt-4">
            {[
              { k: 'Volume', v: '6,240 kg', tone: 'text-brand' },
              { k: 'Sets', v: '14', tone: 'text-sky' },
              { k: 'PRs', v: '2', tone: 'text-mint' },
            ].map((stat) => (
              <div key={stat.k} className="rounded-xl bg-wash px-3 py-2.5 text-center">
                <p className="text-[10px] font-bold tracking-wide text-muted uppercase">{stat.k}</p>
                <p className={`mt-0.5 text-sm font-extrabold ${stat.tone}`}>{stat.v}</p>
              </div>
            ))}
          </div>
        </div>
      }
    />
  )
}

function StrengthChart({
  values,
  color,
  unit,
}: {
  values: number[]
  color: string
  unit: string
}) {
  const w = 460
  const h = 190
  const padX = 8
  const padY = 18
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1

  const points = values.map((v, i) => {
    const x = padX + (i * (w - padX * 2)) / (values.length - 1)
    const y = h - padY - ((v - min) / span) * (h - padY * 2)
    return [x, y] as const
  })

  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${padX},${h} ${line} ${points[points.length - 1][0].toFixed(1)},${h}`
  const gradId = `grad-${color.replace('#', '')}`

  return (
    <div className="mt-4">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-[190px] w-full"
        role="img"
        aria-label={`Strength progression, ending at ${values[values.length - 1]} ${unit}`}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.24" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={padX}
            x2={w - padX}
            y1={padY + g * (h - padY * 2)}
            y2={padY + g * (h - padY * 2)}
            stroke="#eaecf0"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        ))}

        <polygon points={area} fill={`url(#${gradId})`} />
        <polyline
          className="chart-line"
          points={line}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === points.length - 1 ? 5.5 : 3.5} fill="#fff" stroke={color} strokeWidth="2.5" />
        ))}
      </svg>

      <div className="flex justify-between px-1 text-[10px] font-semibold text-muted">
        {['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'].map((wk) => (
          <span key={wk}>{wk}</span>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* 3. Community                                                                */
/* -------------------------------------------------------------------------- */

function Community() {
  return (
    <FeatureShell
      id="guides"
      eyebrow="Community"
      eyebrowTone="mint"
      title="Training is easier when your friends are in it too"
      body="Follow your gym crew, cheer on their PRs and steal the routines that actually work. Motivation stops being a solo sport."
      benefits={SOCIAL_BENEFITS}
      media={
        <div className="rounded-3xl border border-hairline bg-wash p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-bold">Following</p>
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-mint shadow-sm">
              Live feed
            </span>
          </div>

          <div className="space-y-3">
            {FEED.map((post) => (
              <article
                key={post.name}
                className="rounded-2xl border border-hairline bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold ${post.tone}`}
                  >
                    {post.initials}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13px] font-bold">{post.name}</span>
                    <span className="block text-[11px] text-muted">{post.when}</span>
                  </span>
                  <button
                    type="button"
                    className="rounded-full border border-hairline px-3 py-1.5 text-[11px] font-bold text-ink transition-colors duration-200 hover:border-mint hover:bg-mint-soft hover:text-mint"
                  >
                    Clone routine
                  </button>
                </div>

                <div className="mt-3 rounded-xl bg-wash px-3 py-2.5">
                  <p className="text-[13px] font-bold">{post.title}</p>
                  <p className="text-[11px] text-muted">{post.summary}</p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true" fill="none">
                      <path
                        d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.4-.6L3 21l1.8-5a8.2 8.2 0 0 1-.8-3.5 8.4 8.4 0 0 1 9-8.4 8.5 8.5 0 0 1 8 7.4z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {post.note}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-brand">
                    <HeartIcon />
                    {post.reaction}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      }
    />
  )
}

/* -------------------------------------------------------------------------- */
/* Wearables                                                                   */
/* -------------------------------------------------------------------------- */

function Wearables() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-hairline bg-gradient-to-br from-brand-soft via-white to-sky-soft">
        <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="inline-block rounded-full bg-white px-3.5 py-1.5 text-xs font-bold tracking-wide text-grape uppercase shadow-sm">
              Wearables
            </span>
            <h2 className="mt-4 text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-4xl">
              Leave the phone in the locker
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-soft">
              RepForge runs on Apple Watch and WearOS. See your set, log your reps and start the
              rest timer right from your wrist &mdash; everything syncs the moment you pick your
              phone back up.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold shadow-sm">
                <Dot tone="bg-ink" />
                Apple Watch
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold shadow-sm">
                <Dot tone="bg-mint" />
                WearOS
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold shadow-sm">
                <Dot tone="bg-sky" />
                Offline logging
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-5">
            <WatchFace />
            <div className="hidden flex-col gap-3 sm:flex">
              {[
                { k: 'Set logged', v: 'Bench 60 kg \u00d7 8', tone: 'text-mint' },
                { k: 'Next rest', v: '01:30', tone: 'text-sky' },
                { k: 'Session', v: '54:12', tone: 'text-brand' },
              ].map((row) => (
                <div
                  key={row.k}
                  className="rounded-xl border border-hairline bg-white px-4 py-3 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <p className="text-[10px] font-bold tracking-wide text-muted uppercase">
                    {row.k}
                  </p>
                  <p className={`text-sm font-extrabold ${row.tone}`}>{row.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Dot({ tone }: { tone: string }) {
  return <span className={`h-2 w-2 rounded-full ${tone}`} />
}

function WatchFace() {
  return (
    <div className="w-[134px] rounded-[1.8rem] border-[8px] border-ink bg-ink shadow-xl shadow-ink/20">
      <div className="flex flex-col items-center rounded-[1.3rem] bg-ink px-3 py-4 text-white">
        <span className="text-[9px] font-semibold tracking-wide text-white/50 uppercase">
          Squat
        </span>
        <span className="mt-0.5 text-[16px] font-extrabold">
          102 <span className="text-[10px] font-semibold text-white/60">kg</span>
        </span>

        <div className="relative my-2.5 flex h-[66px] w-[66px] items-center justify-center">
          <svg width="66" height="66" viewBox="0 0 66 66" aria-hidden="true">
            <circle cx="33" cy="33" r="28" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="6" />
            <circle
              cx="33"
              cy="33"
              r="28"
              fill="none"
              stroke="#2f6bff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="176"
              strokeDashoffset="44"
              transform="rotate(-90 33 33)"
            />
          </svg>
          <span className="absolute text-[13px] font-extrabold">5&times;5</span>
        </div>

        <span className="text-[9px] font-semibold text-sky">Set 4 of 5</span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Final CTA + footer                                                          */
/* -------------------------------------------------------------------------- */

function FinalCta() {
  return (
    <section className="bg-wash">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-6 lg:py-24">
        <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
          Your next PR starts with one logged set
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Free to download, free to use. Build a routine, track every rep and let RepForge show you
          how far you have come.
        </p>

        <div className="mt-9 flex flex-col items-center gap-4">
          <a
            href={APK_DOWNLOAD_URL}
            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-xl hover:shadow-brand/30"
          >
            <AndroidIcon />
            Download APK for Android
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              &rarr;
            </span>
          </a>
          <p className="text-xs text-muted">
            Latest build, always at this link &middot; Android 7.0+
          </p>
        </div>

        <StoreBadges className="mt-8 justify-center" />
      </div>
    </section>
  )
}

function Footer() {
  const columns = [
    { heading: 'Product', links: ['Features', 'Routine Builder', 'Progress Tracking', 'Wearables'] },
    { heading: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
    { heading: 'Resources', links: ['Guides', 'Workout Library', 'Help Centre', 'Release Notes'] },
  ]

  return (
    <footer className="border-t border-hairline bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <a href="#top" className="flex items-center gap-2">
              <LogoMark />
              <span className="text-lg font-extrabold tracking-tight">RepForge</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              The free workout tracker for building routines and getting measurably stronger.
            </p>
            <div className="mt-5 flex gap-3">
              {['Instagram', 'X', 'YouTube', 'TikTok'].map((s) => (
                <a
                  key={s}
                  href="#social"
                  aria-label={s}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-xs font-bold text-muted transition-colors duration-200 hover:border-brand hover:bg-brand-soft hover:text-brand"
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-bold tracking-wide text-ink uppercase">{col.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-sm text-muted transition-colors duration-200 hover:text-brand"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-6 sm:flex-row">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} RepForge. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs text-muted transition-colors duration-200 hover:text-brand"
            >
              Privacy
            </Link>
            <Link
              href="/delete-account"
              className="text-xs text-muted transition-colors duration-200 hover:text-brand"
            >
              Delete account
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * How long an Android handoff is given before the card assumes nothing took it.
 *
 * There is no browser event for "the intent had no handler": assigning an unhandled
 * scheme either shows a browser error page or, on the phones this exists for, does
 * nothing at all. What *is* observable is a successful handoff — the store app
 * opening hides this page — so the card starts a timer, cancels it on
 * `visibilitychange`/`pagehide`, and treats "still visible" as the failure. Long
 * enough for a cold store start, short enough that a dead tap does not look ignored.
 */
const HANDOFF_GRACE_MS = 1500

type Problem = 'unsupported' | 'unhandled' | null

/**
 * A store card whose link is an Android intent, not a URL.
 *
 * vivo has no web listing: its developer docs give `market://details?id=<pkg>`
 * as the way to open one, and that scheme means nothing to a desktop browser —
 * Safari answers "the address is invalid", Chrome shows a blank tab. So the card
 * is a button, and the intent is only fired where something can handle it.
 *
 * Firing it is not enough. An Android phone with no app for the scheme — no vivo
 * store installed, or a build where `market://` has no default — leaves the tap
 * doing visibly nothing, which reads as a broken page. Both misses now land on the
 * same note: the card says what happened and what to do instead, rather than
 * failing quietly.
 */
export default function StoreIntentLink({
  name,
  note,
  intent,
  className = '',
}: {
  name: string
  note: string
  intent: string
  className?: string
}) {
  const [problem, setProblem] = useState<Problem>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stopListening = useRef<(() => void) | null>(null)

  // A card unmounted mid-wait must not set state or leave a listener behind.
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
      stopListening.current?.()
    },
    []
  )

  const handOff = () => {
    if (timer.current) clearTimeout(timer.current)
    stopListening.current?.()
    timer.current = null
    stopListening.current = null

    if (!/android/i.test(navigator.userAgent)) {
      setProblem('unsupported')
      return
    }

    setProblem(null)

    const stop = () => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = null
      document.removeEventListener('visibilitychange', onLeave)
      window.removeEventListener('pagehide', onLeave)
      stopListening.current = null
    }
    // The store app opening is the success signal: this page stops being visible.
    const onLeave = () => stop()

    stopListening.current = stop
    document.addEventListener('visibilitychange', onLeave)
    window.addEventListener('pagehide', onLeave)

    timer.current = setTimeout(() => {
      // Still here after the grace period: no app on this phone answered it.
      if (document.visibilityState === 'visible') setProblem('unhandled')
      stop()
    }, HANDOFF_GRACE_MS)

    window.location.href = intent
  }

  const message =
    problem === 'unsupported'
      ? `This browser cannot open the ${name}. Open repforge.website/download on the phone and tap this card, or search RepForge in the store.`
      : problem === 'unhandled'
        ? `Nothing on this phone opened the ${name}. Open the ${name} app and search for RepForge, or install RepForge from Google Play.`
        : null

  return (
    <button
      type="button"
      onClick={handOff}
      className={`rounded-2xl border border-white/[0.10] bg-white/[0.03] p-5 text-left transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.06] ${className}`}
    >
      <div className="text-sm font-bold text-white">{name}</div>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">{note}</p>
      {message && (
        <p className="mt-2 text-xs leading-relaxed text-rose-300" role="status">
          {message}
        </p>
      )}
      <span className="mt-3 inline-block text-xs font-semibold text-rose-400">
        Find RepForge &rarr;
      </span>
    </button>
  )
}

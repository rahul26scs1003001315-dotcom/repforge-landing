'use client'

import { useState } from 'react'

/**
 * A store card whose link is an Android intent, not a URL.
 *
 * vivo has no web listing: its developer docs give `market://details?id=<pkg>`
 * as the way to open one, and that scheme means nothing to a desktop browser —
 * Safari answers "the address is invalid", Chrome shows a blank tab. So the card
 * is a button, and the intent is only fired where something can handle it. On
 * anything else the card explains how to reach the store instead of failing.
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
  const [unavailable, setUnavailable] = useState(false)

  return (
    <button
      type="button"
      onClick={() => {
        if (/android/i.test(navigator.userAgent)) {
          window.location.href = intent
        } else {
          setUnavailable(true)
        }
      }}
      className={`rounded-2xl border border-white/[0.10] bg-white/[0.03] p-5 text-left transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.06] ${className}`}
    >
      <div className="text-sm font-bold text-white">{name}</div>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">{note}</p>
      {unavailable && (
        <p className="mt-2 text-xs leading-relaxed text-rose-300" role="status">
          This browser cannot open the {name}. Open repforge.website/download on the phone and tap
          this card, or search RepForge in the store.
        </p>
      )}
      <span className="mt-3 inline-block text-xs font-semibold text-rose-400">
        Find RepForge &rarr;
      </span>
    </button>
  )
}

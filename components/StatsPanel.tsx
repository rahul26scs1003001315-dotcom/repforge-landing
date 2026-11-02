'use client'

import { useEffect, useState } from 'react'

/**
 * Reads the aggregate numbers from `site_stats()` — visits, download starts and
 * the number of registered accounts. The function returns three totals and two
 * today-figures, never a per-user row, so nothing here identifies anybody.
 */
type Stats = {
  visits_total: number
  visits_today: number
  downloads_total: number
  downloads_today: number
  users_total: number
  days_tracked: number
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export default function StatsPanel() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setError('The counters are not configured for this build.')
      return
    }

    let cancelled = false
    fetch(`${SUPABASE_URL}/rest/v1/rpc/site_stats`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: '{}',
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Counter returned HTTP ${response.status}`)
        return response.json() as Promise<Stats>
      })
      .then((data) => {
        if (!cancelled) setStats(data)
      })
      .catch((cause: Error) => {
        if (!cancelled) setError(cause.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <p className="mt-8 rounded-2xl border border-white/[0.10] bg-white/[0.03] p-5 text-sm text-slate-400">
        {error} If the SQL in <code className="text-slate-300">supabase/site-visits.sql</code> has
        not been run in the Supabase project yet, the counters stay at zero.
      </p>
    )
  }

  if (!stats) {
    return <p className="mt-8 text-sm text-slate-500">Reading the counters…</p>
  }

  const cards = [
    { label: 'Page views', value: stats.visits_total, today: stats.visits_today },
    { label: 'Download starts', value: stats.downloads_total, today: stats.downloads_today },
    { label: 'Registered users', value: stats.users_total, today: null },
    { label: 'Days tracked', value: stats.days_tracked, today: null },
  ]

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-white/[0.10] bg-white/[0.03] p-5 backdrop-blur-xl"
        >
          <div className="text-[11px] font-bold tracking-[0.14em] text-slate-400 uppercase">
            {card.label}
          </div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            {card.value.toLocaleString()}
          </div>
          {card.today !== null && (
            <div className="mt-1 text-xs text-slate-500">{card.today} today</div>
          )}
        </div>
      ))}
    </div>
  )
}

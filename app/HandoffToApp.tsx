'use client'

import React, { useEffect, useMemo, useState } from 'react'

/* ===========================================================================
 * The page a confirmation or password-reset mail lands on.
 * ---------------------------------------------------------------------------
 * Both mails target a link into the app, and the app registers two ways in: the
 * `repforge://verify` / `repforge://reset` scheme, and — once the association
 * files are live — an https link on this domain, which the operating system hands
 * straight to the app before a browser ever opens. This page exists for the case
 * where the https link is opened in a browser instead: universal links not yet
 * verified (iOS needs the paid developer programme for that), a desktop, or a
 * mail client's in-app viewer.
 *
 * It forwards to the same deep link the app already answers on, keeping the query
 * and fragment exactly as they arrived, because that is where Supabase puts the
 * code or the session tokens. Nothing is stored and nothing is validated here:
 * the app is the only thing that redeems a code.
 * =========================================================================== */

/**
 * How long to wait for the OS to hand the link to the app before admitting it is
 * probably not installed. Long enough for Android's intent resolution and iOS's
 * "Open in RepForge?" prompt.
 */
const HANDOFF_TIMEOUT_MS = 2500

type Props = {
  /** The deep link to open, without query or fragment, e.g. `repforge://reset`. */
  schemeLink: string
  title: string
  /** What this link does, in one line, for someone reading it before it opens. */
  description: string
}

export function HandoffToApp({ schemeLink, title, description }: Props) {
  const [search, setSearch] = useState('')
  const [hash, setHash] = useState('')
  const [status, setStatus] = useState<'opening' | 'waiting'>('opening')

  useEffect(() => {
    setSearch(window.location.search)
    setHash(window.location.hash)
  }, [])

  const deepLink = useMemo(() => `${schemeLink}${search}${hash}`, [schemeLink, search, hash])

  useEffect(() => {
    // After the first paint: iOS shows an "Open in…" prompt, and a scheme fired
    // before the page is interactive is sometimes dropped.
    if (!search && !hash) return
    const timer = setTimeout(() => {
      window.location.href = deepLink
      setStatus('waiting')
    }, 50)
    return () => clearTimeout(timer)
  }, [deepLink, search, hash])

  useEffect(() => {
    if (status !== 'waiting') return
    const timer = setTimeout(() => setStatus('opening'), HANDOFF_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [status])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-6 px-5 py-16 text-center sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-balance text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-slate-soft">{description}</p>

      <a
        href={deepLink}
        className="rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-dark"
      >
        Open in RepForge
      </a>

      <p className="text-xs leading-relaxed text-muted">
        {status === 'opening'
          ? 'Opening RepForge…'
          : 'If nothing opened, the app may not be installed on this device — the link only works inside the app.'}
      </p>
    </main>
  )
}

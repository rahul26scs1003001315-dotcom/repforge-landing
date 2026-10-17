'use client'

import React, { useEffect, useMemo, useState } from 'react'

/* ===========================================================================
 * The page a shared routine link lands on.
 * ---------------------------------------------------------------------------
 * The app shares `repforge://routine?d=<payload>`, but messaging apps only
 * linkify http(s) URLs — iMessage, WhatsApp and SMS all render a custom scheme
 * as dead text — so the message carries THIS page's https URL instead. The page
 * shows the routine to whoever received it, and hands off to the app by opening
 * the same `repforge://routine?d=<payload>` deep link the app already answers on.
 *
 * The payload travels in the URL, so this page needs no server, no database and
 * no shortener: a link cannot expire, and it works offline once loaded. Keeping
 * the decode here byte-for-byte compatible with src/services/routineShare.ts is
 * what makes that work — see decodePayload below.
 * =========================================================================== */

const APP_SCHEME_LINK = 'repforge://routine'
const APK_DOWNLOAD_URL =
  'https://github.com/rahul26scs1003001315-dotcom/repforge-releases/releases/latest/download/repforge.apk'

/*
 * Where a recipient without the app is sent. The landing page is the install
 * funnel: it explains what RepForge is and carries the APK download, which a
 * bare shared routine cannot do. Kept absolute because this route is served
 * from a sub-path on GitHub Pages.
 */
const LANDING_URL = 'https://rahul26scs1003001315-dotcom.github.io/repforge-landing/'

/*
 * How long to wait for the OS to hand the deep link to the app before concluding
 * it is not installed. Long enough to cover Android's intent resolution and
 * iOS's "Open in RepForge?" prompt, short enough that a missing app does not
 * leave the recipient staring at a page they cannot act on.
 */
const APP_HANDOFF_TIMEOUT_MS = 2500

type SharedExercise = {
  exerciseId: string
  name: string
  group?: string
  sets: number
  reps: number
}

type SharedRoutine = {
  name: string
  exercises: SharedExercise[]
}

/* ---------------------------------------------------------------------------
 * Decoding — mirrors the app's codec so a link the app wrote is readable here.
 * ------------------------------------------------------------------------- */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

const utf8Decode = (bytes: number[]): string | null => {
  let result = ''
  let index = 0
  while (index < bytes.length) {
    const first = bytes[index]
    let codePoint: number
    let size: number
    if (first < 0x80) {
      codePoint = first
      size = 1
    } else if ((first & 0xe0) === 0xc0) {
      codePoint = first & 0x1f
      size = 2
    } else if ((first & 0xf0) === 0xe0) {
      codePoint = first & 0x0f
      size = 3
    } else if ((first & 0xf8) === 0xf0) {
      codePoint = first & 0x07
      size = 4
    } else {
      return null
    }
    if (index + size > bytes.length) return null
    for (let offset = 1; offset < size; offset += 1) {
      const continuation = bytes[index + offset]
      if ((continuation & 0xc0) !== 0x80) return null
      codePoint = (codePoint << 6) | (continuation & 0x3f)
    }
    if (size === 2 && codePoint < 0x80) return null
    if (size === 3 && codePoint < 0x800) return null
    if (size === 4 && codePoint < 0x10000) return null
    if (codePoint > 0x10ffff) return null
    result += String.fromCodePoint(codePoint)
    index += size
  }
  return result
}

const base64UrlDecode = (value: string): string | null => {
  const bytes: number[] = []
  let buffer = 0
  let bits = 0
  for (const character of value) {
    const index = ALPHABET.indexOf(character)
    if (index === -1) return null
    buffer = (buffer << 6) | index
    bits += 6
    if (bits >= 8) {
      bits -= 8
      bytes.push((buffer >> bits) & 0xff)
    }
  }
  if (bits > 0 && (buffer & ((1 << bits) - 1)) !== 0) return null
  return utf8Decode(bytes)
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value))

const toPositiveInt = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback

/** Anything that is not exactly the shape the app writes is rejected outright. */
const parsePayload = (value: unknown): SharedRoutine | null => {
  if (!isRecord(value)) return null
  if (value.v !== 1) return null
  if (typeof value.n !== 'string' || !value.n.trim()) return null
  if (!Array.isArray(value.e)) return null

  const exercises: SharedExercise[] = []
  for (const entry of value.e) {
    if (!isRecord(entry)) return null
    if (typeof entry.i !== 'string' || !entry.i) return null
    if (typeof entry.m !== 'string' || !entry.m.trim()) return null
    exercises.push({
      exerciseId: entry.i,
      name: entry.m,
      ...(typeof entry.g === 'string' && entry.g ? { group: entry.g } : {}),
      sets: toPositiveInt(entry.s, 1),
      reps: toPositiveInt(entry.r, 1),
    })
  }

  if (!exercises.length) return null
  return { name: value.n, exercises }
}

const decodePayload = (payload: string): SharedRoutine | null => {
  const json = base64UrlDecode(payload)
  if (json === null) return null
  try {
    return parsePayload(JSON.parse(json))
  } catch {
    return null
  }
}

/** The payload from `?d=` or `#d=`, whichever the link carries. */
const payloadFromLocation = (): string => {
  const search = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  return search.get('d') ?? hash.get('d') ?? ''
}

/* ---------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export default function SharedRoutinePage() {
  // Read from the live location instead of useSearchParams: the site is a static
  // export, and this keeps the page prerenderable.
  const [payload, setPayload] = useState<string | null>(null)

  useEffect(() => {
    setPayload(payloadFromLocation())
  }, [])

  const routine = useMemo(() => (payload ? decodePayload(payload) : null), [payload])
  const deepLink = payload ? `${APP_SCHEME_LINK}?d=${payload}` : ''
  const [opened, setOpened] = useState(false)

  /*
   * Dynamic routing: decide, on the recipient's device, whether RepForge is
   * installed.
   *
   * There is no API that answers that question directly, so it is inferred from
   * the hand-off itself. The https link always opens this page first; this page
   * then tries the custom scheme, and if the OS had an app to give it to, the
   * browser is backgrounded — `visibilitychange`/`pagehide` fire and the
   * fallback is cancelled. If the page is still in front of the user after
   * APP_HANDOFF_TIMEOUT_MS, nothing answered the scheme, so the app is not
   * installed and the link is redirected to the install landing page.
   *
   * Desktop is deliberately excluded: there is no APK to install there, so the
   * page keeps the routine readable (it is the whole plan) and offers the app as
   * an option instead of taking the page away.
   */
  useEffect(() => {
    if (!routine || !deepLink) return
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) return

    let handedOff = false
    const markHandedOff = () => {
      handedOff = true
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') markHandedOff()
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('pagehide', markHandedOff)

    const openTimer = window.setTimeout(() => {
      setOpened(true)
      window.location.href = deepLink
    }, 700)

    const fallbackTimer = window.setTimeout(() => {
      if (handedOff || document.visibilityState === 'hidden') return
      window.location.replace(LANDING_URL)
    }, APP_HANDOFF_TIMEOUT_MS)

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pagehide', markHandedOff)
      window.clearTimeout(openTimer)
      window.clearTimeout(fallbackTimer)
    }
  }, [routine, deepLink])

  if (payload === null) {
    return <Shell><p className="text-muted">Loading routine…</p></Shell>
  }

  if (!routine) {
    return (
      <Shell>
        <h1 className="text-3xl font-black tracking-tight text-ink">That link is not complete</h1>
        <p className="mt-3 text-muted">
          The routine did not survive the trip — chat apps sometimes cut long links in half. Ask
          for it again, or open RepForge and paste the whole link.
        </p>
        <a
          href={APK_DOWNLOAD_URL}
          className="mt-8 inline-block rounded-2xl bg-brand px-7 py-4 text-base font-extrabold text-white no-underline"
        >
          Get RepForge for Android
        </a>
      </Shell>
    )
  }

  const totalSets = routine.exercises.reduce((sum, item) => sum + item.sets, 0)

  return (
    <Shell>
      <p className="text-xs font-bold tracking-[0.18em] text-brand uppercase">Shared routine</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-ink">{routine.name}</h1>
      <p className="mt-2 text-muted">
        {routine.exercises.length} exercise{routine.exercises.length === 1 ? '' : 's'} ·{' '}
        {totalSets} total sets
      </p>

      <ol className="mt-8 flex list-none flex-col gap-3 p-0">
        {routine.exercises.map((exercise, index) => (
          <li
            key={`${exercise.exerciseId}-${index}`}
            className="flex items-center justify-between gap-4 rounded-2xl border border-hairline bg-wash px-5 py-4"
          >
            <div>
              <p className="font-bold text-ink">{exercise.name}</p>
              {exercise.group ? <p className="text-sm text-muted">{exercise.group}</p> : null}
            </div>
            <p className="shrink-0 font-extrabold text-brand">
              {exercise.sets} × {exercise.reps}
            </p>
          </li>
        ))}
      </ol>

      <a
        href={deepLink}
        className="mt-8 block rounded-2xl bg-brand px-7 py-4 text-center text-lg font-extrabold text-white no-underline"
      >
        Open in RepForge
      </a>
      <p className="mt-3 text-center text-sm text-muted">
        {opened
          ? 'If nothing happened, tap the button above. No app on this device? You are being taken to the download page.'
          : 'On a phone this opens the app automatically. The routine above is the whole plan, so it can be built by hand anywhere.'}
      </p>

      <p className="mt-8 border-t border-hairline pt-6 text-center text-sm text-muted">
        No RepForge on this phone yet?{' '}
        <a href={APK_DOWNLOAD_URL} className="font-bold text-sky no-underline">
          Download it for Android
        </a>
        , then open this link again.
      </p>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-6 py-16">
      {children}
    </main>
  )
}

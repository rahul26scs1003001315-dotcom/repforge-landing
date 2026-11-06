'use client'

import React, { useEffect, useState } from 'react'

import { libraryEntry } from './exerciseNames'

/* ===========================================================================
 * The page a shared routine link lands on.
 * ---------------------------------------------------------------------------
 * The app shares `repforge://routine?c=<code>`, but messaging apps only linkify
 * http(s) URLs — iMessage, WhatsApp and SMS all render a custom scheme as dead
 * text — so the message carries THIS page's https URL instead. The page shows
 * the routine to whoever received it, and hands off to the app by opening the
 * same `repforge://routine?c=<code>` deep link the app answers on.
 *
 * Two link shapes arrive here. `?c=<code>` is what the app sends now: the routine
 * is stored in Supabase and the link is twelve characters, so chat apps stop
 * truncating it and nothing is lost on the way. `?d=<payload>` is the older
 * self-contained link, which still works — the routine is decoded straight out
 * of the URL exactly as before. Keeping that decode byte-for-byte compatible with
 * src/services/routineShare.ts is what makes old links keep working.
 * =========================================================================== */

const APP_SCHEME_LINK = 'repforge://routine'
const APK_DOWNLOAD_URL =
  'https://github.com/rahul26scs1003001315-dotcom/repforge-releases/releases/latest/download/repforge.apk'

/*
 * Where a recipient without the app is sent. The landing page is the install
 * funnel: it explains what RepForge is and carries the APK download, which a
 * bare shared routine cannot do. The custom domain serves this site at its
 * root, so the old github.io project path is not a page any more.
 */
const LANDING_URL = 'https://repforge.website/'

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
  /** Optional byline: links made before the app sent one have no author. */
  author?: string
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

/**
 * A readable name from an id, for a movement this page has no name for.
 *
 * The table below the app's library is generated, so it can be a release behind a
 * library that just gained a movement. Rejecting the link then would throw away a
 * whole routine over one label, so the id — a slug of the name — is read out
 * instead.
 */
const nameFromId = (id: string): string =>
  id
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

/**
 * One exercise, in either wire form.
 *
 * `[id, sets, reps]` is the compact tuple the app writes now: the name and group
 * are dropped because the id names a library movement, and the app resolves them
 * from its own library on the way back in. This page has no library, so it
 * carries a generated table of the same names (`exerciseNames.ts`) and resolves
 * them the same way. A custom movement — and every link written before the
 * compaction — still carries the strings, and those win when present. Reading
 * only the old object form is what left every new link on "not complete".
 */
const parseExercise = (entry: unknown): SharedExercise | null => {
  if (Array.isArray(entry)) {
    const [exerciseId, sets, reps, customName, customGroup] = entry
    if (typeof exerciseId !== 'string' || !exerciseId) return null
    const library = libraryEntry(exerciseId)
    const name =
      typeof customName === 'string' && customName.trim()
        ? customName.trim()
        : (library?.name ?? nameFromId(exerciseId))
    const group =
      typeof customGroup === 'string' && customGroup.trim() ? customGroup.trim() : library?.group
    return {
      exerciseId,
      name,
      ...(group ? { group } : {}),
      sets: toPositiveInt(sets, 1),
      reps: toPositiveInt(reps, 1),
    }
  }

  if (!isRecord(entry)) return null
  if (typeof entry.i !== 'string' || !entry.i) return null
  const library = libraryEntry(entry.i)
  const name =
    typeof entry.m === 'string' && entry.m.trim()
      ? entry.m.trim()
      : (library?.name ?? nameFromId(entry.i))
  const group = typeof entry.g === 'string' && entry.g ? entry.g : library?.group
  return {
    exerciseId: entry.i,
    name,
    ...(group ? { group } : {}),
    sets: toPositiveInt(entry.s, 1),
    reps: toPositiveInt(entry.r, 1),
  }
}

/** Anything that is not exactly the shape the app writes is rejected outright. */
const parsePayload = (value: unknown): SharedRoutine | null => {
  if (!isRecord(value)) return null
  if (value.v !== 1) return null
  if (typeof value.n !== 'string' || !value.n.trim()) return null
  if (!Array.isArray(value.e)) return null

  const exercises: SharedExercise[] = []
  for (const entry of value.e) {
    const exercise = parseExercise(entry)
    if (!exercise) return null
    exercises.push(exercise)
  }

  if (!exercises.length) return null
  return {
    name: value.n,
    ...(typeof value.a === 'string' && value.a.trim() ? { author: value.a.trim() } : {}),
    exercises,
  }
}

/**
 * A ceiling on what will be decoded at all.
 *
 * The payload arrives in the URL, so it is whoever-sent-the-link's choice how
 * large it is: without a cap, a multi-megabyte `?d=` makes this page base64-decode
 * and JSON-parse megabytes on a phone before rejecting it. The app's own links are
 * a few hundred bytes — 200 exercises of compact tuples is still under 8 kB — so
 * anything above this is not a routine we can render anyway.
 */
const MAX_PAYLOAD_CHARS = 8000

const decodePayload = (payload: string): SharedRoutine | null => {
  if (payload.length > MAX_PAYLOAD_CHARS) return null
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

/*
 * A short link's code, and the routine it points at.
 *
 * The code is checked against the shape the server mints before it is put in a
 * request: a mangled or half-pasted link is answered with "not complete" rather
 * than with a query that cannot match a row. `read_shared_routine` returns the
 * stored record — the same wire shape an inline payload carries — so both link
 * kinds are rendered by one parser.
 *
 * The published anon key is the one already shipped to every browser by the
 * counters on the stats page; the function it calls returns exactly the routine
 * whose code it was given, and nothing else.
 */
const CODE_PATTERN = /^[A-Za-z0-9_-]{8,32}$/
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const codeFromLocation = (): string => {
  const search = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const code = search.get('c') ?? hash.get('c') ?? ''
  return CODE_PATTERN.test(code) ? code : ''
}

/** The routine a code points at, or null when it cannot be read. */
const fetchRoutine = async (code: string): Promise<SharedRoutine | null> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/read_shared_routine`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ p_code: code }),
    })
    if (!response.ok) return null
    return parsePayload(await response.json())
  } catch {
    return null
  }
}

/* ---------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */

export default function SharedRoutinePage() {
  // Read from the live location instead of useSearchParams: the site is a static
  // export, and this keeps the page prerenderable.
  const [payload, setPayload] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [routine, setRoutine] = useState<SharedRoutine | null>(null)
  // `loading` covers the fetch a code makes; a payload link is decoded on the
  // spot and never shows it.
  const [phase, setPhase] = useState<'loading' | 'ready' | 'empty'>('loading')

  useEffect(() => {
    const linkCode = codeFromLocation()
    if (linkCode) {
      setCode(linkCode)
      return
    }
    const inline = payloadFromLocation()
    if (!inline) {
      setPhase('empty')
      return
    }
    setPayload(inline)
    setRoutine(decodePayload(inline))
    setPhase('ready')
  }, [])

  useEffect(() => {
    if (!code) return
    let cancelled = false
    void fetchRoutine(code).then((found) => {
      if (cancelled) return
      setRoutine(found)
      setPhase('ready')
    })
    return () => {
      cancelled = true
    }
  }, [code])

  const deepLink = code
    ? `${APP_SCHEME_LINK}?c=${code}`
    : payload
      ? `${APP_SCHEME_LINK}?d=${payload}`
      : ''
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

  if (phase === 'loading') {
    return <Shell><p className="text-muted">Loading routine…</p></Shell>
  }

  if (!routine) {
    return (
      <Shell>
        <h1 className="text-3xl font-black tracking-tight text-ink">
          {code ? 'That routine could not be opened' : 'That link is not complete'}
        </h1>
        <p className="mt-3 text-muted">
          {code
            ? 'The code may be mistyped or the link was cut short, or this page could not reach RepForge. Check your connection and open the link again, or ask for a fresh one.'
            : 'The routine did not survive the trip — chat apps sometimes cut long links in half. Ask for it again, or open RepForge and paste the whole link.'}
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
      {/* The same three facts the shared message opens with — name, byline, and
          how much work it is — so tapping the link does not feel like a
          different routine from the one in the chat. */}
      <p className="text-xs font-bold tracking-[0.18em] text-brand uppercase">
        {routine.author ? 'Routine by ' + routine.author : 'Shared routine'}
      </p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-ink">{routine.name}</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-hairline px-4 py-1.5 text-sm font-bold text-ink">
          Routine
        </span>
        <span className="rounded-full border border-hairline px-4 py-1.5 text-sm font-bold text-ink">
          {routine.exercises.length} exercise{routine.exercises.length === 1 ? '' : 's'}
        </span>
        <span className="rounded-full border border-hairline px-4 py-1.5 text-sm font-bold text-ink">
          {totalSets} sets
        </span>
      </div>

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

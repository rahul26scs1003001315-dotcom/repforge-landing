'use client'

import { useEffect } from 'react'

/**
 * Counts that a page was opened. That is the whole job.
 *
 * The site is a static export on GitHub Pages, so nothing server-side can count
 * a visit. This posts one row to the `record_site_visit` function in our own
 * Supabase project (`supabase/site-visits.sql`): a date, a path and an integer.
 * No cookie, no local/session storage, no device id, no user agent, no referrer
 * — nothing that survives the request or can be joined back to a person.
 *
 * Both variables are the public ones already baked into the app bundle; the
 * anon key is designed to be shipped to clients and the function it calls can
 * only increment a counter. When either is missing this renders and does
 * nothing, so a build without them still works and simply records nothing.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export default function SiteVisitBeacon() {
  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return

    // A failure here is not worth surfacing or retrying: it is a counter, and a
    // dropped count must never look like a broken page.
    void fetch(`${SUPABASE_URL}/rest/v1/rpc/record_site_visit`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ p_path: window.location.pathname }),
      keepalive: true,
    }).catch(() => {})
  }, [])

  return null
}

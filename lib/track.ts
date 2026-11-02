/**
 * One anonymous counter call, shared by the page beacon and the download button.
 *
 * `name` is either a page path (`/`, `/download`) or an event prefixed `dl:`
 * (`dl:apk`). The stats function splits visits and downloads on that prefix.
 *
 * Both variables are the public ones already baked into the app bundle; the anon
 * key is designed to ship to clients and `record_site_event` can only increment
 * a counter. When either is missing this is a no-op, so a build without them
 * still works and simply records nothing.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function trackEvent(name: string): void {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return
  if (typeof window === 'undefined') return

  void fetch(`${SUPABASE_URL}/rest/v1/rpc/record_site_event`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ p_name: name }),
    // Keeps the request alive when the navigation it was fired from unloads.
    keepalive: true,
  }).catch(() => {})
}

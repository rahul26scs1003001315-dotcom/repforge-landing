/**
 * Where to send someone who wants RepForge on their phone.
 *
 * The package id is the whole URL, deliberately. Searching Google Play for
 * "RepForge" returns another developer's app first (`com.srujan1527.repforge`,
 * "RepForge: Gym Workout Tracker"), so any name-based link — a search URL, a
 * "find us on Play" badge — sends people to the wrong listing. A name search
 * also resolves to whatever the store is serving that day; the package id does
 * not.
 *
 * Keep this as the only place the Play URL is written. A second copy is how the
 * homepage and the download page end up pointing at different apps.
 *
 * Pages should use `playStoreUrl()` rather than this constant, so their traffic
 * is attributed in Play Console instead of collapsing into "untagged".
 */
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.repforge'

/**
 * The same listing, tagged so Play Console can attribute the visit to this site.
 *
 * Play reads `utm_source` and `utm_campaign` from a deep link to the listing —
 * they are dimensions on Grow users → Store performance → Conversion analysis.
 * Two things about reading the report, both easy to get wrong:
 *
 *   - The UTM dimensions only appear once **Traffic source** is filtered to
 *     *Ads and referrals*; unfiltered, they read as empty and look broken.
 *   - Attribution is per store-listing visit, not per in-app event. There is no
 *     SDK involved, which is why this costs the app nothing in Data safety.
 *
 * `utm_medium=referral` because that is what these are: another origin sending
 * someone to the store. `campaign` distinguishes the page, so a routine share can
 * be told apart from the homepage rather than lumped into one "website" bucket.
 *
 * The package id stays the first query parameter — it is what identifies the
 * app, and it must survive whatever else is appended.
 */
export function playStoreUrl(campaign: string): string {
  const url = new URL(PLAY_STORE_URL)
  url.searchParams.set('utm_source', 'website')
  url.searchParams.set('utm_medium', 'referral')
  url.searchParams.set('utm_campaign', campaign)
  return url.toString()
}

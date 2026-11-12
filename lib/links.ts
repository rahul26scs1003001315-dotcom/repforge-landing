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
 */
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.repforge'

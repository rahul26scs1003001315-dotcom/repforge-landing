/**
 * The app-derived numbers this site states, read from the app repo at build time.
 *
 * Every figure here used to be a literal in a page — "736 exercises", "Android
 * 7.0+", and a version/byte-count/checksum trio that `apk:sync` rewrote in place.
 * A literal cannot stay true: importing one RepDB record or cutting one release
 * left the site quoting the previous state, and nothing failed. So the build reads
 * the app instead, and this module is the only place that does it.
 *
 * Used by `next.config.js`, which runs once per build and hands the values to the
 * pages through `env`. It runs on the server (Node) only: the pages that need the
 * numbers are client components, and they must not touch the filesystem.
 *
 * The app checkout is named by REPFORGE_APP_DIR, or by the gitignored
 * `.repforge-app-dir` at the repo root. There is no guessing: a build that cannot
 * find the app fails, because the alternative is publishing a stale number and
 * calling it a success.
 */

const { existsSync, readFileSync } = require('node:fs')
const { join, resolve } = require('node:path')
const { pathToFileURL } = require('node:url')

const SITE_ROOT = join(__dirname, '..')

const MISSING = [
  'The landing build needs the repforge app repo to read its library and release facts.',
  '  Set REPFORGE_APP_DIR to that checkout, or write its path into .repforge-app-dir:',
  '    REPFORGE_APP_DIR=/path/to/repforge npm run build',
  '    echo /path/to/repforge > .repforge-app-dir',
].join('\n')

function appDir() {
  const fromEnv = process.env.REPFORGE_APP_DIR
  if (fromEnv && fromEnv.trim()) return resolve(fromEnv.trim())

  const pointer = join(SITE_ROOT, '.repforge-app-dir')
  if (existsSync(pointer)) {
    const listed = readFileSync(pointer, 'utf8').trim()
    if (listed) return resolve(listed)
  }

  throw new Error(MISSING)
}

/**
 * The APK the download page describes: the last one published, recorded by the
 * app's `publish-apk.mjs` (or by `npm run apk:sync` for an explicit file).
 */
function readApk(dir) {
  const file = join(dir, 'dist_metadata/last-release.json')
  if (!existsSync(file)) {
    throw new Error(
      [
        `No release record at ${file}.`,
        '  It is written when an APK is published, so the page always names a file that exists:',
        '    npm run release:all        # publish, then record',
        '    npm run apk:sync -- --apk dist_metadata/artifacts/repforge-x.y.z-zz.apk',
      ].join('\n')
    )
  }

  const record = JSON.parse(readFileSync(file, 'utf8'))
  if (typeof record.version !== 'string' || !record.version.trim()) {
    throw new Error(`${file} has no version. Re-publish, or run apk:sync again.`)
  }
  if (!Number.isInteger(record.bytes) || record.bytes <= 0) {
    throw new Error(`${file} has no byte count. Re-publish, or run apk:sync again.`)
  }
  if (typeof record.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(record.sha256)) {
    throw new Error(`${file} has no lowercase SHA-256. Re-publish, or run apk:sync again.`)
  }

  return {
    version: record.version,
    tag: record.tag ?? `v${record.version}`,
    bytes: record.bytes,
    sha256: record.sha256,
    asset: record.asset ?? 'repforge.apk',
  }
}

/**
 * The library the app ships: its hand-written movements plus every RepDB record
 * they do not already cover, deduplicated by the same function the app calls
 * (`mergeRepdbExercises`). Importing the app's own modules, rather than counting
 * literals in the files, is what keeps this equal to what a user sees.
 */
async function readLibrary(dir) {
  const load = (relative) => import(pathToFileURL(join(dir, relative)).href)
  let exercises, repdb
  try {
    exercises = await load('src/data/exercises.ts')
    repdb = await load('src/data/repdb.ts')
  } catch (error) {
    throw new Error(
      [
        `Could not read the app's exercise data under ${dir}.`,
        '  The build needs a Node that strips TypeScript types (22.18+, 23+ or 24+).',
        `  ${error.message}`,
      ].join('\n')
    )
  }

  const total = repdb.mergeRepdbExercises(exercises.EXERCISES).length
  return {
    total,
    handwritten: exercises.EXERCISES.length,
    repdb: repdb.REPDB_EXERCISES.length,
  }
}

// API level to the Android release consumers recognise. An unlisted level fails
// rather than guessing, because a wrong minimum is a false install requirement.
const ANDROID_BY_API = {
  21: '5.0',
  22: '5.1',
  23: '6.0',
  24: '7.0',
  25: '7.1',
  26: '8.0',
  27: '8.1',
  28: '9',
  29: '10',
  30: '11',
  31: '12',
  32: '12L',
  33: '13',
  34: '14',
  35: '15',
  36: '16',
}

/**
 * The oldest Android the release installs on. `android/app/build.gradle` defers the
 * number to the Expo root plugin, so it is read from the release build's metadata
 * when the Gradle file does not spell it out.
 */
function readAndroidMin(dir) {
  const gradlePath = join(dir, 'android/app/build.gradle')
  const literal = existsSync(gradlePath)
    ? readFileSync(gradlePath, 'utf8').match(/minSdkVersion\s+(\d+)/)
    : null

  let api = literal ? Number(literal[1]) : NaN
  if (!Number.isInteger(api)) {
    const metadataPath = join(dir, 'android/app/build/outputs/apk/release/output-metadata.json')
    if (!existsSync(metadataPath)) {
      throw new Error(
        [
          `Cannot tell which Android version the app supports: no minSdkVersion in ${gradlePath}`,
          `  and no release build metadata at ${metadataPath}.`,
          '  Build a release APK once in the app checkout, or put a number in Gradle.',
        ].join('\n')
      )
    }
    const report = JSON.parse(readFileSync(metadataPath, 'utf8'))
    api = report.minSdkVersionForDexing ?? report.elements?.[0]?.minSdkVersionForDexing
  }

  const version = ANDROID_BY_API[api]
  if (!version) {
    throw new Error(`minSdkVersion ${api} has no Android release name in lib/appFacts.cjs.`)
  }
  return { api, version }
}

/** Everything the pages quote about the app, in one read. */
async function readAppFacts() {
  const dir = appDir()
  if (!existsSync(join(dir, 'app.json')) || !existsSync(join(dir, 'src/data/exercises.ts'))) {
    throw new Error(
      [
        `${dir} does not look like the repforge app repo (no app.json / src/data/exercises.ts).`,
        '  Point REPFORGE_APP_DIR at the checkout that has them.',
      ].join('\n')
    )
  }

  return {
    dir,
    library: await readLibrary(dir),
    apk: readApk(dir),
    android: readAndroidMin(dir),
  }
}

module.exports = { readAppFacts }

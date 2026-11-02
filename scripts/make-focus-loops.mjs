/**
 * Generates the three focus-mode loops in public/audio.
 *
 * Every loop is written straight into a circular buffer of exactly 15 s, so a
 * tail that runs past the end wraps into the start: the last sample is followed
 * by the first sample as if the buffer were played forever, which means
 * `loop = true` repeats with no click and no gap.
 *
 * Timing: 15 s holds exactly 32 beats, so the tempo loops sit at 128 BPM and a
 * bar is 4 beats. Continuous tones (pads, drones) are snapped to a whole number
 * of cycles inside the loop; one-shots are free-running because they decay into
 * the wrap.
 *
 *   node scripts/make-focus-loops.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RATE = 44100
const LOOP_SECONDS = 15
const FRAMES = RATE * LOOP_SECONDS
const BEATS = 32
const BEAT = LOOP_SECONDS / BEATS
const TAU = Math.PI * 2

/** Nearest frequency that completes whole cycles across the loop. */
const snap = (hz) => Math.max(1, Math.round(hz * LOOP_SECONDS)) / LOOP_SECONDS
const notes = snap

/** Adds a rendered shape into the circular buffer, wrapping past the end. */
function add(buffer, startSeconds, durationSeconds, shape) {
  const start = Math.round(startSeconds * RATE)
  const length = Math.min(Math.round(durationSeconds * RATE), FRAMES)
  for (let n = 0; n < length; n += 1) {
    buffer[(start + n) % FRAMES] += shape(n / RATE)
  }
}

/** Additive tone with an exponential decay — notes, bells, plucks. */
function pluck(freq, partials, decay, attack = 0.004) {
  return (t) => {
    let value = 0
    for (const [mult, amp, extraDecay = 0] of partials) {
      value += amp * Math.sin(TAU * freq * mult * t) * Math.exp(-(decay + extraDecay) * t)
    }
    return value * (t < attack ? t / attack : 1)
  }
}

/** Sustained stack of sines — pads and drones. No decay, so it must be periodic. */
function chord(voices, swellCycles = 1, swellDepth = 0.25, base = 0) {
  return (t) => {
    let value = 0
    for (const [freq, amp] of voices) value += amp * Math.sin(TAU * freq * t)
    const swell = 1 - swellDepth + swellDepth * Math.sin(TAU * (swellCycles / LOOP_SECONDS) * t - Math.PI / 2)
    return (value + base) * swell
  }
}

const kick = () => (t) =>
  Math.sin(TAU * (48 + 110 * Math.exp(-t * 26)) * t) * Math.exp(-t * 7.5)

const hat = (level = 0.3) => {
  let seed = 0x9e3779b9
  const noise = Array.from({ length: Math.ceil(0.08 * RATE) + 2 }, () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return (seed / 4294967296) * 2 - 1
  })
  return (t) => {
    const i = Math.round(t * RATE)
    const hp = noise[i] - (noise[i - 1] ?? 0) // crude high-pass
    return level * hp * Math.exp(-t * 85)
  }
}

const snare = (level = 0.5) => {
  let seed = 0x2545f491
  // Must cover the full rendered length: indexing past the end yields undefined
  // and a single NaN poisons the whole buffer.
  const noise = Array.from({ length: Math.ceil(0.3 * RATE) + 2 }, () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return (seed / 4294967296) * 2 - 1
  })
  return (t) => {
    const i = Math.round(t * RATE)
    const crack = (noise[i] ?? 0) - 0.5 * (noise[i - 1] ?? 0)
    const body = Math.sin(TAU * 185 * t) * 0.45
    return level * (crack + body) * Math.exp(-t * 16)
  }
}

const A1 = 55
const E2 = 82.41
const A2 = 110
const C3 = 130.81
const E3 = 164.81
const F1 = 43.65
const C2 = 65.41
const G1 = 49
const A3 = 220
const C4 = 261.63
const D4 = 293.66
const E4 = 329.63
const F3 = 174.61
const G3 = 196
const B3 = 246.94
const A4 = 440
const C5 = 523.25

const WARM = [
  [1, 1],
  [2, 0.32],
  [3, 0.14],
  [4, 0.07],
]
const SAW = [
  [1, 1],
  [2, 0.55],
  [3, 0.34],
  [4, 0.22],
  [5, 0.14],
  [6, 0.09],
]
const BELL = [
  [1, 1],
  [2, 0.42],
  [3, 0.2],
  [4.2, 0.1],
]

/* -------------------------------------------------------------------------- */
/* deep-focus — A minor pad that breathes, with a heartbeat every four beats   */
/* -------------------------------------------------------------------------- */
function deepFocus() {
  const buffer = new Float32Array(FRAMES)
  add(
    buffer,
    0,
    LOOP_SECONDS,
    chord(
      [
        [snap(A1), 0.34],
        [snap(E2), 0.13],
        [snap(A2), 0.1],
        [snap(C3), 0.08],
        [snap(E3), 0.045],
        [snap(A3), 0.018],
      ],
      1,
      0.36,
    ),
  )
  // A slow, very quiet upper voice drifting in and out twice per loop.
  add(
    buffer,
    0,
    LOOP_SECONDS,
    chord([[snap(A4), 0.028], [snap(C5), 0.016]], 2, 0.6),
  )
  // Barely there: felt more than heard, just enough to keep time passing.
  for (let beat = 0; beat < BEATS; beat += 4) {
    add(buffer, beat * BEAT, 0.7, (t) => 0.028 * kick()(t))
  }
  // Two faint bells mark the half and the three-quarter, like a clock two rooms away.
  add(buffer, 15 * 0.5, 2.4, (t) => 0.05 * pluck(notes(A4), BELL, 2.4)(t))
  add(buffer, 15 * 0.75, 2.4, (t) => 0.034 * pluck(notes(E4), BELL, 2.4)(t))
  return buffer
}

/* -------------------------------------------------------------------------- */
/* push-tempo — 128 BPM: four-on-the-floor, offbeat hats, Am-F-C-G bass + arp   */
/* -------------------------------------------------------------------------- */
function pushTempo() {
  const buffer = new Float32Array(FRAMES)
  const bars = [
    { root: A1, tones: [A3, C4, E4, A4] },
    { root: F1, tones: [F3, A3, C4, F3 * 2] },
    { root: C2, tones: [C4, E4, G3 * 2, C5] },
    { root: G1, tones: [G3, B3, D4, G3 * 2] },
  ]
  const pattern = [0, 1, 2, 3, 2, 1, 2, 3]

  for (let bar = 0; bar < BEATS / 4; bar += 1) {
    const harmony = bars[bar % bars.length]
    for (let beat = 0; beat < 4; beat += 1) {
      const at = (bar * 4 + beat) * BEAT
      add(buffer, at, 0.45, kick())
      // Backbeat on two and four — this is what makes the loop push.
      if (beat % 4 === 1 || beat % 4 === 3) add(buffer, at, 0.3, snare(0.42))
      // Offbeat hat lifts the groove without crowding the kick.
      add(buffer, at + BEAT / 2, 0.08, hat(0.2))
      // Bass on every eighth: root, root, octave, root, with a sine sub under it.
      const eighth = BEAT / 2
      const bassNotes = [harmony.root, harmony.root, harmony.root * 2, harmony.root]
      for (let e = 0; e < 2; e += 1) {
        const note = bassNotes[beat % bassNotes.length]
        add(buffer, at + e * eighth, 0.42, (t) => 0.66 * pluck(note, SAW, 6.5)(t))
        add(buffer, at + e * eighth, 0.45, (t) => 0.34 * Math.sin(TAU * (note / 2) * t) * Math.exp(-t * 5))
      }
      // Sixteenth-note arpeggio over the chord tones, one octave up.
      for (let step = 0; step < 4; step += 1) {
        const tone = harmony.tones[pattern[(beat * 4 + step) % pattern.length]]
        add(buffer, at + step * (BEAT / 4), 0.3, (t) => 0.11 * pluck(tone, WARM, 14)(t))
      }
    }
  }
  return buffer
}

/* -------------------------------------------------------------------------- */
/* rest-window — music-box arpeggio over a barely-there pad                    */
/* -------------------------------------------------------------------------- */
function restWindow() {
  const buffer = new Float32Array(FRAMES)
  add(
    buffer,
    0,
    LOOP_SECONDS,
    chord(
      [
        [snap(A2), 0.12],
        [snap(E3), 0.06],
        [snap(A3), 0.035],
      ],
      1,
      0.5,
    ),
  )

  // Half-note melody with room between the notes — space is the whole point.
  const melody = [A4, C5, E4 * 2, A4, C5, D4 * 2, C5, A4]
  for (let beat = 0; beat < BEATS; beat += 2) {
    const note = melody[beat % melody.length]
    add(buffer, beat * BEAT, 2.2, (t) => 0.085 * pluck(note, BELL, 3.2)(t))
  }
  // A single low answer note every four bars keeps it from floating away.
  for (let beat = 0; beat < BEATS; beat += 16) {
    add(buffer, beat * BEAT, 2.8, (t) => 0.06 * pluck(notes(A2), BELL, 1.6)(t))
  }
  return buffer
}

/* -------------------------------------------------------------------------- */

function finish(buffer, drive = 1, target = 0.5) {
  // Soft saturation: adds density and punch without hard clipping.
  if (drive !== 1) {
    for (let i = 0; i < FRAMES; i += 1) buffer[i] = Math.tanh(buffer[i] * drive)
  }

  let peak = 0
  let sum = 0
  for (let i = 0; i < FRAMES; i += 1) {
    const level = Math.abs(buffer[i])
    if (level > peak) peak = level
    sum += buffer[i] * buffer[i]
  }
  // Each track gets its own ceiling: Push Tempo is the loud one, the other two
  // sit well behind it so switching cards is a real change in weight.
  const gain = peak > 0 ? target / peak : 1
  const pcm = Buffer.alloc(FRAMES * 2)
  for (let i = 0; i < FRAMES; i += 1) {
    const clamped = Math.max(-1, Math.min(1, buffer[i] * gain))
    pcm.writeInt16LE(Math.round(clamped * 32767), i * 2)
  }
  return {
    pcm,
    peak: 0.5,
    rms: Math.sqrt(sum / FRAMES) * gain,
    seam: Math.abs(buffer[0] * gain - buffer[FRAMES - 1] * gain),
  }
}

function wav(pcm) {
  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + pcm.length, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20) // PCM
  header.writeUInt16LE(1, 22) // mono
  header.writeUInt32LE(RATE, 24)
  header.writeUInt32LE(RATE * 2, 28)
  header.writeUInt16LE(2, 32)
  header.writeUInt16LE(16, 34)
  header.write('data', 36)
  header.writeUInt32LE(pcm.length, 40)
  return Buffer.concat([header, pcm])
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio')
mkdirSync(outDir, { recursive: true })

for (const [name, { build, drive, target }] of Object.entries({
  'deep-focus': { build: deepFocus, drive: 1, target: 0.3 },
  'push-tempo': { build: pushTempo, drive: 2.1, target: 0.62 },
  'rest-window': { build: restWindow, drive: 1, target: 0.26 },
})) {
  const { pcm, rms, seam } = finish(build(), drive, target)
  const file = wav(pcm)
  writeFileSync(join(outDir, `${name}.wav`), file)
  console.log(
    `${name}.wav  ${LOOP_SECONDS}s mono ${Math.round(file.length / 1024)} KB  rms ${rms.toFixed(3)}  seam ${seam.toFixed(4)}`,
  )
}

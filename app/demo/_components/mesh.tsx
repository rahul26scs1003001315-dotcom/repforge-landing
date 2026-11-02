'use client'

import { useEffect, useState } from 'react'

/**
 * The shared "biometric canvas" backdrop.
 *
 * `intensity` (0..1) is what makes the rep sandbox work: it pushes a crimson
 * radial glow and the two warm blobs toward full brightness, simulating muscle
 * tension, then relaxes back to deep indigo when it returns to 0.
 *
 * Scroll position drives a slow palette drift so the canvas is never static.
 * Everything runs on transforms and opacity only, so the browser can hand it
 * to the compositor and keep the main thread free for the interactions.
 */
export function Mesh({ intensity = 0 }: { intensity?: number }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const read = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0)
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const heat = Math.min(1, Math.max(0, intensity))

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#05060c]"
    >
      {/* Continuous base wash so no scroll position reads as flat black. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0c1236_0%,#0a0e26_34%,#120b22_64%,#1a0813_88%,#090a14_100%)] opacity-90" />

      {/* Indigo core — drifts down and left as the page scrolls. */}
      <div
        className="absolute top-[-18%] left-[-12%] h-[46rem] w-[46rem] rounded-full bg-indigo-600/45 blur-[110px] animate-mesh will-change-transform"
        style={{ transform: `translate3d(${progress * -8}%, ${progress * 18}%, 0)` }}
      />
      {/* Violet companion — rises as you read. */}
      <div
        className="absolute top-[32%] right-[-16%] h-[40rem] w-[40rem] rounded-full bg-violet-600/35 blur-[120px] animate-mesh-slow will-change-transform"
        style={{ transform: `translate3d(${progress * 12}%, ${progress * -22}%, 0)` }}
      />
      {/* Mid-page anchor — keeps the centre of the page alive. */}
      <div
        className="absolute top-[46%] left-[-10%] h-[34rem] w-[34rem] rounded-full bg-indigo-500/30 blur-[120px] animate-mesh-slow will-change-transform"
        style={{ transform: `translate3d(${progress * 8}%, 0, 0)` }}
      />
      {/* Crimson — the low, late-page accent. */}
      <div
        className="absolute bottom-[-22%] left-[18%] h-[38rem] w-[38rem] rounded-full blur-[120px] animate-mesh will-change-transform"
        style={{
          background: `rgba(225, 29, 72, ${0.22 + heat * 0.3})`,
          transform: `translate3d(${progress * -6}%, ${progress * -10}%, 0) scale(${1 + heat * 0.15})`,
        }}
      />
      {/* Cyan pin-light keeps the palette from going muddy. */}
      <div
        className="absolute top-[6%] right-[24%] h-64 w-64 rounded-full bg-cyan-500/25 blur-[90px] animate-halo will-change-transform"
        style={{ opacity: 0.5 - heat * 0.35 }}
      />

      {/* Tension flash — only visible while a rep is being held. */}
      <div
        className="absolute inset-0 bg-[radial-gradient(65%_55%_at_50%_45%,rgba(244,63,94,0.65),rgba(190,18,60,0.15)_45%,transparent_72%)] mix-blend-screen transition-opacity duration-200"
        style={{ opacity: heat }}
      />

      {/* Fine structural grid, masked at the edges so it reads as depth. */}
      <div className="absolute inset-0 opacity-[0.5] [background-image:linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />

      {/* Vignette keeps type contrast stable wherever a blob happens to drift. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(5,6,12,0.72)_100%)]" />
    </div>
  )
}

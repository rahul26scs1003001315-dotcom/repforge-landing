'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Physics-flavoured entrance. Elements rise, settle and un-blur once, using the
 * spring curve asked for in the brief. Falls back to instantly-visible when the
 * visitor asks for reduced motion, or when IntersectionObserver is missing.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'header'
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (
      typeof IntersectionObserver === 'undefined' ||
      typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -70px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      // @ts-expect-error — the ref type is compatible across the allowed tags.
      ref={ref}
      className={`transform-gpu transition-all duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] motion-reduce:transition-none ${
        shown ? 'translate-y-0 scale-100 opacity-100 blur-0' : 'translate-y-10 scale-[0.98] opacity-0 blur-[2px]'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

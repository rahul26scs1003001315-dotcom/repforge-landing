'use client'

import type { ReactNode } from 'react'
import { trackEvent } from '../lib/track'

/**
 * The APK link, with a counter ping on the way out.
 *
 * The click is recorded before navigation starts and never blocks it: `keepalive`
 * lets the request finish while the download begins, and a failed count is
 * swallowed so the download always works.
 *
 * This counts *download starts*. A website cannot know whether the install
 * finished — Android gives it no signal — so the stats page says "downloads
 * started", not "installs".
 */
export default function DownloadLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  return (
    <a href={href} className={className} onClick={() => trackEvent('dl:apk')} download>
      {children}
    </a>
  )
}

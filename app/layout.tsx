import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RepForge — Free Workout Tracker & Gym Logger',
  description:
    'Log workouts, build routines and track your strength progress with friends. RepForge is a free workout tracker for Android, Apple Watch and WearOS.',
  openGraph: {
    title: 'RepForge — Log Workouts. Get Stronger. Stay Motivated.',
    description:
      'The free workout tracker for building routines, logging every set and watching your progress climb.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#ff5c39',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

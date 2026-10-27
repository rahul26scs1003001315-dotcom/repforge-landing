import React from 'react'

import { HandoffToApp } from '../HandoffToApp'

export const metadata = {
  title: 'Reset your RepForge password',
  robots: { index: false, follow: false },
}

/**
 * Where a password-reset link opens if the app does not claim the https URL first.
 * `HandoffToApp` forwards to `repforge://reset` with the recovery token intact,
 * which is what puts the reset screen in front of the person instead of a page
 * telling them to go and find the app.
 */
export default function ResetPage() {
  return (
    <HandoffToApp
      schemeLink="repforge://reset"
      title="Reset your RepForge password"
      description="This link opens the app so you can choose a new password. It can only be used once and it expires shortly after it was sent."
    />
  )
}

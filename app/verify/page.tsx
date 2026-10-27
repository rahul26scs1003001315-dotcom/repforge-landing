import React from 'react'

import { HandoffToApp } from '../HandoffToApp'

export const metadata = {
  title: 'Confirm your RepForge account',
  robots: { index: false, follow: false },
}

/**
 * Where a confirmation link opens if the app does not claim the https URL first.
 * `HandoffToApp` forwards to `repforge://verify` with the code intact.
 */
export default function VerifyPage() {
  return (
    <HandoffToApp
      schemeLink="repforge://verify"
      title="Confirm your RepForge account"
      description="This link confirms the address you signed up with. It opens in the app, which is the only thing that can finish setting up your account."
    />
  )
}

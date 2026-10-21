import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Delete your RepForge account',
  description:
    'Delete your RepForge account and all training data, in the app or by email. Completed within 30 days.',
}

const CONTACT_EMAIL = 'www.repforge@gmail.com'
const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'RepForge account deletion request'
)}&body=${encodeURIComponent(
  'Please delete my RepForge account and all data associated with it.\n\nAccount email: \n\n(We may reply to confirm the request came from this address.)'
)}`

export default function DeleteAccountPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:py-24">
      <Link
        href="/"
        className="text-sm font-semibold text-brand transition-colors duration-200 hover:text-brand-dark"
      >
        &larr; RepForge
      </Link>

      <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
        Delete your account
      </h1>
      <p className="mt-4 text-base leading-relaxed text-slate-soft">
        You can delete your RepForge account and everything stored with it at any time. There is no
        charge and no reason required.
      </p>

      <div className="mt-10 rounded-2xl border border-hairline bg-wash p-6">
        <h2 className="text-lg font-extrabold tracking-tight">In the app (fastest)</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-base leading-relaxed text-slate-soft">
          <li>Open RepForge and sign in.</li>
          <li>
            Go to <strong>Profile</strong> and scroll to <strong>Delete account</strong>.
          </li>
          <li>
            Tap <strong>Delete account</strong>, then <strong>Delete my account</strong> to confirm.
          </li>
        </ol>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          The account is deleted immediately and you are signed out. Local data on that device is
          cleared at the same time.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-hairline bg-white p-6">
        <h2 className="text-lg font-extrabold tracking-tight">By email</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-soft">
          If you cannot open the app, email us from the address on the account and we will delete it
          for you. Requests are completed within 30 days; usually much sooner.
        </p>
        <a
          href={MAILTO}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-brand-dark"
        >
          Email a deletion request
        </a>
        <p className="mt-3 text-xs text-muted">{CONTACT_EMAIL}</p>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-extrabold tracking-tight">What gets deleted</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-soft">
          <li>Your account identity (email address) and sign-in credentials.</li>
          <li>Your profile: display name, optional phone number and account role.</li>
          <li>Routines, completed workouts, sets, weights, goals and milestones.</li>
          <li>Audit records created by an owner account, and queued offline changes.</li>
          <li>The local copy on the device where deletion is performed.</li>
        </ul>
        <p className="mt-4 text-base leading-relaxed text-slate-soft">
          Exported JSON or CSV backups that you saved elsewhere are not affected, because they never
          reach our servers. They remain under your control.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-extrabold tracking-tight">Before you delete</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-soft">
          Deletion cannot be undone. If you want a copy of your training history, open{' '}
          <strong>Profile → Data backup</strong> in the app and export JSON before confirming.
        </p>
      </section>

      <div className="mt-14 border-t border-hairline pt-6">
        <p className="text-sm text-muted">
          See also the{' '}
          <Link className="font-semibold text-brand" href="/privacy">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </main>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy policy — RepForge',
  description:
    'What RepForge stores, where it is stored, and how to delete it. No ads, no trackers, no third-party analytics.',
}

const EFFECTIVE_DATE = '19 October 2026'
const CONTACT_EMAIL = 'www.repforge@gmail.com'

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:py-24">
      <Link
        href="/"
        className="text-sm font-semibold text-brand transition-colors duration-200 hover:text-brand-dark"
      >
        &larr; RepForge
      </Link>

      <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
        Privacy policy
      </h1>
      <p className="mt-3 text-sm text-muted">Effective {EFFECTIVE_DATE}</p>

      <p className="mt-8 text-base leading-relaxed text-slate-soft">
        RepForge is a strength-training log for Android. This page describes every piece of data the
        app handles. There is no advertising SDK, no third-party analytics and no crash-reporting SDK
        in the build.
      </p>

      <Section title="Who is responsible">
        <p>
          RepForge is developed and operated by an independent developer. For any privacy question
          or request, email{' '}
          <a className="font-semibold text-brand" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>

      <Section title="What is stored on your account">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Account identity:</strong> your email address and a password. Authentication is
            handled by Supabase Auth; the app never reads your password.
          </li>
          <li>
            <strong>Profile:</strong> display name, an optional phone number, and an account role
            (member or owner).
          </li>
          <li>
            <strong>Training data:</strong> routines (exercise, sets, reps), completed workouts
            (date, duration, per-set reps and weights), and goals or milestones you create.
          </li>
          <li>
            <strong>Owner audit log:</strong> when an owner account deletes a record, what was
            deleted and when. Visible only to the owner account.
          </li>
        </ul>
      </Section>

      <Section title="What stays only on your device">
        <ul className="list-disc space-y-2 pl-5">
          <li>A local copy of your routines, history and profile, so the app opens offline.</li>
          <li>The workout in progress, so an interrupted session can be resumed.</li>
          <li>Appearance and notification preferences, and a queue of changes waiting to sync.</li>
        </ul>
        <p>
          None of this leaves the device unless it is part of the account data listed above. The app
          schedules notifications locally; no push server receives a device token.
        </p>
      </Section>

      <Section title="Update checks">
        <p>
          On launch the app asks Expo&apos;s update service (EAS Update) whether a newer JavaScript
          bundle is available. That request carries a random per-install identifier
          (EAS-Client-ID), the app and runtime version, and the platform. It is used only to
          deliver updates: it is not an advertising identifier, is not linked to your account, and
          is not used for analytics. Clearing the app&apos;s data resets it.
        </p>
      </Section>

      <Section title="What is never collected">
        <p>
          Location, contacts, camera, microphone, photos, installed-app lists, advertising
          identifiers, and usage analytics. RepForge does not use Google Analytics, Firebase
          Analytics, Crashlytics or any comparable service.
        </p>
      </Section>

      <Section title="Why the data is processed">
        <ul className="list-disc space-y-2 pl-5">
          <li>To create and secure your account and sign you in.</li>
          <li>To save your routines, workouts and goals and show them back to you.</li>
          <li>To sync changes between your devices and keep the app usable offline.</li>
          <li>To let you restore your own data from a backup you exported.</li>
        </ul>
        <p>
          The data is not used for advertising, profiling or automated decision-making, and it is
          not sold.
        </p>
      </Section>

      <Section title="Who processes it">
        <p>
          Account and training data are hosted in the project&apos;s Supabase database, and app
          updates are delivered by Expo&apos;s EAS Update service; both act as data processors. Data
          is not sold, rented or shared with advertisers. Row-level security restricts every row to
          the account that created it.
        </p>
      </Section>

      <Section title="Security">
        <p>
          Traffic between the app and the backend is encrypted with HTTPS/TLS. Passwords are stored
          as hashes by Supabase Auth and are never readable by the app. Database access rules limit
          every routine, workout and profile row to its owner.
        </p>
      </Section>

      <Section title="Retention and deletion">
        <p>
          Data is kept while your account exists. You can delete your account and all of its data
          from inside the app: <strong>Profile → Delete account → Delete my account</strong>. That
          removes your profile, routines, workout history, goals and audit records.
        </p>
        <p>
          If you cannot open the app, use{' '}
          <Link className="font-semibold text-brand" href="/delete-account">
            the web deletion page
          </Link>{' '}
          or email{' '}
          <a className="font-semibold text-brand" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>{' '}
          from the address on the account. Deletion requests are completed within 30 days. Residual
          copies in encrypted backups are purged within the same period.
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          You can access and correct your data in the app, export a JSON or CSV backup at any time
          from Profile → Data backup, and delete the account as described above. If you are in the
          EEA or UK, you also have the right to object to processing and to lodge a complaint with
          your local data-protection authority.
        </p>
      </Section>

      <Section title="Children">
        <p>
          RepForge is not directed at children under 13, and accounts are not knowingly created for
          them. If you believe a child has created an account, email{' '}
          <a className="font-semibold text-brand" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>{' '}
          and the account will be removed.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          If the data the app handles changes, this page is updated and the effective date above is
          changed. Material changes are noted in the app&apos;s release notes.
        </p>
      </Section>

      <div className="mt-14 border-t border-hairline pt-6">
        <p className="text-sm text-muted">
          Questions? Email{' '}
          <a className="font-semibold text-brand" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-slate-soft">{children}</div>
    </section>
  )
}

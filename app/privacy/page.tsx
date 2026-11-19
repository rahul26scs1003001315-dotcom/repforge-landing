import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy policy — RepForge',
  description:
    'What RepForge stores, where it is stored, and how to delete it. No ads; crash reports and two product events are sent only after you accept the privacy gate.',
}

const EFFECTIVE_DATE = '19 November 2026'
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
        app handles. The app shows no ads and contains no ad-serving SDK; the only Google library in
        it is Google Analytics for Firebase, which records the two product events described below
        with advertising-ID collection switched off. After you agree to the privacy gate, the app
        sends crash reports and three install-funnel events to Sentry, stores one anonymous
        first-open record in RepForge&apos;s database, and sends two product events to Google
        Analytics for Firebase, as described below; nothing is sent before that choice.
      </p>

      <Section title="Who is responsible">
        <p>
          RepForge is developed and published by rahul mandal, an individual developer, whose
          AppGallery developer account is rahul mandal (developer ID hid46314285). The{' '}
          <Link className="font-semibold text-brand" href="/privacy-zh" lang="zh-Hans">
            Chinese version of this policy
          </Link>{' '}
          covers the same ground for readers in the Chinese mainland. For any privacy question or
          request, email{' '}
          <a className="font-semibold text-brand" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>

      <Section title="What is stored on your account">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Account identity:</strong> email address and a password, handled by Supabase
            Auth. The password is never read by the app.
          </li>
          <li>
            <strong>Profile:</strong> display name, an optional phone number, and an account role
            (member or owner).
          </li>
          <li>
            <strong>Training data:</strong> routines (exercise, sets, reps), completed workouts
            (date, duration, per-set reps and weights), and personal goals or milestones you create.
          </li>
          <li>
            <strong>Owner audit log:</strong> when an owner account deletes a record, what was
            deleted and when. Visible only to the owner account.
          </li>
          <li>
            <strong>Usage counters:</strong> for the per-day scan and plan limits, the account id,
            the planning day (YYYY-MM-DD) and a count. No photo, estimate, meal plan or macro figure
            is stored on the server.
          </li>
        </ul>
      </Section>

      <Section title="What is stored only on your device">
        <ul className="list-disc space-y-2 pl-5">
          <li>A local copy of your routines, history and profile so the app opens offline.</li>
          <li>The workout in progress, so an interrupted session can be resumed.</li>
          <li>Appearance and notification preferences, and a queue of changes waiting to sync.</li>
        </ul>
        <p>None of this leaves the device unless it is part of the account data above.</p>
      </Section>

      <Section title="Voice logging">
        <p>
          Voice logging is optional and off until you open the voice sheet. While you record, the
          microphone is open; when you stop, the clip is sent to the RepForge transcription service,
          which forwards it to Google Speech-to-Text and returns the transcript. The audio is held in
          memory for that request and is <strong>not stored</strong>: neither RepForge nor the
          service writes the clip to disk, a database or a log, and Google processes it on
          RepForge&apos;s instructions as a data processor. The transcript is shown back to you in
          the sheet and is not saved unless you log the set yourself — at which point only the
          numbers you confirm are stored with the workout.
        </p>
        <p>
          If you never open the voice sheet, no audio is recorded and the microphone is never
          opened.
        </p>
      </Section>

      <Section title="Meal and body photos">
        <p>
          Two features read a photo, and both start with a tap you make: <strong>Scan a plate</strong>{' '}
          on the Diet tab, and <strong>Estimate from a photo</strong> in the diet questions.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>A meal photo</strong> is sent to the RepForge verification service, which
            forwards it to Google&apos;s Gemini API — or to Cloudflare Workers AI when Gemini is
            unavailable — and returns calories, protein, carbs and fat for the plate. The image is
            held in memory for that request and is <strong>not stored</strong>: it is not written to
            a database, a file, a log or your account, and it is not used to train RepForge models.
          </li>
          <li>
            <strong>A body photo</strong> is handled the same way and returns a rough age, height
            and weight so the fields can be pre-filled. Nothing about your identity is inferred, and
            the estimate is shown to you before it is used.
          </li>
        </ul>
        <p>
          Both providers process the image on RepForge&apos;s instructions as data processors. Your
          account photo library is never read on its own: the app opens the system picker, you choose
          one image, and only that image is sent. If you never open either feature, no photo is read
          and the camera is never opened.
        </p>
      </Section>

      <Section title="Diet and nutrition data">
        <p>
          Your age, sex, height, weight, goal, budget tier and country are used to calculate calorie
          and protein targets. Those numbers, the generated days and the result of each plate scan
          are kept <strong>on your device</strong> so the tab opens instantly and works offline. A
          generated day is written by Cloudflare Workers AI from those numbers; the plan itself is
          not stored on the server. Only the daily usage counters described above are kept there.
        </p>
      </Section>

      <Section title="Update checks">
        <p>
          On launch the app asks RepForge&apos;s own update service, a Worker on Cloudflare, whether
          a newer JavaScript bundle is available. That request carries a random per-install
          identifier (sent in the EAS-Client-ID header that the expo-updates library uses), the app
          and runtime version, and the platform. It is used only to deliver updates: it is not an
          advertising identifier, is not linked to your account, and is not used for analytics.
          Clearing the app&apos;s data resets it.
        </p>
      </Section>

      <Section title="Crash reports and install measurement">
        <p>
          After you agree to the privacy gate, RepForge sends crash and error reports to Sentry
          (Functional Software, Inc.), which processes them on RepForge&apos;s instructions. A report
          contains the error and stack trace, the app version and runtime version, the platform,
          device model and operating system, and a random event id. It does not contain your email,
          name, phone number, routines, workout weights, photos, voice recordings or advertising
          identifier, and it is not linked to your account.
        </p>
        <p>
          The same consent also sends three measurement events to Sentry: <strong>install</strong>,{' '}
          <strong>first saved workout</strong>, and <strong>returned on a later day</strong>. Each
          event carries the app and runtime version, the platform, the number of days since install,
          and — only when the install came from a tagged link on Google Play — the utm_source,
          utm_medium and utm_campaign tags. The raw install referrer is parsed on the phone and
          discarded. No workout content, account identity or device identifier is attached to these
          events.
        </p>
        <p>
          Separately, the same consent writes <strong>one anonymous first-open record</strong> to
          RepForge&apos;s Supabase database: a random per-install id, the first-open time, the
          platform, app and runtime version, the running update id, and the
          utm_source/utm_medium/utm_campaign tags when Play supplies them. It is not linked to your
          account, contains no workout content or advertising id, and is used only to count first
          opens in the owner dashboard. It is not a direct APK download: the website&apos;s{' '}
          <Link className="font-semibold text-brand" href="/download">
            /download
          </Link>{' '}
          counter records button clicks and cannot tell whether an install happened.
        </p>
        <p>
          This measurement is used to understand whether new installs reach their first workout and
          come back, and to fix crashes. Withdrawing consent under{' '}
          <strong>Profile → Privacy and data</strong> stops all future reports; reports already
          received expire from Sentry within 30 days. On a device without Google Play (for example a
          Huawei phone), no install referrer is available and the install event simply has no
          campaign tags.
        </p>
      </Section>

      <Section title="Google Analytics for Firebase">
        <p>
          The same consent also switches on Google Analytics for Firebase, Google&apos;s app-analytics
          service. It receives two product events:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>sign_up</strong> — an account was created on this device.
          </li>
          <li>
            <strong>first_workout</strong> — the first workout saved on this device.
          </li>
        </ul>
        <p>
          Firebase reports each event with the app and runtime version, the platform and the
          app-instance identifier it generates itself.{' '}
          <strong>The advertising ID and the Android device ID (SSAID) are switched off in the
          app&apos;s Firebase configuration</strong>, so neither is read, neither leaves the device,
          and no event can be matched to an ad click. Neither event carries your email, name, phone
          number, routine name, exercise, weight or other training content, your account is never
          identified to Google, and ad personalisation signals are disabled as well. The app itself
          still shows no ads.
        </p>
        <p>
          Collection is compiled off and switched on only when you answer this gate; withdrawing
          consent switches it off again for the rest of the session. Google keeps the events for the
          retention period set in the Firebase project (14 months at most) and processes them on
          RepForge&apos;s instructions. On a phone without Google Play services (for example Huawei),
          Firebase Analytics cannot deliver them and only the Sentry and RepForge paths above are
          used.
        </p>
      </Section>

      <Section title="What is never collected">
        <p>
          Location, contacts, installed-app lists and advertising identifiers are never collected.
          Ad-ID and Android device-ID (SSAID) collection are switched off in the app&apos;s Firebase
          configuration, so the only identifier Google&apos;s analytics SDK attaches is its own
          random app-instance identifier, which is not an advertising identifier and is not linked
          to your account. Beyond the crash reports, the three funnel events, the anonymous
          first-open record and the two Firebase events there is no behavioural analytics, no
          session recording and no screen tracking. The microphone is used for voice logging only,
          as described above, and never runs in the background. Camera and photo access are used only
          for the meal scan and the body estimate described above. The app schedules its
          notifications locally; no push server receives a device token.
        </p>
      </Section>

      <Section title="Sharing">
        <p>
          Training and profile data are stored in the project&apos;s Supabase database, as is the
          anonymous first-open record (with owner-only read access and no account identity). App
          updates are served by RepForge&apos;s own update service on Cloudflare Workers, voice clips
          are transcribed by Google Speech-to-Text, crash and funnel reports are processed by Sentry,
          and the two product events are processed by Google Analytics for Firebase; Supabase,
          Cloudflare, Google and Sentry act as data processors on RepForge&apos;s instructions.
          Because no ad-ID or device-ID collection is enabled, the Firebase events identify an
          installation only by the SDK&apos;s random app-instance identifier; data is never sold or
          rented, and no third party is given your account or training content. Row-level security
          restricts account data to the account that created it; install rows have no account and are
          readable only by the owner.
        </p>
      </Section>

      <Section title="Retention and deletion">
        <p>
          Data is kept while the account exists. You can delete your account and all of its data from
          inside the app: <strong>Profile → Delete account → Delete my account</strong>. That removes
          the profile, routines, workout history, goals and audit records, and clears the local copy
          on the device. The anonymous first-open row is not linked to the account, so it cannot be
          selected for deletion; it is kept only as a count and contains no email, workout content or
          advertising id.
        </p>
        <p>
          If you cannot open the app, use{' '}
          <Link className="font-semibold text-brand" href="/delete-account">
            the web request page
          </Link>{' '}
          or email{' '}
          <a className="font-semibold text-brand" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>{' '}
          from the address on the account. Requests are actioned within 30 days, and residual copies
          in encrypted backups are purged within the same period. Sentry crash and funnel reports are
          not linked to an account, are retained for 30 days and then deleted automatically;
          withdrawing consent stops new reports immediately. The two Firebase events are likewise not
          linked to an account and expire on the project&apos;s retention setting (14 months at
          most); withdrawing consent stops new events immediately, and uninstalling the app removes
          the Firebase app-instance identifier with it.
        </p>
      </Section>

      <Section title="Consent and withdrawing it">
        <p>
          Before the app loads your account it shows this policy with an unticked box. Nothing is
          collected and no account data is sent until you tick the box and choose{' '}
          <strong>Agree and continue</strong>. Choosing not to agree — 不同意并退出 — closes the app:
          no account is created, no request is made, and nothing is collected.
        </p>
        <p>
          You can withdraw consent at any time from{' '}
          <strong>Profile → Privacy and data → Withdraw privacy consent</strong>. The app clears the
          recorded consent, stops sending data and returns to the notice, where you can agree again.
          Withdrawing does not affect processing carried out before you withdrew, and it does not
          delete your account — your routines, workouts and profile are kept until you delete them,
          which you can do at any time as described above.
        </p>
        <p>
          If you are in the People&apos;s Republic of China, the Personal Information Protection Law
          also gives you the right to know and decide how your personal information is handled, to
          access and copy it, to correct it, to delete it, and to withdraw consent — all of which the
          app and the pages above support.
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

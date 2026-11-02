import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'RepForge 隐私政策',
  description:
    'RepForge 会处理哪些数据、存放在哪里、如何删除。无广告、无第三方统计、无崩溃上报。',
}

const EFFECTIVE_DATE = '2026 年 11 月 2 日'
const CONTACT_EMAIL = 'www.repforge@gmail.com'

export default function PrivacyPageZh() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:py-24">
      <Link
        href="/"
        className="text-sm font-semibold text-brand transition-colors duration-200 hover:text-brand-dark"
      >
        &larr; RepForge
      </Link>

      <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
        RepForge 隐私政策
      </h1>
      <p className="mt-3 text-sm text-muted">
        生效日期：{EFFECTIVE_DATE} ·{' '}
        <Link className="font-semibold text-brand" href="/privacy">
          English version
        </Link>
      </p>

      <p className="mt-8 text-base leading-relaxed text-slate-soft">
        RepForge 是一款面向 Android 的力量训练记录应用。本页说明应用处理哪些数据、为什么处理、存放在哪里，以及你如何删除它们。应用内没有广告
        SDK、没有第三方统计分析、没有崩溃上报 SDK。
      </p>

      <Section title="责任方">
        <p>
          RepForge 由个人开发者 rahul mandal（拉胡尔·曼达尔）开发并运营，AppGallery 开发者账号为
          rahul mandal（ID：hid46314285）。任何隐私问题或请求，请发送邮件至{' '}
          <a className="font-semibold text-brand" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          。
        </p>
      </Section>

      <Section title="账户中存储的数据">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>账户身份：</strong>电子邮箱地址与密码。认证由 Supabase Auth
            处理，应用不读取你的密码。
          </li>
          <li>
            <strong>个人资料：</strong>昵称、可选的手机号，以及账户角色（成员或所有者）。
          </li>
          <li>
            <strong>训练数据：</strong>
            训练计划（动作、组数、次数）、已完成的训练（日期、时长、每组次数与重量），以及你创建的目标或里程碑。
          </li>
          <li>
            <strong>所有者审计日志：</strong>
            所有者账户删除记录时留下的内容与时间，仅对该所有者账户可见。
          </li>
        </ul>
      </Section>

      <Section title="仅保存在本机的数据">
        <ul className="list-disc space-y-2 pl-5">
          <li>训练计划、历史记录与个人资料的本地副本，使应用可以离线打开。</li>
          <li>进行中的训练，以便中断后继续。</li>
          <li>外观与通知设置，以及等待同步的变更队列。</li>
        </ul>
        <p>
          除上述账户数据外，这些内容不会离开设备。通知由本机排程，没有推送服务器接收设备令牌。
        </p>
      </Section>

      <Section title="更新检查">
        <p>
          启动时应用会向 Expo 的更新服务（EAS Update）询问是否有新的 JavaScript
          包。该请求携带一个随机的安装标识（EAS-Client-ID）、应用与运行时版本、平台信息，仅用于下发更新，不是广告标识，不与账户关联，也不用于统计分析。清除应用数据会重置该标识。
        </p>
      </Section>

      <Section title="语音记录">
        <p>
          语音记录为可选功能，只有在你打开语音面板时才会启用。录音期间麦克风处于开启状态；停止录音后，音频片段会发送到
          RepForge 的转写服务，由其转发给 Google Speech-to-Text 并返回文字结果。
        </p>
        <p>
          音频仅在该请求期间保存在内存中，<strong>不会被存储</strong>
          ：RepForge 与该服务都不会把片段写入磁盘、数据库或日志。转写结果回显在面板中，只有你确认记录该组时，确认的数值才会随训练一起保存。如果从不打开语音面板，就不会录制任何音频。
        </p>
      </Section>

      <Section title="从不收集的内容">
        <p>
          位置、通讯录、相机、相册、已安装应用列表、广告标识符以及使用行为统计。麦克风仅用于上述语音记录，且不会在后台运行。RepForge
          不使用 Google Analytics、Firebase Analytics、Crashlytics 或任何同类服务。
        </p>
      </Section>

      <Section title="处理目的">
        <ul className="list-disc space-y-2 pl-5">
          <li>创建并保护你的账户，完成登录。</li>
          <li>保存你的训练计划、训练记录与目标，并展示给你。</li>
          <li>在你的设备之间同步变更，并让应用可离线使用。</li>
          <li>让你从自己导出的备份中恢复数据。</li>
          <li>在你使用语音记录时，把口述的一组转写为文字。</li>
        </ul>
        <p>数据不用于广告、画像或自动化决策，也不会被出售。</p>
      </Section>

      <Section title="处理者">
        <p>
          账户与训练数据托管在本项目的 Supabase 数据库；应用更新由 Expo 的 EAS Update
          服务下发；语音片段由 Google Speech-to-Text
          转写。三者均按 RepForge
          的指示作为数据处理者行事。数据不出售、不出租、不与广告商共享。行级安全策略确保每一行数据只属于创建它的账户。
        </p>
      </Section>

      <Section title="安全">
        <p>
          应用与后端之间的通信使用 HTTPS/TLS 加密。密码由 Supabase Auth
          以哈希形式保存，应用无法读取。数据库访问规则将每个训练计划、训练记录与个人资料限制在其所有者。
        </p>
      </Section>

      <Section title="保留与删除">
        <p>
          数据在账户存在期间保留。你可以在应用内删除账户及其全部数据：
          <strong>我的 → 删除账户 → 删除我的账户</strong>
          。这会移除个人资料、训练计划、训练历史、目标与审计记录。
        </p>
        <p>
          如果无法打开应用，请使用{' '}
          <Link className="font-semibold text-brand" href="/delete-account">
            网页删除页面
          </Link>
          ，或用账户邮箱发邮件至{' '}
          <a className="font-semibold text-brand" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          。删除请求会在 30 天内完成，加密备份中的残留副本也会在同一期限内清除。
        </p>
      </Section>

      <Section title="你的权利">
        <p>
          你可以在应用内访问并更正数据，随时从「我的 →
          数据备份」导出 JSON 或 CSV 备份，并按上述方式删除账户。依据《中华人民共和国个人信息保护法》，你有权查阅、复制、更正、删除你的个人信息，也有权撤回同意；撤回同意后可再次进入应用的隐私同意页面重新选择。撤回同意不影响撤回前基于同意已进行的处理。
        </p>
      </Section>

      <Section title="儿童">
        <p>
          RepForge 不面向 13 岁以下儿童，也不会在知情情况下为其创建账户。如你认为有儿童创建了账户，请发送邮件至{' '}
          <a className="font-semibold text-brand" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          ，该账户将被删除。
        </p>
      </Section>

      <Section title="政策变更">
        <p>
          如果应用处理的数据发生变化，本页会更新并修改上方的生效日期。重大变更会在应用的更新说明中注明，并在应用内重新征求同意。
        </p>
      </Section>

      <div className="mt-14 border-t border-hairline pt-6">
        <p className="text-sm text-muted">
          有疑问？请发送邮件至{' '}
          <a className="font-semibold text-brand" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          。英文版本：
          <Link className="font-semibold text-brand" href="/privacy">
            /privacy
          </Link>
          。
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

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'RepForge 隐私政策',
  description:
    'RepForge 会处理哪些数据、存放在哪里、如何删除。无广告；崩溃上报与两个产品事件仅在你同意隐私提示后发送。',
}

const EFFECTIVE_DATE = '2026 年 11 月 19 日'
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
        RepForge 是一款面向 Android 的力量训练记录应用。本页说明应用处理哪些数据、为什么处理、存放在哪里，以及你如何删除它们。应用不展示广告，也没有投放广告的
        SDK；其中唯一的 Google 库是 Google Analytics for Firebase（Firebase
        分析），它记录下文所述的两个产品事件，且已关闭广告标识符采集。在你同意隐私提示后，应用会向
        Sentry 发送崩溃报告和三个安装漏斗事件，在 RepForge
        的数据库中写入一条匿名的首次打开记录，并向 Google Analytics for Firebase
        发送两个产品事件；在你做出该选择之前，不发送任何内容。
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
            <strong>账户身份：</strong>电子邮箱地址与密码，由 Supabase Auth
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
          <li>
            <strong>用量计数：</strong>
            用于每日扫描与生成计划的限额记录：账户标识、计划日期（YYYY-MM-DD）与次数。服务器不保存照片、估算结果、饮食计划或宏量营养素数值。
          </li>
        </ul>
      </Section>

      <Section title="仅保存在本机的数据">
        <ul className="list-disc space-y-2 pl-5">
          <li>训练计划、历史记录与个人资料的本地副本，使应用可以离线打开。</li>
          <li>进行中的训练，以便中断后继续。</li>
          <li>外观与通知设置，以及等待同步的变更队列。</li>
        </ul>
        <p>除上述账户数据外，这些内容不会离开设备。</p>
      </Section>

      <Section title="语音记录">
        <p>
          语音记录为可选功能，只有在你打开语音面板时才会启用。录音期间麦克风处于开启状态；停止录音后，音频片段会发送到
          RepForge 的转写服务，由其转发给 Google Speech-to-Text 并返回文字结果。音频仅在该请求期间保存在内存中，
          <strong>不会被存储</strong>
          ：RepForge 与该服务都不会把片段写入磁盘、数据库或日志；Google
          按 RepForge 的指示作为数据处理者处理该音频。转写结果回显在面板中，只有你确认记录该组时，确认的数值才会随训练一起保存。
        </p>
        <p>如果从不打开语音面板，就不会录制任何音频，麦克风也不会被打开。</p>
      </Section>

      <Section title="餐食与身材照片">
        <p>
          有两个功能会读取照片，且都由你主动点击开始：饮食页的<strong>扫描餐盘</strong>，以及饮食问答中的
          <strong>用照片估算</strong>。
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>餐食照片</strong>会发送到 RepForge
            的验证服务，由其转发给 Google 的 Gemini API（Gemini
            不可用时改为 Cloudflare Workers AI），返回该餐盘的热量、蛋白质、碳水与脂肪。图像仅在该请求期间保存在内存中，
            <strong>不会被存储</strong>
            ：不会写入数据库、文件、日志或你的账户，也不会用于训练 RepForge 的模型。
          </li>
          <li>
            <strong>身材照片</strong>
            以相同方式处理，返回大致的年龄、身高与体重以预填字段；应用不会据此推断你的身份，估算结果在使用前会先展示给你。
          </li>
        </ul>
        <p>
          两家服务商均按 RepForge 的指示作为数据处理者处理图像。应用不会自行读取你的相册：它打开系统选择器，你选择一张图片，只发送这一张。如果你从不使用这两个功能，就不会读取照片，相机也不会被打开。
        </p>
      </Section>

      <Section title="饮食与营养数据">
        <p>
          你的年龄、性别、身高、体重、目标、预算档位与国家用于计算热量与蛋白质目标。这些数值、生成的每日安排以及每次扫描的结果都
          <strong>保存在你的设备上</strong>
          ，因此该页可以立即打开并离线使用。每日安排由 Cloudflare Workers AI
          根据这些数值生成；计划本身不保存在服务器上，服务器只保存上文所述的每日用量计数。
        </p>
      </Section>

      <Section title="更新检查">
        <p>
          启动时，应用会向 RepForge 自己的更新服务（部署在 Cloudflare Workers
          上）询问是否有新的 JavaScript 包。该请求携带一个随机的安装标识（由 expo-updates
          通过 EAS-Client-ID 请求头发送）、应用与运行时版本、平台信息。它仅用于下发更新：不是广告标识，不与账户关联，也不用于统计分析。清除应用数据会重置该标识。
        </p>
      </Section>

      <Section title="崩溃上报与安装统计">
        <p>
          在你同意隐私提示后，RepForge 会向 Sentry（Functional Software,
          Inc.）发送崩溃与错误报告，由其按 RepForge
          的指示处理。报告包含错误与堆栈、应用版本与运行时版本、平台、设备型号与操作系统版本，以及一个随机事件
          ID。报告不包含你的邮箱、昵称、手机号、训练计划、训练重量、照片、语音或广告标识符，也不与你的账户关联。
        </p>
        <p>
          同一项同意还会向 Sentry
          发送三个统计事件：<strong>安装</strong>、<strong>首次保存训练</strong>、<strong>后续日期回访</strong>。每个事件携带应用与运行时版本、平台、安装至今天数，以及（仅当安装来自 Google
          Play 上带标记的链接时）utm_source、utm_medium、utm_campaign
          三个标记。原始安装来源参数在手机上解析后即被丢弃。这些事件不附带任何训练内容、账户身份或设备标识符。
        </p>
        <p>
          另外，同一项同意会在 RepForge 的 Supabase
          数据库中写入<strong>一条匿名的首次打开记录</strong>：随机安装标识、首次打开时间、平台、应用与运行时版本、当时运行中的更新
          ID，以及 Play 提供的 utm_source/utm_medium/utm_campaign
          标记。该记录不与你的账户关联，不含训练内容或广告标识，仅用于在所有者看板中统计首次打开次数。它不是直接下载
          APK 的计数：网站的{' '}
          <Link className="font-semibold text-brand" href="/download">
            /download
          </Link>{' '}
          只记录按钮点击，无法得知是否真的安装。
        </p>
        <p>
          这些统计用于了解新安装是否走到第一次训练、是否会再次回来，以及用于修复崩溃。你可以在
          <strong>我的 → 隐私与数据</strong>
          撤回同意，撤回后不再发送任何新报告；已收到的报告会在 30
          天内在 Sentry 中过期删除。在没有 Google Play
          的设备上（例如华为手机），无法获得安装来源参数，安装事件只是不带推广标记。
        </p>
      </Section>

      <Section title="Google Analytics for Firebase">
        <p>
          同一项同意还会开启 Google Analytics for Firebase（Google
          的应用分析服务）。它接收两个产品事件：
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>sign_up</strong>——在本机创建了账户。
          </li>
          <li>
            <strong>first_workout</strong>——在本机保存了第一次训练。
          </li>
        </ul>
        <p>
          Firebase 随每个事件记录应用与运行时版本、平台，以及它自行生成的 app-instance
          标识。<strong>应用已在 Firebase 配置中关闭广告标识符与 Android 设备标识符（SSAID）的采集</strong>
          ，因此两者都不会被读取、不会离开设备，任何事件也无法与广告点击关联。两个事件都不携带你的邮箱、昵称、手机号、训练计划名称、动作、重量或其他训练内容；你的账户从不会被识别给
          Google，广告个性化信号也已关闭。应用本身仍然不展示任何广告。
        </p>
        <p>
          采集在编译期即关闭，只有你同意本提示后才会开启；撤回同意后会在本次会话剩余时间内再次关闭。Google
          按 Firebase 项目设置的保留期保存这些事件（最长 14
          个月），并按 RepForge 的指示处理。在没有 Google Play 服务的手机上（例如华为），Firebase
          分析无法送达，只会使用上文所述的 Sentry 与 RepForge 两条通道。
        </p>
      </Section>

      <Section title="从不收集的内容">
        <p>
          位置、通讯录、已安装应用列表与广告标识符都不会被收集。应用已在 Firebase
          配置中关闭 Ad-ID 与 Android 设备标识符（SSAID）的采集，因此 Google
          分析 SDK 唯一附加的标识是它自己生成的随机 app-instance
          标识，它不是广告标识符，也不与你的账户关联。除崩溃报告、三个漏斗事件、匿名首次打开记录与两个
          Firebase
          事件之外，没有其他行为统计、没有会话录制、也没有页面跟踪。麦克风仅用于上述语音记录，且不会在后台运行；相机与相册仅用于上述餐食扫描与身材估算。通知由本机排程，没有推送服务器接收设备令牌。
        </p>
      </Section>

      <Section title="处理目的">
        <ul className="list-disc space-y-2 pl-5">
          <li>创建并保护你的账户，完成登录。</li>
          <li>保存你的训练计划、训练记录与目标，并展示给你。</li>
          <li>在你的设备之间同步变更，并让应用可离线使用。</li>
          <li>让你从自己导出的备份中恢复数据。</li>
          <li>在你使用语音记录时，把口述的一组转写为文字。</li>
          <li>在你使用餐食扫描或身材估算时，识别照片中的内容并给出估算。</li>
          <li>在你同意后，了解新安装是否走到第一次训练并修复崩溃（Sentry）。</li>
          <li>在你同意后，统计账户创建与首次保存训练（Google Analytics for Firebase）。</li>
        </ul>
        <p>数据不用于广告、画像或自动化决策，也不会被出售。</p>
      </Section>

      <Section title="处理者">
        <p>
          账户与训练数据、以及匿名的首次打开记录托管在本项目的 Supabase 数据库（该记录仅所有者可读，且不含账户身份）；应用更新由
          RepForge 自建的 Cloudflare Workers
          更新服务下发；语音片段由 Google Speech-to-Text 转写；照片由 Google Gemini 或
          Cloudflare Workers AI 识别；崩溃与漏斗报告由 Sentry 处理；两个产品事件由 Google
          Analytics for Firebase 处理。Supabase、Cloudflare、Google 与 Sentry
          均按 RepForge
          的指示作为数据处理者行事。由于未开启广告标识符或设备标识符采集，Firebase
          事件仅通过 SDK 的随机 app-instance 标识识别安装；数据不出售、不出租，也不会把你的账户或训练内容提供给任何第三方。行级安全策略确保账户数据只属于创建它的账户。
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
          。这会移除个人资料、训练计划、训练历史、目标与审计记录，并清除设备上的本地副本。匿名的首次打开记录不与账户关联，因此无法随账户一起选择删除；它只作为计数保留，不含邮箱、训练内容或广告标识。
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
          。删除请求会在 30 天内完成，加密备份中的残留副本也会在同一期限内清除。Sentry
          的崩溃与漏斗报告不与账户关联，保留 30
          天后自动删除，撤回同意后立即停止新的上报。两个 Firebase
          事件同样不与账户关联，按项目的保留设置过期（最长 14
          个月）；撤回同意后立即停止发送，卸载应用会一并移除 Firebase 的 app-instance 标识。
        </p>
      </Section>

      <Section title="同意与撤回">
        <p>
          在加载你的账户之前，应用会展示本政策并提供一个默认未勾选的复选框。在你勾选并选择「同意并继续」之前，不收集任何数据，也不发送任何账户数据。选择不同意（不同意并退出）会关闭应用：不创建账户、不发出任何请求、不收集任何内容。
        </p>
        <p>
          你可以随时从<strong>我的 → 隐私与数据 → 撤回隐私同意</strong>撤回同意。应用会清除已记录的同意、停止发送数据并回到提示页，你可以再次同意。撤回不影响撤回前已进行的处理，也不会删除你的账户——训练计划、训练记录与个人资料会保留到你主动删除为止。
        </p>
        <p>
          依据《中华人民共和国个人信息保护法》，你有权知悉并决定你的个人信息如何处理，有权查阅、复制、更正、删除，也有权撤回同意；本应用及上述页面均支持这些权利。
        </p>
      </Section>

      <Section title="你的权利">
        <p>
          你可以在应用内访问并更正数据，随时从「我的 →
          数据备份」导出 JSON 或 CSV 备份，并按上述方式删除账户。如果你位于欧洲经济区或英国，你还有权反对处理，并向当地数据保护机构投诉。
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

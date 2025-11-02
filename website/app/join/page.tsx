import { RoleTypeCard } from "@/components/RoleTypeCard";
import { ChecklistItem } from "@/components/ChecklistItem";
import { StepCard } from "@/components/StepCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ContactPlaceholder } from "@/components/ContactPlaceholder";
import fs from "fs/promises";
import path from "path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "加入我们 - We Are ESAP",
  description: "加入 ESAP，成为这个科幻世界的一部分。愿 ESAP 与你同在。",
};

async function getJoinData() {
  try {
    const filePath = path.join(process.cwd(), "data", "join", "content.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("获取加入我们数据失败:", error);
    return null;
  }
}

export default async function JoinPage() {
  const data = await getJoinData();

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">加载失败</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero 区域 */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            加入我们
          </h1>

          <blockquote className="text-2xl text-esap-yellow font-semibold italic">
            "{data.hero.quote}"
          </blockquote>

          <div className="w-24 h-1 bg-gradient-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto my-8" />

          <p className="text-lg text-foreground/80">{data.hero.welcome}</p>

          <div className="max-w-2xl mx-auto">
            <p className="text-foreground/70 mb-4">或许你正在寻找：</p>
            <ul className="space-y-2">
              {data.hero.seeking.map((item: string, i: number) => (
                <li
                  key={i}
                  className="text-foreground/70 flex items-center justify-center gap-2"
                >
                  <span className="text-esap-pink">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xl font-semibold text-foreground mt-8">
            {data.hero.callToAction}
          </p>
        </div>
      </section>

      {/* 谁适合加入？ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            谁适合加入？
          </h2>

          {/* 角色类型 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {data.roleTypes.map((role: any, index: number) => (
              <RoleTypeCard key={role.title} role={role} index={index} />
            ))}
          </div>

          {/* 欢迎 vs 不欢迎 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-green-500/5 rounded-xl p-6 border border-green-500/20">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="text-green-500">✅</span>
                我们欢迎…
              </h3>
              <ul className="space-y-3">
                {data.welcome.positive.map((item: string, i: number) => (
                  <ChecklistItem
                    key={i}
                    text={item}
                    type="positive"
                    index={i}
                  />
                ))}
              </ul>
            </div>

            <div className="bg-red-500/5 rounded-xl p-6 border border-red-500/20">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="text-red-500">❌</span>
                我们不欢迎…
              </h3>
              <ul className="space-y-3">
                {data.welcome.negative.map((item: string, i: number) => (
                  <ChecklistItem
                    key={i}
                    text={item}
                    type="negative"
                    index={i}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 参与方式 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            参与方式
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.participationMethods.map((method: any, index: number) => (
              <div
                key={method.title}
                className="bg-background rounded-xl p-6 border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{method.icon}</span>
                  <h3 className="text-xl font-bold text-foreground">
                    {method.title}
                  </h3>
                </div>
                <p className="text-sm text-foreground/70 mb-4">
                  {method.description}
                </p>
                <ul className="space-y-2">
                  {method.items.map((item: string, i: number) => (
                    <li
                      key={i}
                      className="text-sm text-foreground/70 flex items-start gap-2"
                    >
                      <span className="text-esap-blue mt-1">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {method.note && (
                  <p className="text-xs text-esap-yellow mt-4 italic">
                    {method.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 创建角色流程 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
            创建角色流程
          </h2>
          <p className="text-center text-foreground/70 mb-12">
            如果你想创建自己的角色加入 ESAP 世界，按照以下步骤进行：
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.characterCreationSteps.map((step: any, index: number) => (
              <StepCard key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 创作指南 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            创作指南
          </h2>

          {/* 核心原则 */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-esap-yellow">
              核心原则
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.guidelines.principles.map(
                (principle: any, index: number) => (
                  <div
                    key={principle.title}
                    className="bg-background rounded-xl p-6 border border-border"
                  >
                    <h4 className="text-lg font-bold text-foreground mb-2">
                      {principle.title}
                    </h4>
                    {principle.quote && (
                      <blockquote className="text-sm text-esap-pink italic mb-2">
                        "{principle.quote}"
                      </blockquote>
                    )}
                    <p className="text-sm text-foreground/70">
                      {principle.description}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* 注意事项 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                技术设定注意事项
              </h3>
              <div className="space-y-4">
                <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
                  <h4 className="font-semibold text-foreground mb-2">
                    ✅ 可以做的：
                  </h4>
                  <ul className="space-y-1">
                    {data.guidelines.technical.dos.map(
                      (item: string, i: number) => (
                        <li
                          key={i}
                          className="text-sm text-foreground/70 flex items-start gap-2"
                        >
                          <span className="text-green-500 mt-1">•</span>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/20">
                  <h4 className="font-semibold text-foreground mb-2">
                    ❌ 不建议做的：
                  </h4>
                  <ul className="space-y-1">
                    {data.guidelines.technical.donts.map(
                      (item: string, i: number) => (
                        <li
                          key={i}
                          className="text-sm text-foreground/70 flex items-start gap-2"
                        >
                          <span className="text-red-500 mt-1">•</span>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-foreground">
                角色创作注意事项
              </h3>
              <div className="space-y-4">
                <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
                  <h4 className="font-semibold text-foreground mb-2">
                    ✅ 推荐：
                  </h4>
                  <ul className="space-y-1">
                    {data.guidelines.character.recommended.map(
                      (item: string, i: number) => (
                        <li
                          key={i}
                          className="text-sm text-foreground/70 flex items-start gap-2"
                        >
                          <span className="text-green-500 mt-1">•</span>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/20">
                  <h4 className="font-semibold text-foreground mb-2">
                    ❌ 避免：
                  </h4>
                  <ul className="space-y-1">
                    {data.guidelines.character.avoid.map(
                      (item: string, i: number) => (
                        <li
                          key={i}
                          className="text-sm text-foreground/70 flex items-start gap-2"
                        >
                          <span className="text-red-500 mt-1">•</span>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 社区文化 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            社区文化
          </h2>

          {/* 核心价值观 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {data.communityValues.map((value: any, index: number) => (
              <div
                key={value.title}
                className="bg-muted rounded-xl p-6 border border-border"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{value.icon}</span>
                  <h3 className="text-xl font-bold text-foreground">
                    {value.title}
                  </h3>
                </div>
                {value.quote && (
                  <blockquote className="text-sm text-esap-pink italic mb-2 border-l-2 border-esap-pink/30 pl-3">
                    "{value.quote}"
                  </blockquote>
                )}
                <p className="text-sm text-foreground/70">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          {/* 社区口号 */}
          <div className="bg-gradient-to-br from-esap-yellow/5 via-esap-pink/5 to-esap-blue/5 rounded-xl p-8 border border-border text-center">
            <h3 className="text-xl font-bold text-foreground mb-6">社区口号</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">问候语</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {data.slogans.greetings.map((greeting: string, i: number) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-background rounded-full text-esap-yellow font-semibold"
                    >
                      {greeting}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">精神标语</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {data.slogans.mottos.map((motto: string, i: number) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-background rounded-full text-esap-pink font-semibold"
                    >
                      {motto}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 贡献方式 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            贡献方式
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.contributions.map((contribution: any, index: number) => (
              <div
                key={contribution.category}
                className="bg-background rounded-xl p-6 border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{contribution.icon}</span>
                  <h3 className="text-lg font-bold text-foreground">
                    {contribution.category}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {(
                    contribution.types ||
                    contribution.projects ||
                    contribution.activities
                  ).map((item: string, i: number) => (
                    <li
                      key={i}
                      className="text-sm text-foreground/70 flex items-start gap-2"
                    >
                      <span className="text-esap-blue mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                {contribution.channels && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">
                      提交途径：
                    </p>
                    {contribution.channels.map((channel: string, i: number) => (
                      <p key={i} className="text-xs text-foreground/60">
                        • {channel}
                      </p>
                    ))}
                  </div>
                )}
                {contribution.methods && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">
                      贡献方式：
                    </p>
                    {contribution.methods.map((method: string, i: number) => (
                      <p key={i} className="text-xs text-foreground/60">
                        • {method}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系方式 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">
            联系方式
          </h2>
          <p className="text-center text-foreground/70 mb-8">
            更多社区渠道正在筹备中，敬请期待
          </p>
          <ContactPlaceholder />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            常见问题
          </h2>
          <FAQAccordion faqs={data.faq} />
        </div>
      </section>

      {/* 下一步 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">下一步</h2>
          <p className="text-foreground/80 mb-6">
            如果你已经准备好加入，可以：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.nextSteps.map((step: string, index: number) => (
              <div
                key={index}
                className="bg-muted rounded-lg p-4 border border-border"
              >
                <p className="text-sm text-foreground/70">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 结语 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-muted/30">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-foreground/80 leading-relaxed">
            {data.closing.message}
          </p>

          <blockquote className="text-lg text-esap-pink italic border-l-4 border-esap-pink pl-6 py-2 max-w-2xl mx-auto">
            "{data.closing.quote}"
          </blockquote>

          <p className="text-foreground/80 leading-relaxed">
            {data.closing.invitation}
          </p>

          <p className="text-2xl font-bold text-esap-yellow mt-8">
            欢迎来到 ESAP。
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-esap-yellow via-esap-pink to-esap-blue rounded-full mx-auto my-8" />

          <blockquote className="text-foreground/60 italic">
            {data.closing.finalQuote}
          </blockquote>

          <p className="text-xl text-esap-blue font-semibold">
            愿 ESAP 与你同在。
          </p>
        </div>
      </section>
    </main>
  );
}

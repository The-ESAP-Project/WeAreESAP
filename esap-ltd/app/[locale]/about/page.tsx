import { getTranslations, setRequestLocale } from "next-intl/server";
import { AnimatedSection } from "@/components/ui";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const values = t.raw("values.items") as Array<{
    title: string;
    description: string;
  }>;

  const members = t.raw("team.members") as Array<{
    name: string;
    role: string;
  }>;

  const accentColors = [
    { bg: "bg-esap-yellow", border: "border-esap-yellow/20" },
    { bg: "bg-esap-pink", border: "border-esap-pink/20" },
    { bg: "bg-esap-blue", border: "border-esap-blue/20" },
  ];

  const memberColors = ["from-esap-yellow", "from-esap-pink", "from-esap-blue"];

  return (
    <>
      {/* Page Header */}
      <section className="pt-16 md:pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
              About
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              {t("title")}
            </h1>
            <div className="mt-6 w-16 h-1 rounded-full bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue" />
          </AnimatedSection>
        </div>
      </section>

      {/* Mission */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection delay={0.1}>
            <div className="relative pl-6 border-l-2 border-esap-pink/30">
              <h2 className="text-lg font-mono tracking-wide text-muted-foreground uppercase">
                {t("mission.title")}
              </h2>
              <p className="mt-6 text-xl md:text-2xl text-foreground leading-relaxed font-light">
                {t("mission.content")}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
              {t("values.title")}
            </p>
            <div className="mt-2 w-12 h-0.5 bg-linear-to-r from-esap-yellow to-esap-pink" />
          </AnimatedSection>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((item, i) => (
              <AnimatedSection key={item.title} delay={(i + 1) * 0.1}>
                <div
                  className={`relative p-8 rounded-2xl bg-background border ${accentColors[i % 3].border} h-full`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${accentColors[i % 3].bg} mb-6`}
                  />
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
              {t("team.title")}
            </p>
            <div className="mt-2 w-12 h-0.5 bg-linear-to-r from-esap-blue to-esap-pink" />
          </AnimatedSection>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {members.map((member, i) => (
              <AnimatedSection key={member.name} delay={(i + 1) * 0.1}>
                <div className="group p-6 rounded-2xl border border-border hover:border-border/80 transition-colors">
                  <div
                    className={`w-12 h-12 rounded-xl bg-linear-to-br ${memberColors[i % 3]} to-transparent flex items-center justify-center`}
                  >
                    <span className="text-sm font-bold font-mono text-foreground">
                      {member.name.match(/\d{4}/)?.[0] ?? "?"}
                    </span>
                  </div>
                  <p className="mt-5 font-semibold text-foreground font-mono text-sm">
                    {member.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {member.role}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

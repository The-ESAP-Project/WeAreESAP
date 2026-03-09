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

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <AnimatedSection>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("title")}
          </h1>
          <div className="mt-4 w-16 h-1 rounded-full bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue" />
        </AnimatedSection>

        {/* Mission */}
        <AnimatedSection delay={0.1}>
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground">
              {t("mission.title")}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {t("mission.content")}
            </p>
          </section>
        </AnimatedSection>

        {/* Values */}
        <AnimatedSection delay={0.2}>
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground">
              {t("values.title")}
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {values.map((item, i) => {
                const colors = [
                  "border-esap-yellow",
                  "border-esap-pink",
                  "border-esap-blue",
                ];
                return (
                  <div
                    key={item.title}
                    className={`p-5 rounded-xl bg-muted/50 border-l-4 ${colors[i % 3]}`}
                  >
                    <h3 className="font-medium text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </AnimatedSection>

        {/* Team */}
        <AnimatedSection delay={0.3}>
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground">
              {t("team.title")}
            </h2>
            <div className="mt-6 space-y-3">
              {members.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50"
                >
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-esap-yellow via-esap-pink to-esap-blue flex items-center justify-center text-white text-sm font-bold">
                    {member.name.slice(-4, -1)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground font-mono text-sm">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      </div>
    </div>
  );
}

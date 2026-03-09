import { getTranslations, setRequestLocale } from "next-intl/server";
import { AnimatedSection } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { EXTERNAL_LINKS, ROUTES } from "@/lib/constants";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const features = [
    { key: "storytelling", accent: "esap-yellow" },
    { key: "worldbuilding", accent: "esap-pink" },
    { key: "opensource", accent: "esap-blue" },
  ] as const;

  return (
    <>
      {/* Hero - Full viewport */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -right-32 w-96 h-96 rounded-full bg-esap-yellow/5 blur-3xl" />
          <div className="absolute bottom-20 -left-32 w-96 h-96 rounded-full bg-esap-pink/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-esap-blue/3 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
                {t("hero.tagline")}
              </p>
              <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                {t("hero.title")}
              </h1>
              <p className="mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {t("hero.description")}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={ROUTES.products}
                  className="inline-flex items-center px-7 py-3.5 rounded-lg bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  {t("cta.explore")}
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                <a
                  href={EXTERNAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-7 py-3.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors"
                >
                  <svg
                    className="mr-2 w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  {t("cta.github")}
                </a>
              </div>
            </div>
          </AnimatedSection>

          {/* Gradient line decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-esap-pink/20 to-transparent" />
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/40">
          <div className="w-px h-8 bg-linear-to-b from-transparent to-muted-foreground/20" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
              {[
                {
                  label: t("stats.since"),
                  value: t("stats.sinceYear"),
                },
                {
                  label: t("stats.characters"),
                  value: t("stats.charactersCount"),
                },
                {
                  label: t("stats.stories"),
                  value: t("stats.storiesCount"),
                },
                {
                  label: t("stats.opensource"),
                  value: t("stats.opensourceValue"),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="py-8 md:py-10 px-4 md:px-8 text-center"
                >
                  <p className="text-2xl md:text-3xl font-bold text-foreground font-mono">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
              {t("features.sectionTitle")}
            </p>
            <div className="mt-2 w-12 h-0.5 bg-linear-to-r from-esap-yellow to-esap-pink" />
          </AnimatedSection>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.key} delay={i * 0.15}>
                <div className="group relative h-full">
                  {/* Accent dot */}
                  <div
                    className={`w-3 h-3 rounded-full bg-${feature.accent} mb-6`}
                  />
                  <h3 className="text-xl font-semibold text-foreground">
                    {t(`features.${feature.key}.title`)}
                  </h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    {t(`features.${feature.key}.description`)}
                  </p>
                  {/* Bottom accent line on hover */}
                  <div
                    className={`mt-6 h-px bg-${feature.accent}/30 group-hover:bg-${feature.accent} transition-colors duration-500`}
                  />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
              {t("showcase.title")}
            </p>
            <div className="mt-2 w-12 h-0.5 bg-linear-to-r from-esap-pink to-esap-blue" />
          </AnimatedSection>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* We Are ESAP */}
            <AnimatedSection delay={0.1}>
              <a
                href={EXTERNAL_LINKS.weareWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative p-8 md:p-10 rounded-2xl border border-border bg-background hover:border-esap-yellow/50 transition-all duration-300 h-full"
              >
                <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-linear-to-r from-esap-yellow to-esap-yellow-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {t("showcase.weare.title")}
                    </h3>
                    <p className="mt-3 text-muted-foreground">
                      {t("showcase.weare.description")}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-muted-foreground group-hover:text-esap-yellow transition-colors shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17L17 7M17 7H7M17 7v10"
                    />
                  </svg>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <span className="w-2 h-2 rounded-full bg-esap-yellow" />
                  weare.esaps.net
                </div>
              </a>
            </AnimatedSection>

            {/* ESAP Stories */}
            <AnimatedSection delay={0.2}>
              <a
                href={EXTERNAL_LINKS.storyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="group block relative p-8 md:p-10 rounded-2xl border border-border bg-background hover:border-esap-pink/50 transition-all duration-300 h-full"
              >
                <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-linear-to-r from-esap-pink to-esap-pink-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {t("showcase.stories.title")}
                    </h3>
                    <p className="mt-3 text-muted-foreground">
                      {t("showcase.stories.description")}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-muted-foreground group-hover:text-esap-pink transition-colors shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17L17 7M17 7H7M17 7v10"
                    />
                  </svg>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <span className="w-2 h-2 rounded-full bg-esap-pink" />
                  story.esaps.net
                </div>
              </a>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.3}>
            <div className="mt-8 text-center">
              <Link
                href={ROUTES.products}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                {t("showcase.viewAll")}
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Philosophy / Brand Statement */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-snug">
              &ldquo;{t("philosophy.quote")}&rdquo;
            </blockquote>
            <p className="mt-8 text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t("philosophy.description")}
            </p>
            <div className="mt-10 mx-auto w-24 h-1 rounded-full bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue" />
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

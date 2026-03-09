import { getTranslations, setRequestLocale } from "next-intl/server";
import { AnimatedSection } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/lib/constants";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const features = [
    {
      key: "storytelling",
      color: "border-esap-yellow",
    },
    {
      key: "worldbuilding",
      color: "border-esap-pink",
    },
    {
      key: "opensource",
      color: "border-esap-blue",
    },
  ] as const;

  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground font-medium">
              {t("hero.subtitle")}
            </p>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("hero.description")}
            </p>
            {/* Three-color gradient line */}
            <div className="mt-10 mx-auto w-24 h-1 rounded-full bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue" />
          </AnimatedSection>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.key} delay={i * 0.1}>
                <div
                  className={`bg-muted/50 rounded-xl p-6 border-t-2 ${feature.color} h-full`}
                >
                  <h3 className="text-lg font-semibold text-foreground">
                    {t(`features.${feature.key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {t(`features.${feature.key}.description`)}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <Link
              href={ROUTES.products}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity"
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
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

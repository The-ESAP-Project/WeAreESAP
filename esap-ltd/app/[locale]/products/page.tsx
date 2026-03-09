import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AnimatedSection } from "@/components/ui";
import { EXTERNAL_LINKS } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");
  return {
    title: `${t("title")} - ESAP`,
    description: t("projects.weare.description"),
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");

  return (
    <>
      {/* Page Header */}
      <section className="pt-16 md:pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-sm font-mono tracking-widest text-muted-foreground uppercase">
              Projects
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              {t("title")}
            </h1>
            <div className="mt-6 w-16 h-1 rounded-full bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue" />
          </AnimatedSection>
        </div>
      </section>

      {/* Project Cards */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* We Are ESAP */}
          <AnimatedSection delay={0.1}>
            <a
              href={EXTERNAL_LINKS.weareWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative p-8 md:p-12 rounded-2xl border border-border bg-background hover:border-esap-yellow/50 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-linear-to-r from-esap-yellow to-esap-yellow-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-3 h-3 rounded-full bg-esap-yellow" />
                    <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
                      {t("projects.weare.badge")}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {t("projects.weare.title")}
                  </h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl">
                    {t("projects.weare.description")}
                  </p>
                  <p className="mt-6 text-xs font-mono text-muted-foreground">
                    weare.esaps.net
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-esap-yellow transition-colors shrink-0">
                  {t("projects.weare.link")}
                  <svg
                    className="w-4 h-4"
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
              </div>
            </a>
          </AnimatedSection>

          {/* ESAP Stories */}
          <AnimatedSection delay={0.2}>
            <a
              href={EXTERNAL_LINKS.storyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative p-8 md:p-12 rounded-2xl border border-border bg-background hover:border-esap-pink/50 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-linear-to-r from-esap-pink to-esap-pink-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-3 h-3 rounded-full bg-esap-pink" />
                    <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
                      {t("projects.stories.badge")}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {t("projects.stories.title")}
                  </h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl">
                    {t("projects.stories.description")}
                  </p>
                  <p className="mt-6 text-xs font-mono text-muted-foreground">
                    story.esaps.net
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-esap-pink transition-colors shrink-0">
                  {t("projects.stories.link")}
                  <svg
                    className="w-4 h-4"
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
              </div>
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* Open Source */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center max-w-xl mx-auto">
              <div className="w-3 h-3 rounded-full bg-esap-blue mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {t("opensource.title")}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {t("opensource.description")}
              </p>
              <a
                href={EXTERNAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                {t("opensource.link")}
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

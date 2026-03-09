import { getTranslations, setRequestLocale } from "next-intl/server";
import { AnimatedSection } from "@/components/ui";
import { EXTERNAL_LINKS } from "@/lib/constants";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");

  const projects = [
    {
      key: "weare",
      url: EXTERNAL_LINKS.weareWebsite,
      color: "border-esap-yellow",
      badgeColor: "bg-esap-yellow/10 text-esap-yellow-dark",
    },
    {
      key: "stories",
      url: EXTERNAL_LINKS.storyWebsite,
      color: "border-esap-pink",
      badgeColor: "bg-esap-pink/10 text-esap-pink-dark",
    },
  ] as const;

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

        {/* Project Cards */}
        <div className="mt-12 space-y-6">
          {projects.map((project, i) => (
            <AnimatedSection key={project.key} delay={i * 0.1}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-6 rounded-xl bg-muted/50 border-l-4 ${project.color} hover:bg-muted/80 transition-colors group`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-foreground">
                        {t(`projects.${project.key}.title`)}
                      </h2>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${project.badgeColor}`}
                      >
                        {t(`projects.${project.key}.badge`)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {t(`projects.${project.key}.description`)}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1 shrink-0">
                    {t(`projects.${project.key}.link`)}
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </span>
                </div>
              </a>
            </AnimatedSection>
          ))}
        </div>

        {/* Open Source */}
        <AnimatedSection delay={0.3}>
          <section className="mt-12 p-6 rounded-xl border border-border text-center">
            <h2 className="text-lg font-semibold text-foreground">
              {t("opensource.title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("opensource.description")}
            </p>
            <a
              href={EXTERNAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              {t("opensource.link")}
            </a>
          </section>
        </AnimatedSection>
      </div>
    </div>
  );
}

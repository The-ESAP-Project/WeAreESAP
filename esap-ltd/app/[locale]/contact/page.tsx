import { getTranslations, setRequestLocale } from "next-intl/server";
import { AnimatedSection } from "@/components/ui";
import { EXTERNAL_LINKS } from "@/lib/constants";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <AnimatedSection>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("title")}
          </h1>
          <div className="mt-4 w-16 h-1 rounded-full bg-linear-to-r from-esap-yellow via-esap-pink to-esap-blue" />
          <p className="mt-6 text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </AnimatedSection>

        {/* Contact Channels */}
        <div className="mt-12 space-y-4">
          {/* Email */}
          <AnimatedSection delay={0.1}>
            <div className="p-6 rounded-xl bg-muted/50 border-l-4 border-esap-yellow">
              <h2 className="font-semibold text-foreground">
                {t("channels.email.label")}
              </h2>
              <a
                href={`mailto:${t("channels.email.value")}`}
                className="mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
              >
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {t("channels.email.value")}
              </a>
            </div>
          </AnimatedSection>

          {/* GitHub */}
          <AnimatedSection delay={0.2}>
            <div className="p-6 rounded-xl bg-muted/50 border-l-4 border-esap-blue">
              <h2 className="font-semibold text-foreground">
                {t("channels.github.label")}
              </h2>
              <a
                href={EXTERNAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                {t("channels.github.value")}
              </a>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("channels.github.description")}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}

import {
  aboutFacts,
  aboutIntro,
  aboutPrinciples,
  aboutStory,
} from "@/content/about"
import { buildMetadata, organizationJsonLd } from "@/lib/seo"
import { Container } from "@/components/primitives/container"
import { PageField } from "@/components/primitives/page-field"
import { Section } from "@/components/primitives/section"
import { SectionHeading } from "@/components/primitives/section-heading"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { Metrics } from "@/components/sections/metrics"
import { Cta } from "@/components/sections/cta"

export const metadata = buildMetadata({
  // The root layout appends " — Aurelius", so the brand is not repeated here.
  title: "About",
  description:
    "Built by people who worked the desk in aesthetic clinics and beauty studios. Why Aurelius escalates instead of guessing, and what we will not automate.",
  path: "/about",
})

export default function AboutPage() {
  return (
    <>
      {/* The Organization node lives here as well as on the home page: /about
          is the URL search engines and LLMs resolve an entity against, so it
          is the page most likely to be cited for "who makes Aurelius". */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
      />

      <PageField>
        <Section>
          <Container>
            <SectionHeading
              as="h1"
              headingId="about-heading"
              eyebrow={aboutIntro.eyebrow}
              title={aboutIntro.title}
              description={aboutIntro.description}
            />

            <Reveal>
              <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="flex flex-col gap-6 lg:col-span-7">
                  {aboutStory.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 24)}
                      className="text-base leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Facts, not a stat wall: the numbers that need context sit on
                    /studios next to the studios that produced them. */}
                <dl className="flex flex-col gap-6 self-start rounded-2xl border border-border bg-card p-7 shadow-xs lg:col-span-5">
                  {aboutFacts.map((fact) => (
                    <div key={fact.label} className="flex flex-col gap-1">
                      <dt className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
                        {fact.label}
                      </dt>
                      <dd className="text-lg font-medium">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </Container>
        </Section>
      </PageField>

      <Section spacing="compact" aria-labelledby="principles-heading">
        <Container>
          <SectionHeading
            headingId="principles-heading"
            eyebrow="How we build"
            title="Four things we will not trade away"
          />

          <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            {aboutPrinciples.map((principle) => (
              <RevealItem key={principle.id} className="bg-card p-7 sm:p-9">
                <h3 className="text-base font-medium">{principle.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {principle.body}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Metrics />
      <Cta />
    </>
  )
}

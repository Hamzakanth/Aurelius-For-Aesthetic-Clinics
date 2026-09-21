import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { siteConfig } from "@/config/site"
import {
  careersIntro,
  careersValues,
  hiringProcess,
  openRoles,
} from "@/content/careers"
import { buildMetadata } from "@/lib/seo"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/primitives/container"
import { PageField } from "@/components/primitives/page-field"
import { Section } from "@/components/primitives/section"
import { SectionHeading } from "@/components/primitives/section-heading"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { Cta } from "@/components/sections/cta"

export const metadata = buildMetadata({
  // Suffixed to "Careers — Aurelius" by the root layout's title template.
  title: "Careers",
  description:
    "Join a small team building one product for one industry. How we hire, what we value, and the open roles — with the compensation band written down first.",
  path: "/careers",
})

export default function CareersPage() {
  return (
    <>
      <PageField>
        <Section>
          <Container>
            <SectionHeading
              as="h1"
              headingId="careers-heading"
              eyebrow={careersIntro.eyebrow}
              title={careersIntro.title}
              description={careersIntro.description}
            />
          </Container>
        </Section>
      </PageField>

      <Section spacing="compact" aria-labelledby="roles-heading">
        <Container>
          <SectionHeading
            headingId="roles-heading"
            eyebrow="Open roles"
            title="Where we are hiring"
          />

          <Reveal>
            {openRoles.length > 0 ? (
              <ul className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
                {openRoles.map((role) => (
                  <li
                    key={role.id}
                    className="flex flex-col gap-4 border-b border-border p-7 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:p-9"
                  >
                    <div className="flex flex-col gap-2">
                      <h3 className="text-base font-medium">{role.title}</h3>
                      <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                        {role.summary}
                      </p>
                      <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
                        {role.team} &middot; {role.location} &middot; {role.type}
                      </p>
                    </div>

                    <Button variant="outline" asChild className="sm:shrink-0">
                      <a
                        href={`mailto:${siteConfig.links.email}?subject=${encodeURIComponent(
                          `Application: ${role.title}`
                        )}`}
                      >
                        Apply
                        <ArrowRight />
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              /* An empty list is the honest state between hires, and it is
                 still the page's best conversion moment — so it asks for the
                 intro rather than apologising and stopping. */
              <div className="mt-12 rounded-2xl border border-border bg-card p-9 shadow-xs sm:p-12">
                <p className="text-base leading-relaxed">
                  No open roles at the moment.
                </p>
                <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
                  We read every introduction anyway, and we have hired twice
                  from mail that arrived on a week like this one. Tell us what
                  you have built and which part of the front desk you would
                  want to own.
                </p>
                <Button className="mt-7" asChild>
                  <a href={`mailto:${siteConfig.links.email}?subject=${encodeURIComponent("Introduction")}`}>
                    Write to us
                    <ArrowRight />
                  </a>
                </Button>
              </div>
            )}
          </Reveal>
        </Container>
      </Section>

      <Section spacing="compact" aria-labelledby="values-heading">
        <Container>
          <SectionHeading
            headingId="values-heading"
            eyebrow="What it is like"
            title="How the team actually works"
          />

          <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            {careersValues.map((value) => (
              <RevealItem key={value.id} className="bg-card p-7 sm:p-9">
                <h3 className="text-base font-medium">{value.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {value.body}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section spacing="compact" aria-labelledby="process-heading">
        <Container>
          <SectionHeading
            headingId="process-heading"
            eyebrow="Hiring"
            title="Four steps, about two weeks"
            description="You will know where you stand at every point, and you will never wait on us over a weekend."
          />

          <RevealGroup className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {hiringProcess.map((step, index) => (
              <RevealItem key={step.id} className="flex flex-col gap-3">
                <span className="font-mono text-xs tracking-[0.14em] text-accent uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-medium">{step.title}</h3>
                <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          <p className="mt-12 text-sm text-muted-foreground">
            Questions before you apply?{" "}
            <Link
              href="/about"
              className="font-medium text-foreground underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
            >
              Read why we built this
            </Link>{" "}
            or write to{" "}
            <a
              href={`mailto:${siteConfig.links.email}`}
              className="font-medium text-foreground underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
            >
              {siteConfig.links.email}
            </a>
            .
          </p>
        </Container>
      </Section>

      <Cta />
    </>
  )
}

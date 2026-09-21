"use client"

import dynamic from "next/dynamic"

import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { SectionHeading } from "@/components/primitives/section-heading"
import { Reveal } from "@/components/motion/reveal"
import { Skeleton } from "@/components/ui/skeleton"

// Recharts is heavy and below the fold — keep it out of the initial bundle.
const CoverageChart = dynamic(
  () => import("@/components/charts/coverage-chart").then((m) => m.CoverageChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-72 w-full" />,
  }
)

/**
 * The page's dark beat, and now a single exhibit rather than two.
 *
 * The four headline figures that used to sit above this chart are the page's
 * opening claim — they belong in <ProofBand />, high up, where they can do the
 * work of persuading someone to keep reading. What is left here is the thing
 * that cannot be said as a number: the shape of the handover, month by month,
 * as Aurelius takes the workload off the team.
 *
 * `data-surface="ink"` re-resolves every token beneath it — the card, the
 * hairlines, the muted copy, the chart series and the gold — so nothing inside
 * this subtree had to be told it is on a dark ground.
 */
export function Metrics() {
  return (
    <Section
      id="metrics"
      data-surface="ink"
      aria-labelledby="metrics-heading"
      className="border-y border-border bg-background text-foreground"
    >
      <Container>
        <SectionHeading
          headingId="metrics-heading"
          eyebrow="Outcomes"
          title="The handover, month by month"
          description="A representative two-location studio through its first eight months. Aggregated customer data, medians rather than best cases."
          align="center"
        />

        <Reveal className="mt-14">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
            <h3 className="text-base font-semibold">
              Enquiries and bookings: handled by Aurelius vs. your team
            </h3>
            <p className="mt-1 mb-8 text-sm text-muted-foreground">
              Front-of-house contacts per month, by who answered them.
            </p>
            <CoverageChart />
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

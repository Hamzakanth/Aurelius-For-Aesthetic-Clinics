"use client"

import CountUp from "react-countup"
import { useReducedMotion } from "framer-motion"

import { metrics } from "@/content/metrics"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { RevealGroup, RevealItem } from "@/components/motion/reveal"

/**
 * The numbers, immediately after the logos and before a single feature is
 * named.
 *
 * An owner's second question — right after "who else uses this" — is "what did
 * it actually do for them". Answering it this high up means every section below
 * is read as explanation rather than as a pitch still trying to establish that
 * the thing works.
 *
 * Deliberately austere: no cards, no icons, no borders. Four columns separated
 * by hairlines on a bare ivory ground, with the number given display size and
 * the gold reserved for the unit. The restraint is the argument — a figure that
 * needs a card to be believed reads as marketing.
 */
export function ProofBand() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <Section spacing="compact" aria-labelledby="proof-heading">
      <Container>
        <h2
          id="proof-heading"
          className="text-center font-mono text-xs font-normal tracking-[0.14em] text-muted-foreground uppercase"
        >
          Median results across 600+ studios
        </h2>

        <RevealGroup className="mt-12 grid gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
          {metrics.map((metric, i) => (
            <RevealItem
              key={metric.id}
              className={
                // Hairline between columns rather than around each cell. The
                // rule is dropped on the first item of each row, which at four
                // breakpoint-dependent widths is easier to express as "every
                // column except the ones that start a row".
                "px-6 text-center " +
                (i % 2 === 0 ? "sm:border-l-0 " : "sm:border-l sm:border-border ") +
                (i === 0 ? "lg:border-l-0" : "lg:border-l lg:border-border")
              }
            >
              <p className="font-display text-display-md font-medium tracking-[-0.03em] tabular-nums">
                {metric.prefix}
                {shouldReduceMotion ? (
                  metric.value.toFixed(metric.decimals ?? 0)
                ) : (
                  <CountUp
                    end={metric.value}
                    decimals={metric.decimals ?? 0}
                    duration={1.8}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                )}
                <span className="text-accent">{metric.suffix}</span>
              </p>

              <p className="mt-3 text-sm font-semibold">{metric.label}</p>
              <p className="mx-auto mt-1.5 max-w-[22ch] text-sm leading-relaxed text-muted-foreground">
                {metric.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  )
}

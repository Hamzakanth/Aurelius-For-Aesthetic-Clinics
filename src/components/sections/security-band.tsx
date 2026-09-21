import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"

import { trustSignals } from "@/content/features"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"

/**
 * Security, as its own beat.
 *
 * These four signals used to live in a grey strip stapled to the bottom of the
 * features section, which is where a reader who is worried about client photos
 * and medical questionnaires is least likely to look for them. Given a section
 * of their own — sitting straight after the testimonials, where trust is the
 * thing already on the reader's mind — they read as a position rather than as
 * small print.
 *
 * Two columns: the claim on the left, the evidence on the right. The four
 * signals are a definition list because that is what they are — a term and the
 * thing it means.
 */
export function SecurityBand() {
  return (
    <Section
      id="security"
      aria-labelledby="security-heading"
      className="border-y border-border bg-muted/30"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <p className="flex items-center gap-2.5 font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
              <span aria-hidden className="h-px w-6 bg-accent" />
              Trust
            </p>

            <h2
              id="security-heading"
              className="mt-4 text-display-sm font-semibold"
            >
              Secure by design, not by promise
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Your clients hand you medical histories and photographs of their
              faces. Aurelius treats that as the most sensitive data in the
              business, because it is.
            </p>

            <Button variant="outline" className="mt-7" asChild>
              <Link href="/security">
                How we handle client data
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>

          {/* Hairline seams via a 1px gap over a border-coloured ground: four
              cells share edges the way panes in a frame do, instead of each
              carrying its own outline and doubling up. */}
          <RevealGroup className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            {trustSignals.map((signal) => (
              <RevealItem key={signal.label} className="bg-card p-6">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent-subtle">
                  <Lock aria-hidden className="size-4 text-accent" />
                </span>
                <p className="mt-4 text-sm font-semibold">{signal.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {signal.detail}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Container>
    </Section>
  )
}

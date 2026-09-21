import { features } from "@/content/features"
import { cn } from "@/lib/utils"
import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { SectionHeading } from "@/components/primitives/section-heading"
import { RevealGroup, RevealItem } from "@/components/motion/reveal"

/**
 * Coverage grid — the whole job, on one screen.
 *
 * This is the section the page was missing. Before it, the features only ever
 * appeared one at a time inside the interactive showcase below, which is a fine
 * way to prove *one* job but a poor way to establish scope: a reader who does
 * not click never learns that there are five. So the overview comes first and
 * states the surface area, and the showcase that follows goes deep on it.
 *
 * Five cards over a six-column grid: three across the top, two across the
 * bottom at half the width again. The uneven row is deliberate — five equal
 * cards in a 3+2 grid leaves a hole, and stretching to six would mean inventing
 * a capability to fill it.
 */
export function Coverage() {
  return (
    <Section id="coverage" aria-labelledby="coverage-heading">
      <Container>
        <SectionHeading
          headingId="coverage-heading"
          eyebrow="Coverage"
          title="Every front-desk job, covered"
          description="Five roles your team currently splits between the phone, the diary and the group chat. Turn them on one at a time or all at once."
          align="center"
        />

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            // The final two cards take three columns each so the bottom row
            // fills the measure without a phantom sixth capability.
            const isWide = i >= 3

            return (
              <RevealItem
                key={feature.id}
                className={cn(
                  "group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7",
                  "transition-[box-shadow,transform,border-color] duration-[--duration-base] ease-[--ease-out]",
                  "hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-md",
                  isWide ? "lg:col-span-3" : "lg:col-span-2"
                )}
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent-subtle">
                  <Icon aria-hidden className="size-[1.15rem] text-accent" />
                </span>

                <p className="mt-5 font-mono text-[0.6875rem] tracking-[0.14em] text-muted-foreground uppercase">
                  {feature.eyebrow}
                </p>

                <h3 className="mt-2 text-lg leading-snug font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>

                {/* Pushed to the foot of the card so the impact figures line up
                    across a row whatever the description length. */}
                <p className="mt-6 flex items-center gap-2 border-t border-border pt-4 text-sm font-medium tabular-nums">
                  <span aria-hidden className="h-px w-4 bg-accent" />
                  {feature.impact}
                </p>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </Container>
    </Section>
  )
}

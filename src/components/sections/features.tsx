import { Container } from "@/components/primitives/container"
import { Section } from "@/components/primitives/section"
import { SectionHeading } from "@/components/primitives/section-heading"
import { FeatureShowcase } from "@/components/sections/feature-showcase"
import { FeatureShowcaseMobile } from "@/components/sections/feature-showcase-mobile"

/**
 * The showcase, now that <Coverage /> above has already named the five jobs.
 * This section's only argument is that they actually happen, so it is heading
 * plus device and nothing else — the trust strip that used to be bolted to the
 * bottom of it is <SecurityBand /> further down, where a reader looking for it
 * can find it.
 */
export function Features() {
  return (
    <Section id="features" aria-labelledby="features-heading">
      <Container>
        <SectionHeading
          headingId="features-heading"
          eyebrow="In the client's hands"
          title="Watch a job get done"
          description="Pick one of the five and see exactly what your client sees — the same words, the same channel, the same timing."
          align="center"
        />

        {/* Not five static cards but one device doing all five jobs. Two
            layouts, because the shape of that idea is different on each: a
            control/display split on a wide screen, one swipeable card per job
            on a phone. Each owns its own motion, autoplay and reduced-motion
            fallbacks, and only the visible one runs its timer. */}
        <FeatureShowcase />
        <FeatureShowcaseMobile />
      </Container>
    </Section>
  )
}

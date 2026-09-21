import { faqs } from "@/content/faq"
import { faqJsonLd, organizationJsonLd } from "@/lib/seo"
import { Hero } from "@/components/sections/hero"
import { LogoCloud } from "@/components/sections/logo-cloud"
import { ProofBand } from "@/components/sections/proof-band"
import { Coverage } from "@/components/sections/coverage"
import { Features } from "@/components/sections/features"
import { HowItWorks } from "@/components/sections/how-it-works"
import { Metrics } from "@/components/sections/metrics"
import { Testimonials } from "@/components/sections/testimonials"
import { SecurityBand } from "@/components/sections/security-band"
import { Pricing } from "@/components/sections/pricing"
import { Faq } from "@/components/sections/faq"
import { Cta } from "@/components/sections/cta"

/**
 * Home page order: claim, proof, scope, depth, close.
 *
 *   Hero        the promise, centred, over a framed plate
 *   LogoCloud   who already runs on it
 *   ProofBand   what it did for them — four numbers, no cards
 *   Coverage    the scope of the job, five cards on one screen
 *   Features    one of those jobs, happening, in the client's hands
 *   HowItWorks  what adopting it costs you
 *   Metrics     the handover curve, on the dark beat
 *   Testimonials in their words
 *   SecurityBand where the client data goes
 *   Pricing / Faq / Cta
 *
 * The rhythm alternates deliberately: every stretch of persuasion is followed by
 * a stretch of evidence, and the two full-bleed bands (Metrics, Cta) are the
 * only dark surfaces, spaced far enough apart to read as punctuation.
 */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Values are authored constants, not user input.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationJsonLd(), faqJsonLd(faqs)]),
        }}
      />

      <Hero />
      <LogoCloud />
      <ProofBand />
      <Coverage />
      <Features />
      <HowItWorks />
      <Metrics />
      <Testimonials />
      <SecurityBand />
      <Pricing />
      <Faq />
      <Cta />
    </>
  )
}

import type { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { absoluteUrl } from "@/lib/utils"

interface BuildMetadataOptions {
  title?: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
}

/**
 * Single source of page metadata. Pages pass only what differs; everything
 * else — OG, Twitter, canonical, robots — is derived so it cannot go stale.
 */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image = siteConfig.ogImage,
  noIndex = false,
}: BuildMetadataOptions = {}): Metadata {
  const url = absoluteUrl(path)
  // The root layout owns the "— Aurelius" suffix via its title template, so
  // pages pass the bare title. OG and Twitter get the suffixed form, since
  // the template does not apply to those.
  const suffixedTitle = title ? `${title} — ${siteConfig.name}` : undefined

  return {
    // Spread over the root layout's `title` config, so an explicit `undefined`
    // here would erase the default/template and ship a page with no <title>.
    // Omit the key instead and let the layout's default stand.
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title: suffixedTitle ?? siteConfig.seoTitle,
      description,
      locale: siteConfig.locale,
      images: [{ url: absoluteUrl(image), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: suffixedTitle ?? siteConfig.seoTitle,
      description,
      images: [absoluteUrl(image)],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

/** Organization + SoftwareApplication JSON-LD for the home page. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.company.legalName,
    alternateName: siteConfig.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon.svg"),
    description: siteConfig.description,
    foundingDate: String(siteConfig.company.foundedYear),
    sameAs: [
      siteConfig.links.x,
      siteConfig.links.instagram,
      siteConfig.links.linkedin,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: siteConfig.links.email,
      availableLanguage: ["English"],
    },
  }
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }
}

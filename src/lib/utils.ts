import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { siteConfig } from "@/config/site"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Absolute URL against the canonical origin. Required for OG tags + sitemap. */
export function absoluteUrl(path = "/") {
  // Already absolute — a post banner hosted elsewhere, say. Prefixing the site
  // origin would produce a URL that resolves to nothing.
  if (/^https?:\/\//.test(path)) return path

  // Single origin, single guard: siteConfig validates NEXT_PUBLIC_SITE_URL at
  // import time, so canonical/OG/schema URLs cannot silently stay on localhost.
  const base = siteConfig.url.replace(/\/$/, "")
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

export function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-US", options).format(value)
}

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

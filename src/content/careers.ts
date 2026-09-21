/**
 * Careers-page copy.
 *
 * `openRoles` is deliberately empty rather than seeded with plausible-sounding
 * postings: a role listed here is a promise to a candidate, and an invented one
 * costs more trust than an empty list does. Add real openings as they exist —
 * the page renders the list when there is one and an honest empty state when
 * there is not. Shape:
 *
 *   { id: "founding-ae", title: "Founding Account Executive",
 *     team: "Go to market", location: "San Francisco or remote (US)",
 *     type: "Full-time",
 *     summary: "One sentence on what the person owns." }
 */

export const careersIntro = {
  eyebrow: "Careers",
  title: "Small team, one industry, no layers.",
  description:
    "We build a single product for a single kind of business. That focus is the job: you will talk to studio owners in your first week and see your work in their diary in your first month.",
} as const

export interface Role {
  id: string
  title: string
  team: string
  location: string
  type: string
  summary: string
}

export const openRoles: Role[] = []

export const careersValues = [
  {
    id: "close",
    title: "Close to the desk",
    body: "Everyone — engineers included — sits in on studio calls. You cannot build a front desk you have never had to work.",
  },
  {
    id: "ship",
    title: "Ship in days",
    body: "Small changes, straight to real studios, with the owner on the other end of the thread. Quarterly roadmaps do not survive contact with a Saturday.",
  },
  {
    id: "own",
    title: "Own the whole thing",
    body: "Problems come to you as an outcome, not a ticket. You choose the approach, and you are the one who watches it land.",
  },
  {
    id: "hours",
    title: "Sane hours, real coverage",
    body: "Our customers work evenings and weekends, so our support does. That is a staffing problem, not a heroics problem, and we staff it.",
  },
] as const

export const hiringProcess = [
  {
    id: "intro",
    title: "Intro call",
    body: "Thirty minutes with the person you would work with. What you have built, what you want next, what this actually is.",
  },
  {
    id: "work",
    title: "A piece of real work",
    body: "A short, paid exercise drawn from something we shipped. No take-home marathons, no whiteboard trivia.",
  },
  {
    id: "team",
    title: "Meet the team",
    body: "Two conversations, one technical and one about how you work with people. You will meet everyone you would see daily.",
  },
  {
    id: "offer",
    title: "Offer",
    body: "Within a week of the last conversation, with the compensation band written down before you ask for it.",
  },
] as const

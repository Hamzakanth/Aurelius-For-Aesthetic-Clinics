/**
 * About-page copy. Kept in content rather than in the page component for the
 * same reason every other section is: an owner-facing sentence gets rewritten
 * ten times more often than the layout around it.
 */

export const aboutIntro = {
  eyebrow: "About",
  title: "We started by answering the phone ourselves.",
  description:
    "Aurelius is built by people who spent two years inside aesthetic clinics, skin studios and nail bars, watching the front desk lose bookings it never knew it had.",
} as const

export const aboutStory = [
  "Every studio we sat in had the same hole in the day. The phone rings while a client is mid-treatment. A DM lands at 9pm. A cancellation opens a Thursday slot that nobody fills because nobody is looking. None of it is a software problem in the usual sense — the diary is fine, the payment terminal is fine. What is missing is somebody at the desk.",
  "The obvious answer was a chatbot, and we built one. It was worse than the voicemail it replaced. It answered questions nobody asked, promised times the diary did not have, and handed the studio a transcript to clean up afterwards. So we stopped building a thing that talks and started building a thing that works a desk: reading the diary, holding the slot, taking the deposit, asking the consultation questions before the chair, and escalating the moment it is unsure.",
  "That last part is the whole product. Aurelius carries a confidence threshold you set. Below it, it does not guess — it routes the conversation to you with its reasoning attached. Every booking, move and charge is logged and reversible. A front desk you cannot audit is not a front desk, it is a liability.",
] as const

export const aboutPrinciples = [
  {
    id: "quiet",
    title: "Quiet by default",
    body: "Software that pings all day is a second job. Aurelius surfaces the handful of decisions that actually need an owner and handles the rest without a notification.",
  },
  {
    id: "reversible",
    title: "Nothing it does is one-way",
    body: "Every action is logged against a client record and can be undone. We would rather be corrected in an afternoon than trusted blindly.",
  },
  {
    id: "voice",
    title: "Your words, not ours",
    body: "The replies are written from your price list, your aftercare and a sample of how your team already answers. Clients should not be able to tell where the desk ends and the software starts.",
  },
  {
    id: "boring",
    title: "Boring where it counts",
    body: "Diaries, deposits and consent records are not the place for clever. They are the place for correct, dull and the same every time.",
  },
] as const

/** Facts only — anything that would need a footnote belongs on /studios,
 *  where the numbers sit next to the studios that produced them. */
export const aboutFacts = [
  { label: "Founded", value: "2021" },
  { label: "Where we are", value: "San Francisco, remote-first" },
  { label: "What we do", value: "One product, one industry" },
] as const

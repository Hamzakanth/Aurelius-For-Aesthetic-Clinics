"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { AlertCircle, CheckCircle2, ChevronDown, Loader2 } from "lucide-react"

import {
  contactSchema,
  TEAM_SIZES,
  type ContactValues,
} from "@/lib/validations/contact"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const MESSAGE_MAX = 1000

// Web3Forms access key — public by design, safe in client code. The free plan
// only accepts browser submissions, so this posts from the client.
const WEB3FORMS_ACCESS_KEY = "1a8a48d8-c512-43c7-a9fd-75aa148e6639"
const SUBMIT_TIMEOUT_MS = 15_000

const FIELD_NAMES = ["name", "email", "company", "teamSize", "message"] as const

/** Label + control + error, wired so the error is announced, not just shown. */
function Field({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="justify-between">
        <span>{label}</span>
        {optional ? (
          <span className="text-xs font-normal text-muted-foreground">
            Optional
          </span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-start gap-1.5 text-sm text-destructive"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/** Replaces the form once submitted. A toast alone is too easy to miss. */
function SuccessPanel({
  firstName,
  onReset,
}: {
  firstName: string
  onReset: () => void
}) {
  const headingRef = React.useRef<HTMLHeadingElement>(null)

  // The submit button just vanished; move focus somewhere meaningful so
  // keyboard and screen-reader users land on the confirmation.
  React.useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div
      role="status"
      className="flex flex-col items-center gap-4 py-10 text-center"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-accent-subtle">
        <CheckCircle2 aria-hidden className="size-7 text-accent" />
      </span>
      <div>
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="text-lg font-semibold outline-none"
        >
          {firstName ? `Thanks, ${firstName} — request received` : "Request received"}
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Someone who has actually set Aurelius up in a studio will reply within
          one business day — usually with a couple of questions about your
          treatment menu before we meet.
        </p>
      </div>

      {/* Sets expectations for the gap between now and the call, which is
          where most "did that send?" emails come from. */}
      <ol className="mx-auto mt-2 flex max-w-sm flex-col gap-3 rounded-xl border border-border bg-muted/30 p-5 text-left">
        {[
          "We read it and check which booking system you run.",
          "You get a reply with two or three times to choose from.",
          "Thirty minutes, on your own diary.",
        ].map((step, i) => (
          <li key={step} className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-[0.6875rem] font-semibold text-accent"
            >
              {i + 1}
            </span>
            <span className="text-sm leading-relaxed text-muted-foreground">
              {step}
            </span>
          </li>
        ))}
      </ol>

      <Button variant="outline" onClick={onReset} className="mt-2">
        Send another request
      </Button>
    </div>
  )
}

export function ContactForm() {
  const [isPending, startTransition] = React.useTransition()
  const [isDone, setIsDone] = React.useState(false)
  const [firstName, setFirstName] = React.useState("")
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const botcheckRef = React.useRef<HTMLInputElement>(null)
  const reduceMotion = useReducedMotion()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    // Validate on blur, then live once a field has already errored — the
    // pattern that avoids yelling at someone mid-keystroke.
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      teamSize: "2-5",
      message: "",
    },
  })

  const messageLength = watch("message")?.length ?? 0

  const onSubmit = (values: ContactValues) => {
    setSubmitError(null)
    startTransition(async () => {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS)

      try {
        const locations =
          TEAM_SIZES.find((o) => o.value === values.teamSize)?.label ??
          values.teamSize

        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: `Walkthrough request — ${values.company}`,
            from_name: "Aurelius website",
            replyto: values.email,
            botcheck: botcheckRef.current?.checked ?? false,
            name: values.name,
            email: values.email,
            company: values.company,
            locations,
            message: values.message,
          }),
        })
        const data = (await res.json().catch(() => null)) as {
          success?: boolean
        } | null

        if (!res.ok || !data?.success) {
          setSubmitError(
            "We couldn't send your request just now. Please try again in a moment, or email us directly."
          )
          return
        }
      } catch (error) {
        setSubmitError(
          error instanceof DOMException && error.name === "AbortError"
            ? "This is taking longer than it should. Please check your connection and try again."
            : "We couldn't reach our server. Please check your connection and try again."
        )
        return
      } finally {
        clearTimeout(timer)
      }

      setFirstName(values.name.split(" ")[0] ?? "")
      reset()
      setIsDone(true)
    })
  }

  // Without this, a failed check looks like a dead button: the only feedback
  // is a small line under one field, possibly out of view.
  const onInvalid = () => {
    setSubmitError("Please fix the highlighted fields above, then send again.")
  }

  // Autofill and password managers can fill inputs without firing change
  // events, leaving react-hook-form validating a stale value. Read what is
  // actually in the DOM before validating.
  const syncAndSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget)
    for (const field of FIELD_NAMES) {
      const value = formData.get(field)
      if (typeof value === "string" && value !== getValues(field)) {
        setValue(field, value as never, { shouldDirty: true })
      }
    }
    return handleSubmit(onSubmit, onInvalid)(event)
  }

  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
      }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isDone ? (
        <motion.div key="done" {...fade}>
          <SuccessPanel
            firstName={firstName}
            onReset={() => setIsDone(false)}
          />
        </motion.div>
      ) : (
        <motion.div key="form" {...fade}>
          {renderForm()}
        </motion.div>
      )}
    </AnimatePresence>
  )

  function renderForm() {
  return (
    <form
      onSubmit={syncAndSubmit}
      noValidate
      aria-busy={isPending}
    >
      {/* Honeypot: hidden from people, irresistible to bots. Web3Forms drops
          any submission where it is checked. */}
      <input
        ref={botcheckRef}
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      {/* Disabling the fieldset locks every control while sending, so the
          request can't be edited or double-submitted mid-flight. */}
      <fieldset
        disabled={isPending}
        className="flex flex-col gap-5 transition-opacity duration-200 disabled:opacity-70"
      >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name" error={errors.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Dana Whitfield"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
        </Field>

        <Field id="email" label="Email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="dana@maisonskin.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="company"
          label="Studio or group"
          error={errors.company?.message}
        >
          <Input
            id="company"
            autoComplete="organization"
            placeholder="Maison Skin"
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? "company-error" : undefined}
            {...register("company")}
          />
        </Field>

        <Field id="teamSize" label="Locations" error={errors.teamSize?.message}>
          {/* Native select for mobile ergonomics; the chevron is drawn on top
              because appearance-none removes the platform one. */}
          <div className="relative">
            <select
              id="teamSize"
              aria-invalid={!!errors.teamSize}
              aria-describedby={errors.teamSize ? "teamSize-error" : undefined}
              className={cn(
                "h-11 w-full cursor-pointer appearance-none rounded-lg border border-input bg-card pr-10 pl-3.5 text-base md:text-sm",
                "shadow-xs transition-[border-color,box-shadow] duration-[--duration-fast]",
                "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none",
                "aria-invalid:border-destructive"
              )}
              {...register("teamSize")}
            >
              {TEAM_SIZES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </Field>
      </div>

      <Field
        id="message"
        label="What are you trying to solve?"
        error={errors.message?.message}
      >
        {/* The example placeholder does the work the hint text used to — it
            shows the shape of a useful answer without adding a line to read. */}
        <Textarea
          id="message"
          rows={4}
          maxLength={MESSAGE_MAX}
          placeholder="We run Fresha across two locations, get about 150 calls and DMs a day, and no-shows on laser are eating our Tuesdays…"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
        {/* Counter only appears once it is plausibly relevant. */}
        {messageLength > MESSAGE_MAX * 0.7 ? (
          <p className="text-right text-xs text-muted-foreground tabular-nums">
            {messageLength} / {MESSAGE_MAX}
          </p>
        ) : null}
      </Field>

      {submitError ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm text-destructive"
        >
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
          <p>{submitError}</p>
        </div>
      ) : null}

      <div className="mt-2 flex flex-col gap-3">
        <Button
          type="submit"
          size="lg"
          variant="accent"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Sending…
            </>
          ) : (
            "Request a walkthrough"
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Used only to contact you about Aurelius. No newsletter, no reselling.
        </p>
      </div>

      </fieldset>

      <p aria-live="polite" className="sr-only">
        {isPending ? "Submitting your request" : ""}
      </p>
    </form>
  )
  }
}

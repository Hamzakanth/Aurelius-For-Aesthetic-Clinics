"use client"

import * as React from "react"
import { AlertCircle, CheckCircle2, ChevronDown, Loader2 } from "lucide-react"

import {
  contactSchema,
  TEAM_SIZES,
  type ContactValues,
} from "@/lib/validations/contact"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const MESSAGE_MAX = 1000

// Web3Forms access key — public by design, safe in client code. The free plan
// only accepts browser submissions, so this posts from the client.
const WEB3FORMS_ACCESS_KEY = "1a8a48d8-c512-43c7-a9fd-75aa148e6639"
const SUBMIT_TIMEOUT_MS = 15_000

type FieldName = keyof ContactValues
type FieldErrors = Partial<Record<FieldName, string>>
type Status = "idle" | "sending" | "done"

/*
 * Deliberately plain: uncontrolled inputs, values read from the DOM with
 * FormData at submit time, validated once with zod. No form library, no
 * animation wrapper and no transforms anywhere near the submit button — the
 * previous version flickered because hover-lift on the button fought the
 * card's 3D tilt, and the button slid out from under the pointer.
 */

function Field({
  id,
  label,
  error,
  children,
}: {
  id: FieldName
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function fieldProps(id: FieldName, errors: FieldErrors) {
  return {
    id,
    name: id,
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? `${id}-error` : undefined,
  }
}

function SuccessPanel({
  firstName,
  onReset,
}: {
  firstName: string
  onReset: () => void
}) {
  const headingRef = React.useRef<HTMLHeadingElement>(null)

  // The submit button just vanished; move focus to the confirmation.
  React.useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div role="status" className="flex flex-col items-center gap-4 py-10 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-accent-subtle">
        <CheckCircle2 aria-hidden className="size-7 text-accent" />
      </span>
      <h3 ref={headingRef} tabIndex={-1} className="text-lg font-semibold outline-none">
        {firstName ? `Thanks, ${firstName} — request received` : "Request received"}
      </h3>
      <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
        Someone who has actually set Aurelius up in a studio will reply within
        one business day — usually with a couple of questions about your
        treatment menu before we meet.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 inline-flex h-10 cursor-pointer items-center rounded-lg border border-input bg-card px-4 text-sm font-medium transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        Send another request
      </button>
    </div>
  )
}

export function ContactForm() {
  const [status, setStatus] = React.useState<Status>("idle")
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [firstName, setFirstName] = React.useState("")
  const [messageLength, setMessageLength] = React.useState(0)
  const formRef = React.useRef<HTMLFormElement>(null)

  const sending = status === "sending"

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return

    const formData = new FormData(event.currentTarget)
    const parsed = contactSchema.safeParse({
      name: formData.get("name") ?? "",
      email: formData.get("email") ?? "",
      company: formData.get("company") ?? "",
      teamSize: formData.get("teamSize") ?? "",
      message: formData.get("message") ?? "",
    })

    if (!parsed.success) {
      const next: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as FieldName
        next[key] ??= issue.message
      }
      setErrors(next)
      setSubmitError("Please fix the highlighted fields above, then send again.")
      const first = Object.keys(next)[0]
      if (first) formRef.current?.querySelector<HTMLElement>(`#${first}`)?.focus()
      return
    }

    const values = parsed.data
    setErrors({})
    setSubmitError(null)
    setStatus("sending")

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS)

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Walkthrough request — ${values.company}`,
          from_name: "Aurelius website",
          replyto: values.email,
          botcheck: formData.get("botcheck") === "on",
          name: values.name,
          email: values.email,
          company: values.company,
          locations:
            TEAM_SIZES.find((o) => o.value === values.teamSize)?.label ??
            values.teamSize,
          message: values.message,
        }),
      })
      const data = (await res.json().catch(() => null)) as { success?: boolean } | null

      if (!res.ok || !data?.success) {
        setSubmitError(
          "We couldn't send your request just now. Please try again in a moment, or email us directly."
        )
        setStatus("idle")
        return
      }
    } catch (error) {
      setSubmitError(
        error instanceof DOMException && error.name === "AbortError"
          ? "This is taking longer than it should. Please check your connection and try again."
          : "We couldn't reach our server. Please check your connection and try again."
      )
      setStatus("idle")
      return
    } finally {
      clearTimeout(timer)
    }

    setFirstName(values.name.split(" ")[0] ?? "")
    setMessageLength(0)
    setStatus("done")
  }

  // Clear a field's error as soon as the person edits it.
  function handleInput(event: React.FormEvent<HTMLFormElement>) {
    const target = event.target as HTMLInputElement
    if (target.name === "message") setMessageLength(target.value.length)
    const name = target.name as FieldName
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  if (status === "done") {
    return <SuccessPanel firstName={firstName} onReset={() => setStatus("idle")} />
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onInput={handleInput}
      noValidate
      aria-busy={sending}
      className="flex flex-col gap-5"
    >
      {/* Honeypot: hidden from people; Web3Forms drops submissions where it is checked. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name" error={errors.name}>
          <Input
            {...fieldProps("name", errors)}
            autoComplete="name"
            placeholder="Dana Whitfield"
            disabled={sending}
          />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <Input
            {...fieldProps("email", errors)}
            type="email"
            autoComplete="email"
            placeholder="dana@maisonskin.com"
            disabled={sending}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="company" label="Studio or group" error={errors.company}>
          <Input
            {...fieldProps("company", errors)}
            autoComplete="organization"
            placeholder="Maison Skin"
            disabled={sending}
          />
        </Field>
        <Field id="teamSize" label="Locations" error={errors.teamSize}>
          <div className="relative">
            <select
              {...fieldProps("teamSize", errors)}
              defaultValue="2-5"
              disabled={sending}
              className={cn(
                "h-11 w-full cursor-pointer appearance-none rounded-lg border border-input bg-card pr-10 pl-3.5 text-base md:text-sm",
                "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none",
                "aria-invalid:border-destructive"
              )}
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

      <Field id="message" label="What are you trying to solve?" error={errors.message}>
        <Textarea
          {...fieldProps("message", errors)}
          rows={4}
          maxLength={MESSAGE_MAX}
          placeholder="We run Fresha across two locations, get about 150 calls and DMs a day, and no-shows on laser are eating our Tuesdays…"
          disabled={sending}
        />
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
        {/* A native button with colour-only hover: nothing here moves, scales
            or animates, so the hit area is exactly where it looks. */}
        <button
          type="submit"
          disabled={sending}
          className="relative z-10 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending ? (
            <>
              <Loader2 aria-hidden className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Request a walkthrough"
          )}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          Used only to contact you about Aurelius. No newsletter, no reselling.
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {sending ? "Submitting your request" : ""}
      </p>
    </form>
  )
}

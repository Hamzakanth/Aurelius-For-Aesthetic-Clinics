"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 cursor-pointer items-start justify-between gap-4 py-5 text-left",
          "text-base font-medium transition-colors duration-[--duration-fast] hover:text-accent",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          className
        )}
        {...props}
      >
        {children}
        <Plus
          aria-hidden
          className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-transform duration-[--duration-base] ease-[--ease-out] group-data-[state=open]:rotate-45"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    // `forceMount` keeps every answer in the served HTML instead of mounting it
    // on open. Without it the FAQPage JSON-LD promises answers the crawler
    // never finds in the DOM, and ~800 words of the page's most persuasive copy
    // ship to nobody. Collapsed state is height only: the animation owns the
    // height while it runs, `h-0` holds it there afterwards.
    <AccordionPrimitive.Content
      forceMount
      data-slot="accordion-content"
      className="overflow-hidden data-[state=closed]:h-0 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div
        className={cn(
          "pb-5 pr-10 text-[0.9375rem] leading-relaxed text-muted-foreground",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

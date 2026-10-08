"use server";

import { z } from "zod";
import { site } from "@/lib/site";

/**
 * Contact form handler.
 *
 * Sends the message through the Resend HTTP API when `RESEND_API_KEY` is set
 * (no SDK needed). Without it, it answers `unconfigured` and the form falls
 * back to opening the visitor's email app (mailto:), so the form always works.
 */

// Not exported: a "use server" module may only export async functions.
const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  company: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(10).max(5000),
});

export type ContactField = "name" | "email" | "message";

export type ContactResult =
  | { status: "sent" }
  | { status: "invalid"; fields: ContactField[] }
  | { status: "unconfigured" }
  | { status: "error" };

export interface ContactInput {
  name: string;
  email: string;
  company?: string;
  message: string;
  /** Honeypot: hidden from people, filled in by naive bots. */
  website?: string;
}

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  // Pretend success to bots so they don't retry.
  if (input.website) return { status: "sent" };

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((i) => i.path[0]))].filter(
      (f): f is ContactField => f === "name" || f === "email" || f === "message",
    );
    return { status: "invalid", fields };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { status: "unconfigured" };

  const { name, email, company, message } = parsed.data;
  const subject = `Portfolio: ${name}${company ? ` (${company})` : ""}`;
  const text = `${message}\n\n— ${name}${company ? `, ${company}` : ""}\n${email}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL ?? site.email],
        reply_to: email,
        subject,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("Contact form: Resend responded", res.status, await res.text().catch(() => ""));
      return { status: "error" };
    }
    return { status: "sent" };
  } catch (error) {
    console.error("Contact form: request failed", error);
    return { status: "error" };
  }
}

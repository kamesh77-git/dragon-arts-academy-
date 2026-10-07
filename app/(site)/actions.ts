"use server";

import { z } from "zod";

import { db } from "@/db";
import { leads } from "@/db/schema";

const leadSchema = z.object({
  studentName: z.string().trim().min(1).max(255),
  age: z.coerce.number().int().min(2).max(100).optional(),
  course: z.string().trim().max(100).optional(),
  parentName: z.string().trim().max(255).optional(),
  phone: z.string().trim().min(6).max(30),
  email: z.union([z.literal(""), z.email().max(255)]).optional(),
  message: z.string().trim().max(2000).optional(),
  sourcePath: z.string().max(255).optional(),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(0).optional(),
});

export type LeadInput = z.input<typeof leadSchema>;

// Saves an enrollment enquiry for the admin Leads inbox. The form also
// opens WhatsApp on the visitor's side, so a failure here never blocks
// the enquiry from reaching the academy.
export async function submitLead(input: LeadInput): Promise<{ ok: boolean }> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  if (parsed.data.website) return { ok: true }; // bot: pretend success

  const { website: _honeypot, email, ...data } = parsed.data;
  void _honeypot;
  try {
    await db.insert(leads).values({ ...data, email: email || null });
    return { ok: true };
  } catch (err) {
    console.error("[submitLead] failed to save lead:", err);
    return { ok: false };
  }
}

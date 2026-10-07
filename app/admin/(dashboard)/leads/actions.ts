"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { leadStatusEnum, leads } from "@/db/schema";
import { requireUser } from "@/lib/admin";

const updateSchema = z.object({
  id: z.uuid(),
  status: z.enum(leadStatusEnum.enumValues),
  notes: z.string().max(5000),
});

export async function updateLead(formData: FormData) {
  await requireUser(["admin", "staff"]);
  const data = updateSchema.parse({
    id: formData.get("id"),
    status: formData.get("status"),
    notes: formData.get("notes") ?? "",
  });
  await db.update(leads).set({ status: data.status, notes: data.notes || null, updatedAt: new Date() }).where(eq(leads.id, data.id));
  revalidatePath("/admin", "layout");
}

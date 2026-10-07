"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUser } from "@/lib/admin";

export type TeamState = { ok: boolean; message: string } | null;

const addSchema = z.object({
  email: z.email().transform((e) => e.trim().toLowerCase()),
  name: z.string().trim().max(255),
  role: z.enum(["admin", "staff"]),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

export async function addTeamMember(_prev: TeamState, formData: FormData): Promise<TeamState> {
  await requireUser("admin");
  const parsed = addSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };

  const existing = await db.query.users.findFirst({ where: eq(users.email, parsed.data.email) });
  if (existing) return { ok: false, message: "That email is already on the team." };

  await db.insert(users).values({
    email: parsed.data.email,
    name: parsed.data.name || null,
    role: parsed.data.role,
    passwordHash: await bcrypt.hash(parsed.data.password, 12),
  });
  revalidatePath("/admin/team");
  return { ok: true, message: `Added ${parsed.data.email}. Share the password with them privately.` };
}

export async function updateRole(formData: FormData) {
  const me = await requireUser("admin");
  const id = z.uuid().parse(formData.get("id"));
  const role = z.enum(["admin", "staff"]).parse(formData.get("role"));
  if (id === me.id) return; // can't demote yourself
  await db.update(users).set({ role }).where(eq(users.id, id));
  revalidatePath("/admin/team");
}

export async function removeTeamMember(formData: FormData) {
  const me = await requireUser("admin");
  const id = z.uuid().parse(formData.get("id"));
  if (id === me.id) return; // can't remove yourself
  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/admin/team");
}

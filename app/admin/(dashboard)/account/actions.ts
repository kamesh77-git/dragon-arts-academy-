"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUser } from "@/lib/admin";

export type PasswordState = { ok: boolean; message: string } | null;

const schema = z
  .object({
    current: z.string().min(1, "Enter your current password"),
    next: z.string().min(8, "New password must be at least 8 characters").max(200),
    confirm: z.string(),
  })
  .refine((d) => d.next === d.confirm, { message: "New passwords don't match" });

export async function changePassword(_prev: PasswordState, formData: FormData): Promise<PasswordState> {
  const me = await requireUser();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };

  const user = me.id ? await db.query.users.findFirst({ where: eq(users.id, me.id) }) : undefined;
  if (!user?.passwordHash) return { ok: false, message: "This account signs in with Google and has no password." };
  if (!(await bcrypt.compare(parsed.data.current, user.passwordHash))) return { ok: false, message: "Current password is incorrect." };

  await db.update(users).set({ passwordHash: await bcrypt.hash(parsed.data.next, 12) }).where(eq(users.id, user.id));
  return { ok: true, message: "Password updated." };
}

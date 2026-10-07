"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { pageSeo } from "@/db/schema";
import { requireUser } from "@/lib/admin";
import { getSitePage } from "@/lib/pages";

const schema = z.object({
  path: z.string().refine((p) => Boolean(getSitePage(p)), "Unknown page"),
  metaTitle: z.string().trim().max(120),
  metaDescription: z.string().trim().max(400),
  focusKeyword: z.string().trim().max(120),
  secondaryKeywords: z.string().max(600),
});

export type SaveState = { ok: boolean; message: string } | null;

export async function savePageSeo(_prev: SaveState, formData: FormData): Promise<SaveState> {
  const user = await requireUser(["admin"]);
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };

  const { path, metaTitle, metaDescription, focusKeyword } = parsed.data;
  const secondaryKeywords = parsed.data.secondaryKeywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 8);

  const values = {
    metaTitle: metaTitle || null,
    metaDescription: metaDescription || null,
    focusKeyword: focusKeyword.toLowerCase() || null,
    secondaryKeywords: secondaryKeywords.length ? secondaryKeywords : null,
    updatedAt: new Date(),
    updatedBy: user.email ?? null,
  };

  await db.insert(pageSeo).values({ path, ...values }).onConflictDoUpdate({ target: pageSeo.path, set: values });
  revalidatePath(path);
  revalidatePath("/sitemap.xml");
  return { ok: true, message: "Saved. The live page now uses these values." };
}

export async function resetPageSeo(formData: FormData) {
  await requireUser(["admin"]);
  const path = String(formData.get("path") ?? "");
  if (!getSitePage(path)) return;
  await db.delete(pageSeo).where(eq(pageSeo.path, path));
  revalidatePath(path);
  revalidatePath("/admin/seo/edit");
}

import type { Metadata } from "next";

import { requireUser } from "@/lib/admin";
import { Card, CardHeader, PageHeader } from "@/components/admin/ui";
import PasswordForm from "./PasswordForm";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const me = await requireUser();
  return (
    <>
      <PageHeader title="My account" subtitle={`${me.email} · ${me.role}`} />
      <Card>
        <CardHeader title="Change password" />
        <PasswordForm />
      </Card>
    </>
  );
}

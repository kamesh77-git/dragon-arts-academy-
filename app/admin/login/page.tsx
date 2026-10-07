import type { Metadata } from "next";
import { Suspense } from "react";

import { googleEnabled } from "@/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy via-[#206374] to-brand-600 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo.webp" alt="" width={64} height={64} className="mx-auto h-16 w-16" />
        <h1 className="mt-4 text-center font-display text-3xl font-bold text-slate-900">Dragon Ryu Admin</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Sign in to manage enquiries and SEO.</p>
        <Suspense>
          <LoginForm googleEnabled={googleEnabled} />
        </Suspense>
      </div>
    </div>
  );
}

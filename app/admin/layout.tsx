import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./admin.css";
import { body, display } from "@/lib/fonts";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Dragon Ryu Admin" },
  robots: { index: false, follow: false },
};

// Separate root layout from the public site so Tailwind (admin) and the
// site's hand-written stylesheet never load on the same page.
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}

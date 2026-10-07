"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Overview", icon: "▦", exact: true },
  { href: "/admin/leads", label: "Enquiries", icon: "✉" },
  { href: "/admin/blog", label: "Blog", icon: "✎" },
  { href: "/admin/seo", label: "SEO (69 rules)", icon: "◎" },
  { href: "/admin/team", label: "Team", icon: "☺", adminOnly: true },
  { href: "/admin/account", label: "My account", icon: "⚙" },
];

export default function Sidebar({ role, newLeads }: { role: "admin" | "staff"; newLeads: number }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {NAV.filter((n) => !n.adminOnly || role === "admin").map((n) => {
        const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span aria-hidden="true" className="w-4 text-center">{n.icon}</span>
            <span className="flex-1">{n.label}</span>
            {n.href === "/admin/leads" && newLeads > 0 && (
              <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-navy">{newLeads}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

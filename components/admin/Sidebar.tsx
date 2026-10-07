"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Role } from "@/lib/rbac";

const NAV: { href: string; label: string; icon: string; roles: Role[]; exact?: boolean }[] = [
  { href: "/admin", label: "Overview", icon: "▦", exact: true, roles: ["admin"] },
  { href: "/admin/leads", label: "Enquiries", icon: "✉", roles: ["admin", "staff"] },
  { href: "/admin/attendance", label: "Attendance", icon: "✓", roles: ["admin", "teacher"] },
  { href: "/admin/students", label: "Students", icon: "☷", roles: ["admin", "teacher"] },
  { href: "/admin/blog", label: "Blog", icon: "✎", roles: ["admin"] },
  { href: "/admin/seo", label: "SEO (69 rules)", icon: "◎", roles: ["admin"] },
  { href: "/admin/team", label: "Team", icon: "☺", roles: ["admin"] },
  { href: "/admin/account", label: "My account", icon: "⚙", roles: ["admin", "staff", "teacher"] },
];

export default function Sidebar({ role, newLeads }: { role: Role; newLeads: number }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {NAV.filter((n) => n.roles.includes(role)).map((n) => {
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

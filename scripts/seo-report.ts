// Prints the 69-rule SEO score for every page, against a running server.
// Usage: npx tsx --conditions=react-server scripts/seo-report.ts [origin] [path-to-detail]
import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const { auditPage } = await import("../lib/seo/audit");
  const { getAllSeoPages } = await import("../lib/page-seo");
  const sitePages = await getAllSeoPages();
  const origin = process.argv[2] ?? "http://localhost:3031";
  const detail = process.argv[3];

  for (const p of sitePages) {
    const a = await auditPage(p.path, origin);
    console.log(`${String(a.audit.overallScore).padStart(3)}  ${a.audit.passedRules}/${a.audit.rules.length}  ${String(a.input.wordCount).padStart(5)}w  ${p.path}${a.error ? `  ERROR ${a.error}` : ""}`);
    if (detail === p.path || detail === "all") {
      for (const r of a.audit.rules.filter((r) => !r.passed)) console.log(`      FAIL ${r.id}: ${r.value} (target ${r.expected})`);
    }
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

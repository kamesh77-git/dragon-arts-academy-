import { buildSchema } from "@/lib/schema";

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSchema()).replace(/</g, "\\u003c") }}
    />
  );
}

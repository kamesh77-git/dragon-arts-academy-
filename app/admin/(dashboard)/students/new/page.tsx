import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { leads } from "@/db/schema";
import { requireUser } from "@/lib/admin";
import { courses } from "@/lib/courses";
import { Card, PageHeader, secondaryButtonClass } from "@/components/admin/ui";
import { NewStudentForm } from "../StudentForms";

export const metadata: Metadata = { title: "Add student" };

// Enquiry form options -> best-guess course slug (admin can change it).
const ENQUIRY_TO_COURSE: Record<string, string> = {
  Karate: "karate-classes-in-mannivakkam",
  Silambam: "silambam-classes-in-mannivakkam",
  "Dance / Bharatham / Zumba": "bharatanatyam-classes-in-mannivakkam",
  Drawing: "drawing-classes-in-mannivakkam",
  Abacus: "abacus-classes-in-mannivakkam",
  "English Spoken / Phonics": "spoken-english-classes-in-mannivakkam",
  "Hindi Spoken / Written": "hindi-classes-in-mannivakkam",
  Yoga: "yoga-classes-in-mannivakkam",
  "Keyboard / Drums / Vocal": "music-classes-in-mannivakkam",
  Handwriting: "handwriting-classes-in-mannivakkam",
};

export default async function NewStudentPage({ searchParams }: PageProps<"/admin/students/new">) {
  await requireUser(["admin"]);
  const { lead: leadParam } = await searchParams;
  const leadId = typeof leadParam === "string" && z.uuid().safeParse(leadParam).success ? leadParam : "";
  const lead = leadId ? await db.query.leads.findFirst({ where: eq(leads.id, leadId) }) : undefined;

  return (
    <>
      <PageHeader
        title="Add student"
        subtitle={lead ? `From the enquiry by ${lead.parentName || lead.studentName}. Saving marks the enquiry as enrolled.` : "Each student gets a roll number (DR-0001) used for attendance."}
        actions={<Link href="/admin/students" className={secondaryButtonClass}>← All students</Link>}
      />
      <Card>
        <NewStudentForm
          leadId={lead?.id ?? ""}
          values={{
            name: lead?.studentName ?? "",
            parentName: lead?.parentName ?? "",
            phone: lead?.phone ?? "",
            email: lead?.email ?? "",
            age: lead?.age ? String(lead.age) : "",
            notes: lead?.message ?? "",
          }}
          courseOptions={courses.map((c) => ({ slug: c.slug, name: c.name }))}
          defaultCourse={(lead?.course && ENQUIRY_TO_COURSE[lead.course]) || ""}
        />
      </Card>
    </>
  );
}

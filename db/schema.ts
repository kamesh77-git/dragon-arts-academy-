import {
  pgTable,
  serial,
  date,
  boolean,
  uniqueIndex,
  pgEnum,
  uuid,
  text,
  varchar,
  integer,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

// ---------- ENUMS ----------

// admin: everything · staff: enquiries only · teacher: attendance for their arts
export const userRoleEnum = pgEnum("user_role", ["admin", "staff", "teacher"]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "visited",
  "enrolled",
  "closed",
]);

// ---------- ADMIN USERS ----------

// Only admin-side accounts for now. Student / parent logins are a later
// phase and will get their own tables rather than a role on this one.
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  passwordHash: text("password_hash"),
  role: userRoleEnum("role").notNull().default("staff"),
  /** Course slugs (lib/courses.ts) a teacher handles. Ignored for other roles. */
  courses: jsonb("courses").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---------- PAGE SEO OVERRIDES ----------

// Every public page ships with default SEO in code (lib/pages.ts). A row
// here overrides any of those fields without a redeploy; null = use default.
export const pageSeo = pgTable("page_seo", {
  path: varchar("path", { length: 255 }).primaryKey(),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  focusKeyword: varchar("focus_keyword", { length: 255 }),
  secondaryKeywords: jsonb("secondary_keywords").$type<string[]>(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  updatedBy: varchar("updated_by", { length: 255 }),
});

// ---------- ENROLLMENT LEADS ----------

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentName: varchar("student_name", { length: 255 }).notNull(),
    age: integer("age"),
    course: varchar("course", { length: 100 }),
    parentName: varchar("parent_name", { length: 255 }),
    phone: varchar("phone", { length: 30 }).notNull(),
    email: varchar("email", { length: 255 }),
    message: text("message"),
    sourcePath: varchar("source_path", { length: 255 }),
    status: leadStatusEnum("status").notNull().default("new"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("leads_status_idx").on(t.status), index("leads_created_idx").on(t.createdAt)]
);

// ---------- BLOG ----------

export const postStatusEnum = pgEnum("post_status", ["draft", "published"]);

export interface PostFaq {
  q: string;
  a: string;
}

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    title: varchar("title", { length: 200 }).notNull(),
    excerpt: text("excerpt").notNull().default(""),
    /** Markdown body (GitHub-flavoured). Raw HTML is not rendered. */
    content: text("content").notNull().default(""),
    /** Short direct answer shown in a box at the top (AEO). */
    quickAnswer: text("quick_answer"),
    faqs: jsonb("faqs").$type<PostFaq[]>().notNull().default([]),
    coverImage: varchar("cover_image", { length: 500 }),
    coverAlt: varchar("cover_alt", { length: 300 }),
    category: varchar("category", { length: 80 }).notNull().default("Guides"),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    authorName: varchar("author_name", { length: 200 }).notNull().default("Dragon Ryu Arts Academy"),
    metaTitle: varchar("meta_title", { length: 200 }),
    metaDescription: text("meta_description"),
    focusKeyword: varchar("focus_keyword", { length: 160 }),
    secondaryKeywords: jsonb("secondary_keywords").$type<string[]>().notNull().default([]),
    status: postStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("posts_status_published_idx").on(t.status, t.publishedAt)]
);

// ---------- STUDENTS & ATTENDANCE ----------

export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Friendly running number, shown as DR-0001. */
  rollNo: serial("roll_no").notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  parentName: varchar("parent_name", { length: 255 }),
  phone: varchar("phone", { length: 30 }),
  email: varchar("email", { length: 255 }),
  age: integer("age"),
  notes: text("notes"),
  active: boolean("active").notNull().default(true),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** A student taking one art (course slug) in a batch. */
export const enrolments = pgTable(
  "enrolments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
    courseSlug: varchar("course_slug", { length: 160 }).notNull(),
    batch: varchar("batch", { length: 120 }).notNull().default(""),
    active: boolean("active").notNull().default(true),
    startedOn: date("started_on").notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("enrolments_student_course_uq").on(t.studentId, t.courseSlug), index("enrolments_course_idx").on(t.courseSlug)]
);

export const attendanceStatusEnum = pgEnum("attendance_status", ["present", "absent", "late", "excused"]);

export const attendance = pgTable(
  "attendance",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    enrolmentId: uuid("enrolment_id").notNull().references(() => enrolments.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    status: attendanceStatusEnum("status").notNull(),
    note: text("note"),
    markedBy: uuid("marked_by").references(() => users.id, { onDelete: "set null" }),
    markedAt: timestamp("marked_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("attendance_enrolment_date_uq").on(t.enrolmentId, t.date), index("attendance_date_idx").on(t.date)]
);

export type User = typeof users.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Enrolment = typeof enrolments.$inferSelect;
export type AttendanceStatus = (typeof attendanceStatusEnum.enumValues)[number];
export type Role = (typeof userRoleEnum.enumValues)[number];
export type Post = typeof posts.$inferSelect;
export type PageSeo = typeof pageSeo.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type LeadStatus = (typeof leadStatusEnum.enumValues)[number];

import Link from "next/link";

import type { Course } from "@/lib/courses";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <article className={`course-card card-3d${course.label ? " course-card--featured" : ""}`} data-tilt>
      {course.label && <span className="course-card__label">{course.label}</span>}
      <div className="course-card__icon" aria-hidden="true">{course.icon}</div>
      <h3>
        <Link href={`/${course.slug}`} className="course-card__link">
          {course.cardTitle}
        </Link>
      </h3>
      <p>{course.cardText}</p>
      <span className="course-card__tag">{course.tag}</span>
    </article>
  );
}

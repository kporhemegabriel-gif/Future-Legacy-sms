import { useStudentSummary, useStudents } from "../api/students";

export default function Courses() {
  const { data: summary, isLoading: loadingSummary } = useStudentSummary();
  const courseList = summary?.courseList || [];

  return (
    <div className="space-y-5">
      <div className="border border-hairline bg-paper">
        <div className="px-4 py-4 border-b border-hairline">
          <h2 className="font-serif text-lg">Courses Offered</h2>
          <p className="text-xs text-slate mt-1">Derived automatically from the course field on each student record.</p>
        </div>

        {loadingSummary && <p className="px-4 py-8 text-sm text-slate text-center">Loading…</p>}

        {!loadingSummary && courseList.length === 0 && (
          <p className="px-4 py-8 text-sm text-slate text-center">No courses yet — add a student record to populate this list.</p>
        )}

        {!loadingSummary && courseList.length > 0 && (
          <ul>{courseList.map((course) => (<CourseRow key={course} course={course} />))}</ul>
        )}
      </div>
    </div>
  );
}

function CourseRow({ course }) {
  const { data } = useStudents({ course, page: 1, limit: 1 });
  const total = data?.pagination?.total;

  return (
    <li className="flex items-center justify-between px-4 py-3 border-b border-hairline last:border-0">
      <span className="text-sm">{course}</span>
      <span className="text-xs font-mono text-slate">{total === undefined ? "…" : `${total} student${total === 1 ? "" : "s"}`}</span>
    </li>
  );
}

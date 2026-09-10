import { Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_STYLES = {
  Active: "text-forest border-forest/30 bg-forest/5",
  Inactive: "text-slate border-hairline bg-black/[0.02]",
  Graduated: "text-brass-dark border-brass/30 bg-brass-light/40",
};

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function StudentTable({
  students, loading, search, onSearchChange, course, onCourseChange, status, onStatusChange,
  courseOptions, pagination, onPageChange, onEdit, onDelete,
}) {
  return (
    <div className="border border-hairline bg-paper">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4 border-b border-hairline">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
          <input className="field-input pl-9" placeholder="Search by name or student ID…" value={search} onChange={(e) => onSearchChange(e.target.value)} />
        </div>
        <select className="field-input sm:w-48" value={course} onChange={(e) => onCourseChange(e.target.value)}>
          <option value="">All courses</option>
          {courseOptions.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
        <select className="field-input sm:w-40" value={status} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Graduated">Graduated</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline text-left text-xs text-slate">
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">Student ID</th>
              <th className="px-4 py-3 font-medium">Course</th>
              <th className="px-4 py-3 font-medium">Enrolled</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate">Loading records…</td></tr>
            )}
            {!loading && students.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate">No students match this search. Try clearing filters or add a new record.</td></tr>
            )}
            {!loading && students.map((s) => (
              <tr key={s._id} className="border-b border-hairline last:border-0 hover:bg-black/[0.015]">
                <td className="px-4 py-3">
                  <div className="font-medium text-ink">{s.fullName}</div>
                  <div className="text-xs text-slate">{s.email}</div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{s.studentId}</td>
                <td className="px-4 py-3">{s.course}</td>
                <td className="px-4 py-3 text-slate">{formatDate(s.enrollmentDate)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block border px-2 py-0.5 text-xs ${STATUS_STYLES[s.status] || STATUS_STYLES.Inactive}`}>{s.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button className="p-1.5 border border-hairline hover:border-ink" aria-label="Edit student" onClick={() => onEdit(s)}><Pencil size={14} /></button>
                    <button className="p-1.5 border border-hairline hover:border-rust hover:text-rust" aria-label="Delete student" onClick={() => onDelete(s)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-hairline text-xs text-slate">
          <span>Page {pagination.page} of {pagination.totalPages} · {pagination.total} total student{pagination.total === 1 ? "" : "s"}</span>
          <div className="flex gap-1">
            <button className="p-1.5 border border-hairline disabled:opacity-40" disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)} aria-label="Previous page"><ChevronLeft size={14} /></button>
            <button className="p-1.5 border border-hairline disabled:opacity-40" disabled={pagination.page >= pagination.totalPages} onClick={() => onPageChange(pagination.page + 1)} aria-label="Next page"><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

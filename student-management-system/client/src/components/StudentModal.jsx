import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STATUS_OPTIONS = ["Active", "Inactive", "Graduated"];

const emptyForm = {
  fullName: "", studentId: "", email: "", course: "", enrollmentDate: "", status: "Active",
};

function toDateInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function StudentModal({
  open, mode = "create", initialValues, courseOptions = [], onClose, onSubmit, submitting = false, serverError = "",
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(
        initialValues
          ? {
              fullName: initialValues.fullName || "",
              studentId: initialValues.studentId || "",
              email: initialValues.email || "",
              course: initialValues.course || "",
              enrollmentDate: toDateInputValue(initialValues.enrollmentDate),
              status: initialValues.status || "Active",
            }
          : emptyForm
      );
      setErrors({});
    }
  }, [open, initialValues]);

  if (!open) return null;

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.studentId.trim()) next.studentId = "Student ID is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!form.course.trim()) next.course = "Course / major is required.";
    if (!form.enrollmentDate) next.enrollmentDate = "Enrollment date is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40">
      <div className="h-full w-full max-w-md bg-paper border-l border-hairline flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
          <h3 className="font-serif text-lg">{mode === "create" ? "Add Student" : "Edit Student"}</h3>
          <button onClick={onClose} aria-label="Close" className="p-1"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {serverError && (
            <div className="border border-rust/40 bg-rust/5 text-rust text-sm px-3 py-2">{serverError}</div>
          )}

          <div>
            <label className="field-label">Full Name</label>
            <input className="field-input" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="e.g. Ama Serwaa Boateng" />
            {errors.fullName && <p className="text-xs text-rust mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="field-label">Student ID / Index Number</label>
            <input className="field-input font-mono" value={form.studentId} onChange={(e) => update("studentId", e.target.value)} placeholder="e.g. UPSA/2023/0142" />
            {errors.studentId && <p className="text-xs text-rust mt-1">{errors.studentId}</p>}
          </div>

          <div>
            <label className="field-label">Email</label>
            <input type="email" className="field-input" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="student@example.com" />
            {errors.email && <p className="text-xs text-rust mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="field-label">Major / Course</label>
            <input className="field-input" list="course-suggestions" value={form.course} onChange={(e) => update("course", e.target.value)} placeholder="e.g. BSc. Computer Science" />
            <datalist id="course-suggestions">
              {courseOptions.map((c) => (<option key={c} value={c} />))}
            </datalist>
            {errors.course && <p className="text-xs text-rust mt-1">{errors.course}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Enrollment Date</label>
              <input type="date" className="field-input" value={form.enrollmentDate} onChange={(e) => update("enrollmentDate", e.target.value)} />
              {errors.enrollmentDate && <p className="text-xs text-rust mt-1">{errors.enrollmentDate}</p>}
            </div>
            <div>
              <label className="field-label">Status</label>
              <select className="field-input" value={form.status} onChange={(e) => update("status", e.target.value)}>
                {STATUS_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
          </div>
        </form>

        <div className="px-5 py-4 border-t border-hairline flex justify-end gap-2">
          <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
          <button type="button" className="btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving…" : mode === "create" ? "Add Student" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

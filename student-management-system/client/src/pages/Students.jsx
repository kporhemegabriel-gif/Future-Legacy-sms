import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import StudentTable from "../components/StudentTable";
import StudentModal from "../components/StudentModal";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  useStudents, useStudentSummary, useCreateStudent, useUpdateStudent, useDeleteStudent,
} from "../api/students";

const PAGE_SIZE = 10;

export default function Students() {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [activeStudent, setActiveStudent] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [formError, setFormError] = useState("");

  const params = useMemo(() => ({ search, course, status, page, limit: PAGE_SIZE }), [search, course, status, page]);

  const { data, isLoading } = useStudents(params);
  const { data: summary } = useStudentSummary();

  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const students = data?.data || [];
  const pagination = data?.pagination;
  const courseOptions = summary?.courseList || [];

  function openCreate() {
    setModalMode("create");
    setActiveStudent(null);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(student) {
    setModalMode("edit");
    setActiveStudent(student);
    setFormError("");
    setModalOpen(true);
  }

  async function handleSubmit(form) {
    setFormError("");
    try {
      if (modalMode === "create") {
        await createStudent.mutateAsync(form);
      } else {
        await updateStudent.mutateAsync({ id: activeStudent._id, payload: form });
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleConfirmDelete() {
    try {
      await deleteStudent.mutateAsync({ id: pendingDelete._id });
      setPendingDelete(null);
    } catch {
      // Keep dialog open.
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button className="btn-primary" onClick={openCreate}><Plus size={16} /> Add Student</button>
      </div>

      <StudentTable
        students={students}
        loading={isLoading}
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        course={course}
        onCourseChange={(v) => { setCourse(v); setPage(1); }}
        status={status}
        onStatusChange={(v) => { setStatus(v); setPage(1); }}
        courseOptions={courseOptions}
        pagination={pagination}
        onPageChange={setPage}
        onEdit={openEdit}
        onDelete={setPendingDelete}
      />

      <StudentModal
        open={modalOpen}
        mode={modalMode}
        initialValues={activeStudent}
        courseOptions={courseOptions}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={createStudent.isPending || updateStudent.isPending}
        serverError={formError}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Remove student record?"
        message={pendingDelete ? `"${pendingDelete.fullName}" (${pendingDelete.studentId}) will be deactivated and hidden from the register. This can be reversed from the database if needed.` : ""}
        confirmLabel="Deactivate"
        loading={deleteStudent.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

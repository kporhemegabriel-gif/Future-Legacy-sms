import { Users, UserCheck, BookOpen, Activity } from "lucide-react";
import { useStudentSummary } from "../api/students";
import StatCard from "../components/StatCard";

export default function Dashboard({ onNavigate }) {
  const { data: summary, isLoading, isError, error } = useStudentSummary();

  return (
    <div className="space-y-6">
      {isError && (
        <div className="border border-rust/40 bg-rust/5 text-rust text-sm px-4 py-3">
          Couldn't reach the API: {error.message}. Confirm the server is running and MONGO_URI is set.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={isLoading ? "—" : summary?.totalStudents ?? 0} icon={Users} accent="ink" />
        <StatCard label="Active Registrations" value={isLoading ? "—" : summary?.activeStudents ?? 0} icon={UserCheck} accent="forest" />
        <StatCard label="Courses Offered" value={isLoading ? "—" : summary?.coursesOffered ?? 0} icon={BookOpen} accent="brass" />
        <StatCard label="Graduated" value={isLoading ? "—" : summary?.graduatedStudents ?? 0} icon={Activity} accent="rust" />
      </div>

      <div className="border border-hairline bg-paper p-6">
        <h2 className="font-serif text-lg mb-2">Getting started</h2>
        <p className="text-sm text-slate leading-relaxed max-w-2xl">
          This dashboard pulls live counts from your MongoDB collection. Head to{" "}
          <button className="underline underline-offset-2 hover:text-ink" onClick={() => onNavigate("students")}>Students</button>{" "}
          to add your first record, search the register, or filter by course and status.
        </p>
      </div>
    </div>
  );
}

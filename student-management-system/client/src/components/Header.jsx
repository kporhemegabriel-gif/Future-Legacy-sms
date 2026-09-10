import { Menu, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const TITLES = {
  dashboard: ["Dashboard", "An overview of the current student register."],
  students: ["Students", "Search, filter, and manage student records."],
  courses: ["Courses", "Courses currently offered across the register."],
  settings: ["Settings", "System, connection, and account information."],
};

export default function Header({ page, onMenuClick }) {
  const [title, subtitle] = TITLES[page] || TITLES.dashboard;
  const { admin, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-hairline bg-paper px-5 md:px-8 py-5">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden p-1.5 border border-hairline" aria-label="Open menu">
          <Menu size={18} />
        </button>
        <div>
          <h1 className="font-serif text-xl md:text-2xl leading-none">{title}</h1>
          <p className="text-xs text-slate mt-1 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium">{admin?.fullName}</p>
          <p className="text-[11px] text-slate capitalize">{admin?.role}</p>
        </div>
        <button onClick={logout} className="p-1.5 border border-hairline hover:border-ink" aria-label="Log out" title="Log out">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

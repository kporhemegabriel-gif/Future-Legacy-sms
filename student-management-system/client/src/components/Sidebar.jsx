import { LayoutGrid, Users, BookOpen, Settings } from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "students", label: "Students", icon: Users },
  { key: "courses", label: "Courses", icon: BookOpen },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ active, onNavigate, open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-ink/40 z-30 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed z-40 md:z-auto md:static top-0 left-0 h-full w-64 bg-ink text-paper
        flex flex-col transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img src="/logo-icon.png" alt="Future Legacy School crest" className="w-7 h-7 object-contain" />
            <span className="font-serif text-lg tracking-tight">Future Legacy School</span>
          </div>
          <p className="text-[11px] text-paper/50 mt-1">Student Management System</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => {
                  onNavigate(key);
                  onClose?.();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors
                  border-l-2 ${
                    isActive
                      ? "bg-white/5 border-brass text-paper"
                      : "border-transparent text-paper/60 hover:text-paper hover:bg-white/5"
                  }`}
              >
                <Icon size={17} strokeWidth={1.75} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="px-6 py-5 border-t border-white/10 text-[11px] text-paper/40">
          v1.0 · Connected via Joytree
        </div>
      </aside>
    </>
  );
}

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "./context/AuthContext";
import { useSetupStatus } from "./api/auth";

export default function App() {
  const { admin, loading } = useAuth();
  const { data: setupData } = useSetupStatus();
  const [authView, setAuthView] = useState("login"); // "login" | "signup"

  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink text-paper text-sm">
        Loading…
      </div>
    );
  }

  if (!admin) {
    const needsSetup = setupData?.needsSetup;
    // If no admin exists yet, default straight to the signup view.
    const view = needsSetup && authView === "login" ? "signup" : authView;

    return view === "signup" ? (
      <Signup onSwitchToLogin={() => setAuthView("login")} />
    ) : (
      <Login onSwitchToSignup={() => setAuthView("signup")} needsSetup={needsSetup} />
    );
  }

  const pages = {
    dashboard: <Dashboard onNavigate={setPage} />,
    students: <Students />,
    courses: <Courses />,
    settings: <Settings />,
  };

  return (
    <div className="min-h-screen flex bg-paper text-ink">
      <Sidebar
        active={page}
        onNavigate={setPage}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header page={page} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-5 md:px-8 py-6 max-w-6xl w-full mx-auto">
          {pages[page]}
        </main>
      </div>
    </div>
  );
}

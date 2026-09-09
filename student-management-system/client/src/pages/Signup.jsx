import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { useSignup } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Signup({ onSwitchToLogin }) {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const signup = useSignup();
  const { login: setSession } = useAuth();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }

    try {
      const { token, admin } = await signup.mutateAsync({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      setSession(token, admin);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 text-paper">
          <GraduationCap size={28} className="text-brass mb-2" strokeWidth={1.75} />
          <h1 className="font-serif text-2xl">Future Legacy School</h1>
          <p className="text-xs text-paper/50 mt-1">Student Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-paper border border-hairline p-6 space-y-4">
          <div>
            <h2 className="font-serif text-lg">Create Admin Account</h2>
            <p className="text-xs text-slate mt-1">
              This sets up the first administrator. Once created, self sign-up is
              disabled — this admin can invite additional staff accounts.
            </p>
          </div>

          {error && (
            <div className="border border-rust/40 bg-rust/5 text-rust text-sm px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="field-label">Full Name</label>
            <input
              className="field-input"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input
              type="email"
              className="field-input"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input
              type="password"
              className="field-input"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="field-label">Confirm Password</label>
            <input
              type="password"
              className="field-input"
              value={form.confirm}
              onChange={(e) => update("confirm", e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={signup.isPending}>
            {signup.isPending ? "Creating account…" : "Create Admin Account"}
          </button>

          <p className="text-xs text-slate text-center pt-2">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="underline underline-offset-2 hover:text-ink"
            >
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

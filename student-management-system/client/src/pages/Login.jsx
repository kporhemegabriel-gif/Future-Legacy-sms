import { useState } from "react";
import { useLogin } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Login({ onSwitchToSignup, needsSetup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useLogin();
  const { login: setSession } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const { token, admin } = await login.mutateAsync({ email, password });
      setSession(token, admin);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 text-paper">
          <img src="/logo-icon.png" alt="Future Legacy School crest" className="w-14 h-14 object-contain mb-2" />
          <h1 className="font-serif text-2xl">Future Legacy School</h1>
          <p className="text-xs text-paper/50 mt-1">Student Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-paper border border-hairline p-6 space-y-4">
          <h2 className="font-serif text-lg">Admin Login</h2>

          {error && <div className="border border-rust/40 bg-rust/5 text-rust text-sm px-3 py-2">{error}</div>}

          <div>
            <label className="field-label">Email</label>
            <input type="email" className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input type="password" className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={login.isPending}>
            {login.isPending ? "Signing in…" : "Log In"}
          </button>

          {needsSetup && (
            <p className="text-xs text-slate text-center pt-2">
              No admin account exists yet.{" "}
              <button type="button" onClick={onSwitchToSignup} className="underline underline-offset-2 hover:text-ink">
                Create the first admin account
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

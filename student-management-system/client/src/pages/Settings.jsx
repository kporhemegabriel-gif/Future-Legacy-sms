import { useEffect, useState } from "react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useInviteAdmin } from "../api/auth";

export default function Settings() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");
  const { admin } = useAuth();

  useEffect(() => {
    apiClient.get("/health").then(({ data }) => setHealth(data)).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="space-y-5">
      <div className="border border-hairline bg-paper p-6 max-w-xl">
        <h2 className="font-serif text-lg mb-4">System Status</h2>
        <dl className="text-sm space-y-3">
          <Row label="API base URL" value={import.meta.env.VITE_API_BASE_URL || "/api"} />
          <Row label="API health check" value={error ? `Unreachable — ${error}` : health ? "Connected" : "Checking…"} tone={error ? "rust" : health ? "forest" : "slate"} />
          <Row label="Server uptime" value={health ? `${Math.round(health.uptime)}s` : "—"} />
          <Row label="Logged in as" value={`${admin?.fullName} (${admin?.role})`} />
        </dl>
      </div>

      <div className="border border-hairline bg-paper p-6 max-w-xl text-sm text-slate leading-relaxed">
        <h2 className="font-serif text-lg text-ink mb-2">Database</h2>
        <p>
          This system connects to MongoDB via <code className="font-mono text-ink">MONGO_URI</code> in{" "}
          <code className="font-mono text-ink">server/.env</code>, pointed at your Joytree cluster. Connection health is logged in the server console on startup.
        </p>
      </div>

      {admin?.role === "admin" && <InviteAdminForm />}
    </div>
  );
}

function InviteAdminForm() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "staff" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const invite = useInviteAdmin();

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const created = await invite.mutateAsync(form);
      setMessage(`Account created for ${created.fullName} (${created.role}).`);
      setForm({ fullName: "", email: "", password: "", role: "staff" });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="border border-hairline bg-paper p-6 max-w-xl">
      <h2 className="font-serif text-lg mb-1">Add Staff / Admin Account</h2>
      <p className="text-xs text-slate mb-4">Only admins can create new accounts — public sign-up is disabled after the first admin is set up.</p>

      {message && <div className="border border-forest/40 bg-forest/5 text-forest text-sm px-3 py-2 mb-4">{message}</div>}
      {error && <div className="border border-rust/40 bg-rust/5 text-rust text-sm px-3 py-2 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Full Name</label>
            <input className="field-input" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input type="email" className="field-input" value={form.email} onChange={(e) => update("email", e.target.value)} required />
          </div>
          <div>
            <label className="field-label">Temporary Password</label>
            <input type="password" className="field-input" value={form.password} onChange={(e) => update("password", e.target.value)} minLength={8} required />
          </div>
          <div>
            <label className="field-label">Role</label>
            <select className="field-input" value={form.role} onChange={(e) => update("role", e.target.value)}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={invite.isPending}>{invite.isPending ? "Creating…" : "Create Account"}</button>
      </form>
    </div>
  );
}

function Row({ label, value, tone = "ink" }) {
  const toneClass = { ink: "text-ink", forest: "text-forest", rust: "text-rust", slate: "text-slate" }[tone];
  return (
    <div className="flex items-center justify-between border-b border-hairline pb-3 last:border-0 last:pb-0">
      <dt className="text-slate">{label}</dt>
      <dd className={`font-mono text-xs ${toneClass}`}>{value}</dd>
    </div>
  );
}

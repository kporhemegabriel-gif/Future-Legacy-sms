export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-sm bg-paper border border-hairline">
        <div className="px-5 py-4 border-b border-hairline">
          <h3 className="font-serif text-lg">{title}</h3>
        </div>
        <div className="px-5 py-4 text-sm text-slate">{message}</div>
        <div className="px-5 py-4 border-t border-hairline flex justify-end gap-2">
          <button className="btn-outline" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            className={danger ? "btn-danger" : "btn-primary"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

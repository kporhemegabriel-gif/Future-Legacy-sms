export default function StatCard({ label, value, icon: Icon, accent = "ink" }) {
  const accentClasses = {
    ink: "text-ink",
    brass: "text-brass-dark",
    forest: "text-forest",
    rust: "text-rust",
  };

  return (
    <div className="border border-hairline bg-paper p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate">{label}</span>
        {Icon && <Icon size={16} className={accentClasses[accent]} strokeWidth={1.75} />}
      </div>
      <span className={`font-serif text-3xl ${accentClasses[accent]}`}>{value}</span>
    </div>
  );
}

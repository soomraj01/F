// This component displays one dashboard metric with its visual tone.
function StatCard({ icon, label, value, tone }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div><span>{label}</span><strong>{value.toString().padStart(2, '0')}</strong></div></div>;
}

export default StatCard;

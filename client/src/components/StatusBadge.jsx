// This component presents a project's published or draft state consistently.
function StatusBadge({ status }) {
  return <span className={`status-badge ${status}`}>{status}</span>;
}

export default StatusBadge;

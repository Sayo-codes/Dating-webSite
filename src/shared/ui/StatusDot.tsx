type StatusDotProps = {
  status: "online" | "offline";
  className?: string;
};

export function StatusDot({ status, className }: StatusDotProps) {
  const statusClass =
    status === "online" ? "status-dot--online" : "status-dot--offline";

  return (
    <span
      className={`status-dot ${statusClass} ${className ?? ""}`.trim()}
      aria-hidden="true"
    />
  );
}


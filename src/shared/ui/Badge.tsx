type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`rounded-full border border-fuchsia-400/40 bg-fuchsia-500/10 px-2 py-0.5 text-[0.65rem] text-white/60 ${className}`.trim()}
    >
      {children}
    </span>
  );
}

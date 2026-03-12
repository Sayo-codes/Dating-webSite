import type { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children: React.ReactNode;
  optional?: boolean;
};

export function Label({
  children,
  optional,
  className = "",
  ...props
}: LabelProps) {
  return (
    <label
      className={`text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-muted)] ${className}`.trim()}
      {...props}
    >
      {children}
      {optional && (
        <span className="ml-1 font-normal normal-case tracking-normal text-white/40">
          (optional)
        </span>
      )}
    </label>
  );
}

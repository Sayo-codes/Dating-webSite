import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  id?: string;
};

export function Input({
  label,
  error,
  id: idProp,
  className = "",
  ...props
}: InputProps) {
  const id = idProp ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`input-base focus-outline text-[16px] ${error ? "border-red-400/50" : ""} ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={id ? `${id}-error` : undefined} className="mt-1 text-sm text-red-200">
          {error}
        </p>
      )}
    </div>
  );
}

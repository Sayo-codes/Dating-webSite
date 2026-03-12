import type { ButtonHTMLAttributes } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  className?: string;
  "aria-label"?: string;
};

const sizeClasses = {
  sm: "px-4 py-2.5 text-xs min-h-[44px]",
  md: "px-6 py-3 text-sm min-h-[44px]",
  lg: "px-8 py-4 text-base min-h-[48px]",
};

export function PrimaryButton({
  children,
  size = "md",
  loading = false,
  className = "",
  disabled,
  type = "button",
  "aria-label": ariaLabel,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled ?? loading}
      className={`pill-button-primary focus-outline inline-flex items-center justify-center font-medium transition-opacity disabled:pointer-events-none disabled:opacity-50 ${sizeClasses[size]} ${className}`.trim()}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden
          />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

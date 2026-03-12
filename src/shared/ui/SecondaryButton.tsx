import type { ButtonHTMLAttributes } from "react";

type SecondaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "px-4 py-2.5 text-xs min-h-[44px]",
  md: "px-6 py-3 text-sm min-h-[44px]",
  lg: "px-8 py-4 text-base min-h-[48px]",
};

export function SecondaryButton({
  children,
  size = "md",
  className = "",
  type = "button",
  ...props
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      className={`focus-outline inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 font-medium text-white/90 backdrop-blur transition-[color,background-color,border-color,transform] duration-200 ease-out hover:bg-white/10 hover:border-white/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${sizeClasses[size]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

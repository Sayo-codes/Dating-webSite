import type { HTMLAttributes } from "react";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function GlassCard({
  children,
  padding = "md",
  className = "",
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`glass-card ${paddingClasses[padding]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

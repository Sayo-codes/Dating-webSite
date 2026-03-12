import type { HTMLAttributes } from "react";

type PageContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  size?: "narrow" | "default" | "wide";
};

const maxWidthClasses = {
  narrow: "max-w-2xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
};

export function PageContainer({
  children,
  size = "default",
  className = "",
  ...props
}: PageContainerProps) {
  return (
    <div className="min-h-screen text-white" {...props}>
      <main
        className={`page-content mx-auto flex min-h-screen flex-col gap-12 ${maxWidthClasses[size]} ${className}`.trim()}
      >
        {children}
      </main>
    </div>
  );
}

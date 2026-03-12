type SectionProps = {
  children: React.ReactNode;
  className?: string;
  "aria-labelledby"?: string;
};

export function Section({ children, className = "", ...rest }: SectionProps) {
  return (
    <section className={`section-shell ${className}`.trim()} {...rest}>
      {children}
    </section>
  );
}

type SectionHeadingProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionHeading({
  id,
  children,
  className = "",
}: SectionHeadingProps) {
  return (
    <h2 id={id} className={`section-heading ${className}`.trim()}>
      {children}
    </h2>
  );
}

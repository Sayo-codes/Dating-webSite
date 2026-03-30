import { TestimonialsColumns } from "@/components/ui/testimonials-columns-1";

export function TestimonialsSection() {
  return (
    <section
      className="section-shell relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* ── Background glow accents ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 h-[400px] w-[400px] rounded-full opacity-10 blur-[120px]"
        style={{ background: "#d4a853" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-1/4 h-[400px] w-[400px] rounded-full opacity-8 blur-[120px]"
        style={{ background: "#ff2d78" }}
      />

      {/* ── Section header ── */}
      <div className="relative z-10 px-4 text-center sm:px-6 lg:px-10">
        <p className="section-heading mb-2 flex items-center justify-center gap-2">
          ✦ Member Stories
        </p>
        <h2
          id="testimonials-heading"
          className="font-[var(--font-heading)] text-2xl font-bold sm:text-3xl lg:text-4xl"
        >
          What Our Members{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #f0c97a, #d4a853)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Say
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/50">
          Thousands of members trust Velvet Signal for authentic, private
          connections. Here&apos;s what they love.
        </p>
      </div>

      {/* ── Animated columns ── */}
      <div className="relative z-10 mt-10">
        <TestimonialsColumns />
      </div>
    </section>
  );
}

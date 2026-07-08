interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  surface?: boolean;
  "aria-labelledby"?: string;
}

export default function Section({
  id,
  children,
  className,
  surface,
  "aria-labelledby": ariaLabelledBy,
}: SectionProps) {
  const background = surface ? "bg-[#FFFFFF]" : "bg-[#FAFAF9]";
  const spacing = "py-20 md:py-28";

  return (
    <section id={id} aria-labelledby={ariaLabelledBy} className={`${background} ${spacing} ${className ?? ""}`.trim()}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

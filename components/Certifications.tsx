import copy from "@/lib/copy";
import { certifications, sectionIds } from "@/lib/data";
import Section from "./Section";
import ScrollReveal from "./ScrollReveal";

export default function Certifications() {
  return (
    <Section
      id={sectionIds.certifications}
      surface
      aria-labelledby="certifications-title"
    >
      <div className="grid items-start gap-12 lg:grid-cols-12">
        <ScrollReveal className="lg:col-span-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#0D9488]">
            Compliance
          </p>
          <h2
            id="certifications-title"
            className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#1C1917] md:text-4xl"
          >
            {copy.certifications.title}
          </h2>
          <p className="mt-4 text-[#78716C]">
            {copy.certifications.subtitle}
          </p>
        </ScrollReveal>

        <div className="lg:col-span-8">
          <div className="divide-y divide-[#E7E5E4] border-t border-[#E7E5E4]">
            {certifications.map((certification, index) => (
              <ScrollReveal key={certification.id} delay={index * 0.08}>
                <div className="group grid gap-2 py-6 sm:grid-cols-12 sm:gap-6">
                  <div className="sm:col-span-4">
                    <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                      {certification.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[#0D9488]">
                      {certification.subtitle}
                    </p>
                  </div>
                  <p className="sm:col-span-8 leading-relaxed text-[#78716C]">
                    {certification.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="border-b border-[#E7E5E4]" />
        </div>
      </div>
    </Section>
  );
}

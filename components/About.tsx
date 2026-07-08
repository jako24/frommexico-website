import copy from "@/lib/copy";
import { sectionIds } from "@/lib/data";
import Section from "./Section";
import ScrollReveal from "./ScrollReveal";
import Image from "next/image";

export default function About() {
  return (
    <Section id={sectionIds.about} surface aria-labelledby="about-title">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <ScrollReveal>
          <h2
            id="about-title"
            className="font-serif text-3xl font-semibold tracking-tight text-[#1C1917] md:text-4xl"
          >
            {copy.about.title}
          </h2>
          <div className="mt-6 space-y-4">
            {copy.about.paragraphs.map((paragraph, index) => (
              <p key={index} className="leading-relaxed text-[#78716C]">
                {paragraph}
              </p>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1765130175473-3b0968adbbac?fm=jpg&q=60&w=1200&auto=format&fit=crop"
              alt="A container ship sailing on calm blue ocean, carrying produce from Mexico to Europe"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </ScrollReveal>
      </div>
    </Section>
  );
}

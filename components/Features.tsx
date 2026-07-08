import copy from "@/lib/copy";
import { features, sectionIds } from "@/lib/data";
import Section from "./Section";
import ScrollReveal from "./ScrollReveal";

export default function Features() {
  return (
    <Section id={sectionIds.features} aria-labelledby="features-title">
      <ScrollReveal className="text-center">
        <h2
          id="features-title"
          className="font-serif text-3xl font-semibold tracking-tight text-[#1C1917] md:text-4xl"
        >
          {copy.features.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[#78716C]">
          {copy.features.subtitle}
        </p>
      </ScrollReveal>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <ScrollReveal key={feature.title} delay={index * 0.1}>
              <article className="group h-full rounded-2xl border border-[#E7E5E4] bg-[#FFFFFF] p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="mb-5 inline-flex rounded-xl bg-[#0D9488]/10 p-3 text-[#0D9488] transition-colors group-hover:bg-[#0D9488]/15">
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#1C1917]">
                  {feature.title}
                </h3>
                <p className="mt-3 leading-relaxed text-[#78716C]">
                  {feature.description}
                </p>
              </article>
            </ScrollReveal>
          );
        })}
      </div>
    </Section>
  );
}

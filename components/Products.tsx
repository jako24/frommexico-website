import copy from "@/lib/copy";
import { products, sectionIds } from "@/lib/data";
import Section from "./Section";
import ScrollReveal from "./ScrollReveal";
import ProductCard from "./ProductCard";

export default function Products() {
  return (
    <Section id={sectionIds.products} aria-labelledby="products-title">
      <ScrollReveal className="text-center">
        <h2
          id="products-title"
          className="font-serif text-3xl font-semibold tracking-tight text-[#1C1917] md:text-4xl"
        >
          {copy.products.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[#78716C]">
          {copy.products.subtitle}
        </p>
      </ScrollReveal>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <ScrollReveal key={product.id} delay={index * 0.1}>
            <ProductCard product={product} cta={copy.products.cta} />
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}

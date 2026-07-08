"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useReducedMotion, useIsMobile } from "@/lib/hooks";
import type { Product } from "@/lib/data";

interface ProductCardProps {
  product: Product;
  cta: string;
}

export default function ProductCard({ product, cta }: ProductCardProps) {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  return (
    <motion.article
      className="group flex h-full flex-col rounded-2xl border border-[#E7E5E4] bg-[#FFFFFF] p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
      whileHover={reduced || mobile ? undefined : { y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-xl bg-[#FAFAF9]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="font-serif text-xl font-semibold text-[#1C1917]">
        {product.name}
      </h3>
      <p className="mt-1 text-sm font-medium text-[#0D9488]">
        {product.origin} · {product.harvest}
      </p>
      <p className="mt-3 flex-1 leading-relaxed text-[#78716C]">
        {product.description}
      </p>
      <p className="mt-3 text-sm text-[#78716C]">
        <span className="font-medium text-[#1C1917]">Grade:</span> {product.grade}
      </p>
      <a
        href="#contact"
        className="mt-5 inline-flex items-center rounded text-sm font-medium text-[#0D9488] transition-colors hover:text-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2"
        aria-label={`${cta}: ${product.name}`}
      >
        {cta}
        <ArrowRight
          className="ml-1 size-4 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </a>
    </motion.article>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useReducedMotion, useIsMobile } from "@/lib/hooks";
import copy from "@/lib/copy";
import { sectionIds } from "@/lib/data";
import Button from "./Button";

const HERO_IMAGE =
  "https://plus.unsplash.com/premium_photo-1664476943513-6344ab8edbe6?q=80&w=1600&auto=format&fit=crop";

export default function Hero() {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const motionDisabled = reduced || mobile;

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: motionDisabled ? 0 : 0.15,
      },
    },
  };

  const item = {
    hidden: motionDisabled ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  return (
    <section
      id={sectionIds.hero}
      className="relative flex min-h-screen items-center bg-[#FAFAF9] pt-24 md:pt-32"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div
          className="grid items-center gap-12 lg:grid-cols-2"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-2xl">
            <motion.h1
              variants={item}
              className="font-serif text-5xl font-semibold tracking-tight text-[#1C1917] md:text-6xl lg:text-7xl"
            >
              {copy.hero.headline}
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-6 text-lg leading-relaxed text-[#78716C] md:text-xl"
            >
              {copy.hero.subtext}
            </motion.p>
            <motion.div variants={item} className="mt-10">
              <Button as="a" href={`#${sectionIds.products}`} variant="primary" size="lg">
                {copy.hero.cta}
              </Button>
            </motion.div>
          </div>

          <motion.div variants={item} className="flex justify-center lg:justify-end">
            <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={HERO_IMAGE}
                alt="A farmer checking a green fruit in a Mexican orchard"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

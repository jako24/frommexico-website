import Hero from "@/components/Hero";
import Products from "@/components/Products";
import About from "@/components/About";
import Features from "@/components/Features";
import Certifications from "@/components/Certifications";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";
import copy from "@/lib/copy";

export const metadata: Metadata = {
  title: "Home",
  description: copy.brand.tagline,
};

export default function Home() {
  return (
    <>
      <Hero />
      <Products />
      <About />
      <Features />
      <Certifications />
      <ContactForm />
    </>
  );
}

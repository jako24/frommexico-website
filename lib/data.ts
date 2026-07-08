import type { LucideIcon } from "lucide-react";
import { Leaf, ThermometerSnowflake, ScanLine } from "lucide-react";

export const sectionIds = {
  hero: "hero",
  features: "features",
  about: "about",
  products: "products",
  certifications: "certifications",
  contact: "contact",
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Products", href: `#${sectionIds.products}` },
  { label: "About", href: `#${sectionIds.about}` },
  { label: "Certifications", href: `#${sectionIds.certifications}` },
  { label: "Contact", href: `#${sectionIds.contact}` },
];

export const footerLinks: NavLink[] = [
  { label: "Products", href: `#${sectionIds.products}` },
  { label: "About", href: `#${sectionIds.about}` },
  { label: "Certifications", href: `#${sectionIds.certifications}` },
  { label: "Contact", href: `#${sectionIds.contact}` },
];

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: Leaf,
    title: "Certified organic",
    description:
      "EU-equivalent, NOP and JAS certification for every lot, with organic certificates of inspection ready before the container reaches port.",
  },
  {
    icon: ThermometerSnowflake,
    title: "Cold-chain control",
    description:
      "Harvest to pre-cooling in under four hours, then controlled-atmosphere sea freight with continuous temperature and ethylene monitoring.",
  },
  {
    icon: ScanLine,
    title: "Full traceability",
    description:
      "Each case carries harvest block, pack date and grower codes. Trace a pallet back to the orchard in under 60 seconds.",
  },
];

export interface Product {
  id: string;
  name: string;
  origin: string;
  harvest: string;
  grade: string;
  description: string;
  image: string;
}

export const products: Product[] = [
  {
    id: "avocado",
    name: "Hass Avocado",
    origin: "Michoacán",
    harvest: "Year-round, peak Oct–May",
    grade: "Calibre 20–22, Class I",
    description:
      "Grown in volcanic soils around Uruapan. Harvested at peak dry matter for creamy, nutty fruit that ripens evenly.",
    image:
      "https://images.unsplash.com/photo-1616485828923-2640a1ee48b4?fm=jpg&q=60&w=800&auto=format&fit=crop",
  },
  {
    id: "mango",
    name: "Kent & Ataulfo Mango",
    origin: "Chiapas",
    harvest: "March–August",
    grade: "Class I, 300–600 g",
    description:
      "From the Soconusco corridor near Tapachula. Hand-sorted for colour, sugar and uniform shape with fibre-free flesh.",
    image:
      "https://images.unsplash.com/photo-1588931929796-8f0ea6da0faa?fm=jpg&q=60&w=800&auto=format&fit=crop",
  },
  {
    id: "papaya",
    name: "Maradol Papaya",
    origin: "Veracruz",
    harvest: "Year-round",
    grade: "Class I, 1.2–2.5 kg",
    description:
      "Selected from smallholder plots in the Papanteca region. Picked at colour-break for deep orange flesh and reliable sweetness.",
    image:
      "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?fm=jpg&q=60&w=800&auto=format&fit=crop",
  },
  {
    id: "vanilla",
    name: "Veracruz Vanilla",
    origin: "Papanteca de Xalapa",
    harvest: "September–December",
    grade: "Grade A / 25–30% moisture",
    description:
      "Planifolia vanilla cured in the traditional Papanteca method. Long, flexible pods with high vanillin content for premium food manufacturers.",
    image:
      "https://images.unsplash.com/photo-1682482198446-4cbf92f85a4b?fm=jpg&q=60&w=800&auto=format&fit=crop",
  },
  {
    id: "cacao",
    name: "Tabasco Cacao",
    origin: "Chontalpa, Tabasco",
    harvest: "November–June",
    grade: "Fermented, sundried, specialty grade",
    description:
      "Trinitario and fine-flavour Criollo hybrids. Fully fermented and sun-dried for craft chocolate makers and artisan roasters in Europe.",
    image:
      "https://images.unsplash.com/photo-1777376115658-ced8a72ff326?fm=jpg&q=60&w=800&auto=format&fit=crop",
  },
  {
    id: "cinnamon",
    name: "Ceylon-style Cinnamon",
    origin: "Cárdenas, Tabasco",
    harvest: "Year-round",
    grade: "Quills, 8–10 cm / 1% max moisture",
    description:
      "Soft, thin-bark Cinnamomum verum quills with a warm, sweet profile. A quieter alternative to cassia for bakeries and spice blenders.",
    image:
      "https://images.unsplash.com/photo-1758657996518-e67bd328854e?fm=jpg&q=60&w=800&auto=format&fit=crop",
  },
];

export interface Certification {
  id: string;
  name: string;
  subtitle: string;
  description: string;
}

export const certifications: Certification[] = [
  {
    id: "eu-organic",
    name: "EU Organic",
    subtitle: "Equivalent third-country recognition",
    description:
      "Our produce can enter the EU and UK as certified organic, backed by an accredited control body in Mexico.",
  },
  {
    id: "primusgfs",
    name: "PrimusGFS",
    subtitle: "Global food safety certification",
    description:
      "Covers good agricultural practices, packing house operations and storage — the standard most European retailers expect.",
  },
  {
    id: "globalgap",
    name: "GLOBALG.A.P.",
    subtitle: "Integrated farm assurance",
    description:
      "Certifies responsible farming, worker welfare and food safety at the orchard level, reducing buyer audit risk.",
  },
  {
    id: "haccp",
    name: "HACCP",
    subtitle: "Hazard analysis & critical control points",
    description:
      "Applied at every packing and shipping stage, from water sanitation to container sealing and cold-store handover.",
  },
  {
    id: "phytosanitary",
    name: "Phytosanitary Compliance",
    subtitle: "EU import-ready documentation",
    description:
      "Every shipment carries the phytosanitary certificate and customs paperwork required for entry through Rotterdam, Antwerp, Gdansk or Valencia.",
  },
];

"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useReducedMotion, useIsMobile } from "@/lib/hooks";

interface BaseButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "lg";
  className?: string;
  children: React.ReactNode;
}

type ButtonProps =
  | (BaseButtonProps & { as?: "button" } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps | "as">)
  | (BaseButtonProps & { as: "a"; href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps | "as">);

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "lg", className, children, as, ...rest } = props;
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const motionDisabled = reduced || mobile;

  const base =
    "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 disabled:opacity-50";
  const variants = {
    primary: "bg-[#0D9488] text-white hover:bg-[#0F766E]",
    secondary: "border border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/5",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className ?? ""}`.trim();
  const hover = motionDisabled ? undefined : { scale: 1.02 };
  const tap = motionDisabled ? undefined : { scale: 0.98 };

  if (as === "a") {
    const { href, target, rel, ...anchorProps } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <motion.a 
        href={href} 
        target={target} 
        rel={rel}
        className={classes} 
        whileHover={hover} 
        whileTap={tap} 
        transition={{ duration: 0.2 }} 
      >
        {children}
      </motion.a>
    );
  }

  const buttonRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  const { type = "button", ...buttonProps } = buttonRest;

  return (
    <motion.button 
      type={type} 
      className={classes} 
      whileHover={hover} 
      whileTap={tap} 
      transition={{ duration: 0.2 }} 
    >
      {children}
    </motion.button>
  );
}

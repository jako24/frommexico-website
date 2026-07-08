interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: number;
}

export default function Logo({
  className = "",
  variant = "dark",
  size = 36,
}: LogoProps) {
  const fill = variant === "dark" ? "#0D9488" : "#0D9488";
  const vein = variant === "dark" ? "#F0FDFA" : "#FAFAF9";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M18 32C18 32 8 26 8 15C8 8 13 4 18 4C23 4 28 8 28 15C28 26 18 32 18 32Z"
        fill={fill}
      />
      <path
        d="M18 29C18 29 11 24 11 15.5C11 10 14 7 18 7C22 7 25 10 25 15.5C25 24 18 29 18 29Z"
        fill="none"
      />
      <path
        d="M18 8V28"
        stroke={vein}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18 15L13 12M18 19L23 16"
        stroke={vein}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

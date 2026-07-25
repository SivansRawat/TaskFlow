import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo = ({ className = "h-9 w-9", size = 36 }: LogoProps) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="taskflow-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill="url(#taskflow-brand-grad)" />
      <path d="M24 28H76V40H56V76H44V40H24V28Z" fill="white" />
      <circle cx="70" cy="30" r="6" fill="#38BDF8" />
    </svg>
  );
};

export default Logo;

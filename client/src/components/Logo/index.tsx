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
      {/* 8px border radius on a 100x100 box corresponds to rx="22" (approx 22% of size) */}
      <rect width="100" height="100" rx="22" fill="#18181B" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
      <path d="M28 32H72V42H55V72H45V42H28V32Z" fill="#FBBF24" />
      <circle cx="72" cy="32" r="6" fill="#A5FF2A" />
    </svg>
  );
};

export default Logo;

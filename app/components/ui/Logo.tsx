import React from 'react';

export function Logo({ className = "", size = "default" }: { className?: string, size?: "small" | "default" | "large" }) {
  const sizeClass = {
    small: "h-8",
    default: "h-10",
    large: "h-14"
  }[size];

  return (
    <div className={`flex items-center ${className} ${sizeClass}`}>
      <svg 
        className="h-full"
        viewBox="0 0 120 40" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="8" fill="#FF8200" />
        <path d="M20 10 L30 20 L20 30 L10 20 Z" fill="#003087" />
        <circle cx="20" cy="20" r="5" fill="#00A3E0" />
      </svg>
      <div className="ml-2 flex flex-col">
        <span className="font-condensed text-xl font-bold text-dark-blue">CENTRO<span className="text-primary-orange">MUNDO</span>X</span>
        <span className="text-xs text-medium-gray">Investigación de Metaverso</span>
      </div>
    </div>
  );
} 
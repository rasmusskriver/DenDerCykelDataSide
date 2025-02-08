// src/components/ui/button.tsx
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline"; // Optionally define variants for different styles
};

export const Button = ({
  children,
  onClick,
  className = "",
  variant = "default",
}: ButtonProps) => {
  // You can adjust styles based on the variant prop
  const baseStyles = "px-4 py-2 rounded-md font-semibold focus:outline-none";
  const variantStyles = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border-2 border-gray-500 text-gray-500 hover:bg-gray-100",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

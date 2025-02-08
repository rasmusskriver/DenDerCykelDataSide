// src/components/ui/card.tsx
import React from "react";

export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`rounded-lg shadow-md bg-white overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

// export const CardTitle = ({ children }: { children: React.ReactNode }) => {
//   return <h3 className="text-xl font-semibold text-gray-800">{children}</h3>;
// };

export const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={`text-xl font-semibold text-gray-800 ${className}`}>
      {children}
    </h3>
  );
};

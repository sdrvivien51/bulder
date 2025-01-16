"use client"

import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BreadcrumbListProps {
  children: ReactNode;
  className?: string;
}

const BreadcrumbList: FC<BreadcrumbListProps> = ({ children, className }) => {
  return (
    <ol className={cn("flex space-x-2", className)}>
      {children}
    </ol>
  );
};

export default BreadcrumbList; 
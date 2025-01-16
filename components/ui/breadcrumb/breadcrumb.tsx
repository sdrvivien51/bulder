"use client"

import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  children: ReactNode;
  className?: string;
}

const Breadcrumb: FC<BreadcrumbProps> = ({ children, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex", className)}>
      {children}
    </nav>
  );
};

export default Breadcrumb;

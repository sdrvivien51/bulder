"use client"

import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BreadcrumbItemProps {
  children: ReactNode;
  className?: string;
}

const BreadcrumbItem: FC<BreadcrumbItemProps> = ({ children, className }) => {
  return (
    <li className={cn("flex items-center", className)}>
      {children}
    </li>
  );
};

export default BreadcrumbItem; 
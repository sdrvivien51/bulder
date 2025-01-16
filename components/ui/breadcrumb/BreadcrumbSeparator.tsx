"use client"

import { FC } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface BreadcrumbSeparatorProps {
  className?: string;
  children?: React.ReactNode;
}

const BreadcrumbSeparator: FC<BreadcrumbSeparatorProps> = ({ className, children }) => {
  return (
    <span 
      aria-hidden
      className={cn("mx-2 text-muted-foreground", className)}
    >
      {children || <ChevronRight className="h-4 w-4" />}
    </span>
  );
};

export default BreadcrumbSeparator; 
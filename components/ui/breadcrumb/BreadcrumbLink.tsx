"use client"

import Link from "next/link";
import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BreadcrumbLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const BreadcrumbLink: FC<BreadcrumbLinkProps> = ({ href, children, className }) => {
  return (
    <Link href={href} className={cn("text-primary hover:underline", className)}>
      {children}
    </Link>
  );
};

export default BreadcrumbLink; 
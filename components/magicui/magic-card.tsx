"use client";

import { useRef, useState } from "react";
import { useMotionTemplate, useSpring } from "framer-motion";

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradientColor?: string;
  gradientSize?: number;
  gradientFrom?: string;
  gradientTo?: string;
}

export function MagicCard({
  children,
  className,
  gradientColor = "rgba(255,255,255,0.2)",
  gradientSize = 250,
  gradientFrom,
  gradientTo,
  ...props
}: MagicCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    setPosition({ x: clientX - left, y: clientY - top });
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const maskImage = useMotionTemplate`radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 z-10 transition-colors duration-500" style={style} />
      {gradientFrom && gradientTo && (
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${gradientFrom}, ${gradientTo})`,
          }}
        />
      )}
      {children}
    </div>
  );
} 
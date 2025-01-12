"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrbitingCirclesProps {
  children: React.ReactNode[];
  radius?: number;
  speed?: number;
  reverse?: boolean;
  iconSize?: number;
  className?: string;
}

export function OrbitingCircles({
  children,
  radius = 150,
  speed = 1,
  reverse = false,
  iconSize = 40,
  className,
}: OrbitingCirclesProps) {
  const originRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const angle = useRef(0);

  useAnimationFrame((t) => {
    angle.current += speed / 100;
    if (!originRef.current || !itemsRef.current.length) return;

    const originRect = originRef.current.getBoundingClientRect();
    const originX = originRect.left + originRect.width / 2;
    const originY = originRect.top + originRect.height / 2;

    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      const angleDelta = (i * (360 / children.length) * Math.PI) / 180;
      const direction = reverse ? -1 : 1;
      const x =
        originX +
        radius * Math.cos(direction * angle.current + angleDelta) -
        item.clientWidth / 2;
      const y =
        originY +
        radius * Math.sin(direction * angle.current + angleDelta) -
        item.clientHeight / 2;

      item.style.transform = `translate(${x - originX}px, ${y - originY}px)`;
    });
  });

  return (
    <div
      ref={originRef}
      className={cn("relative h-full w-full", className)}
    >
      {children.map((child, i) => (
        <motion.div
          key={i}
          ref={(el) => (itemsRef.current[i] = el)}
          className="absolute left-1/2 top-1/2"
          style={{
            width: iconSize,
            height: iconSize,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: i * 0.1,
            duration: 0.4,
            ease: "easeOut",
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import ThemeToggle from './ThemeToggle';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="border-b border-border bg-background">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src={theme === 'dark' ? '/images/icon-dark.png' : '/images/icon-light.png'}
              alt="Logo OpenAutoma"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold text-foreground">OpenAutoma</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/blog">
            <Button variant="ghost">Blog</Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost">Contact</Button>
          </Link>
          <ThemeToggle />
          <Button>Connexion</Button>
        </div>
      </nav>
    </header>
  );
} 
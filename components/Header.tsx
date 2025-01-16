"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import ThemeToggle from './ThemeToggle';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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

          <div className="hidden md:flex items-center gap-4">
            <Link href="/blog">
              <Button variant="ghost">Blog</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost">Contact</Button>
            </Link>
            <ThemeToggle />
            <Button>Connexion</Button>
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link 
              href="/blog" 
              className="block px-4 py-2 hover:bg-accent rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              href="/contact" 
              className="block px-4 py-2 hover:bg-accent rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="px-4 py-2">
              <ThemeToggle />
            </div>
            <div className="px-4">
              <Button className="w-full">Connexion</Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
} 
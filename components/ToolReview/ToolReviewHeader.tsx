"use client"

import { Star } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import PulsatingButton from '../magicui/pulsating-button';

interface ToolReviewHeaderProps {
  name: string;
  rating: number;
  categories: string;
  pricing: string;
  logo: string | null;
  website: string;
  tagline: string;
}

export default function ToolReviewHeader({
  name,
  rating,
  categories,
  pricing,
  logo,
  website,
  tagline
}: ToolReviewHeaderProps) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-background rounded-lg shadow-sm border dark:border-border">
      <div className="flex items-start">
        <div className="flex gap-6">
          <div className="relative w-32 h-32 bg-muted rounded-lg overflow-hidden">
            {logo ? (
              <Image
                src={logo}
                alt={`Logo de ${name}`}
                fill
                className="object-contain"
                sizes="(max-width: 128px) 100vw, 128px"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400';
                  fallback.textContent = name.charAt(0).toUpperCase();
                  target.parentElement?.appendChild(fallback);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Badge variant="secondary" className="text-sm">
              {categories}
            </Badge>
            <h1 className="text-3xl font-bold text-foreground">{name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({rating}/5)</span>
            </div>
            <div className="text-lg font-semibold">
              {pricing}
            </div>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              {tagline}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-start">
        <PulsatingButton
          onClick={() => window.open(website, "_blank")}
          className="px-4 py-2"
          pulseColor="#3b82f6"
          duration="2s"
        >
          Visiter le site
        </PulsatingButton>
      </div>
    </div>
  );
} 
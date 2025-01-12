'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '../ui/button';

interface ToolReviewGalleryProps {
  images: string[];
}

export default function ToolReviewGallery({ images }: ToolReviewGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">Galerie</h2>
      
      <div className="relative">
        {/* Slider principal */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={images[currentIndex]}
            alt={`Screenshot ${currentIndex + 1}`}
            fill
            className="object-cover cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
          />
        </div>

        {/* Contrôles du slider */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2"
          onClick={previousImage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="secondary"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={nextImage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Thumbnails */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md 
                ${index === currentIndex ? 'ring-2 ring-purple-600' : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="relative w-full max-w-5xl aspect-video">
            <Image
              src={images[currentIndex]}
              alt={`Screenshot ${currentIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
} 
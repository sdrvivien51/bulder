"use client"

import { CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ToolReviewVideo from './ToolReviewVideo';

interface ToolReviewContentProps {
  description: string;
  features: string[];
  pros: string[];
  cons: string[];
  source_url?: string[];
  videos?: string[];
}

export default function ToolReviewContent({
  description,
  features,
  pros,
  cons,
  source_url = [],
  videos = [],
}: ToolReviewContentProps) {
  // Fonction pour convertir le HTML en format sécurisé
  const createMarkup = (htmlContent: string) => {
    // Remplacer les balises <li> par des éléments de liste formatés
    const formattedContent = htmlContent
      .replace(/<li>/g, '<li class="list-disc ml-6 mb-2">')
      // Remplacer les balises <p> par des paragraphes avec espacement
      .replace(/<p>/g, '<p class="mb-4">')
      // Remplacer les balises <table> par des tableaux stylisés
      .replace(
        /<table>/g, 
        '<table class="w-full border-collapse border border-gray-200 my-4">'
      )
      .replace(
        /<td>/g, 
        '<td class="border border-gray-200 p-2">'
      )
      .replace(
        /<tr>/g, 
        '<tr class="hover:bg-gray-50">'
      );

    return { __html: formattedContent };
  };

  return (
    <div className="space-y-8">
      {/* Tabs pour la description et les vidéos */}
      <Tabs defaultValue="description">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          {videos.length > 0 && (
            <TabsTrigger value="videos">Vidéos ({videos.length})</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="description">
          <div 
            className="prose max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={createMarkup(description)}
          />
        </TabsContent>
        {videos.length > 0 && (
          <TabsContent value="videos">
            <div className="space-y-4">
              {videos.map((video, index) => (
                <ToolReviewVideo key={index} videoUrl={video} />
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Caractéristiques principales */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Caractéristiques principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="p-4">
              <p className="text-gray-700">{feature}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pros & Cons */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-600 flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            Avantages
          </h2>
          <ul className="space-y-3">
            {pros.map((pro, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-red-600 flex items-center gap-2">
            <XCircle className="w-6 h-6" />
            Inconvénients
          </h2>
          <ul className="space-y-3">
            {cons.map((con, index) => (
              <li key={index} className="flex items-start gap-2">
                <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Nouvelle section pour les liens sources */}
      {source_url.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Sources externes</h2>
          <div className="flex flex-wrap gap-2">
            {source_url.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-background border rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)] transition-all dark:border-border"
              >
                <span className="text-xs font-bold text-foreground">{index + 1}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
} 
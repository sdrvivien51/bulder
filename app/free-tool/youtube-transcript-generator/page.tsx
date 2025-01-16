"use client";

import { useState } from 'react';
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Copy, Download } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

interface Transcript {
  text: string;
  duration: number;
  offset: number;
}

export default function YoutubeTranscriptGenerator() {
  const [url, setUrl] = useState('');
  const [transcript, setTranscript] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { theme: _ } = useTheme();
  const { toast } = useToast();

  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const fetchTranscript = async () => {
    try {
      setLoading(true);
      const videoId = getYoutubeVideoId(url);
      
      if (!videoId) {
        throw new Error('URL YouTube invalide');
      }

      const response = await fetch(`/api/youtube-transcript?videoId=${videoId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération de la transcription');
      }

      const cleanText = (text: string) => {
        return text
          .replace(/&amp;/g, '&')
          .replace(/&#39;/g, '&apos;')
          .replace(/&quot;/g, '"')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/\s+/g, ' ')
          .trim();
      };

      const fullTranscript = data
        .map((item: Transcript) => cleanText(item.text))
        .join('\n');

      setTranscript(fullTranscript);

      toast({
        title: "Succès",
        description: "Transcription récupérée avec succès",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la récupération de la transcription",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      toast({
        title: "Copié !",
        description: "La transcription a été copiée dans le presse-papiers",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de copier la transcription",
        variant: "destructive",
      });
    }
  };

  const downloadTranscript = () => {
    try {
      const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transcript-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "Transcription téléchargée avec succès",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la transcription",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mt-[150px] mb-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            YouTube Transcript Generator
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Extrayez facilement la transcription de n&apos;importe quelle vidéo YouTube
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Collez l&apos;URL de la vidéo YouTube"
              className="flex-1"
            />
            <Button 
              onClick={fetchTranscript}
              disabled={loading}
            >
              {loading ? 'Chargement...' : 'Obtenir la transcription'}
            </Button>
          </div>
        </Card>

        {transcript && (
          <Card className="mt-4 p-4">
            <div className="flex justify-end space-x-2 mb-4">
              <Button
                onClick={copyToClipboard}
                variant="secondary"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copier
              </Button>
              <Button
                onClick={downloadTranscript}
                variant="secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            </div>
            <Textarea
              value={transcript}
              readOnly
              className="min-h-[300px]"
            />
          </Card>
        )}
      </div>
    </main>
  );
}

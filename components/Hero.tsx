"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { AnimatedSubscribeButton } from "@/components/ui/animated-subscribe-button";
import { useTheme } from "next-themes";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { theme } = useTheme();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    
    if (!email || !validateEmail(email)) {
      console.log("Email invalide");
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("API call success");
      
      setIsSubscribed(true);
      console.log("isSubscribed set to true");
      setEmail("");
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonColor = theme === 'dark' ? '#8b5cf6' : '#6366f1';
  const buttonTextColor = '#ffffff';

  console.log("Current isSubscribed state:", isSubscribed);

  return (
    <section className="container mx-auto px-4 min-h-[60vh] flex items-center justify-center">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
            Trouve l&apos;outil pour ta stack
          </h1>
          <p className="text-xl text-muted-foreground">
            Découvre et compare les meilleurs outils d&apos;IA et no-code pour automatiser ton workflow
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
            disabled={isLoading || isSubscribed}
          />
          <AnimatedSubscribeButton
            buttonColor={buttonColor}
            buttonTextColor={buttonTextColor}
            subscribeStatus={isSubscribed}
            initialText="S'inscrire"
            changeText="Inscrit ! ✓"
          />
        </form>
      </div>
    </section>
  );
}

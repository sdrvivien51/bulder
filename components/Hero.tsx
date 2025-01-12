"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Inscription à la newsletter avec l'email: ${email}`);
    setEmail("");
  };

  return (
    <section className="container mx-auto px-4 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
            Trouve l'outil pour ta stack
          </h1>
          <p className="text-xl text-muted-foreground">
            Découvre et compare les meilleurs outils d'IA et no-code pour automatiser ton workflow
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
          />
          <Button type="submit">
            S'inscrire
          </Button>
        </form>
      </div>
    </section>
  );
}

"use client"

import { useState, useEffect } from "react";
import { getTools } from "@/utils/nocodb";
import { Tool } from "@/utils/nocodb";
import ToolGrid from '@/components/ToolGrid';
import ToolFilters from '@/components/ToolFilters';
import Hero from '@/components/Hero';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    const fetchTools = async () => {
      const fetchedTools = await getTools();
      setTools(fetchedTools);
    };
    fetchTools();
  }, []);

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "tous" || 
      tool.categories.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <main>
      {/* Hero Section */}
      <Hero />

      {/* Tools Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8">
          <ToolFilters
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          <ToolGrid 
            tools={filteredTools}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        </div>
      </section>
    </main>
  );
}


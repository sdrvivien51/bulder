"use client"

import { useState, useEffect } from "react";
import { getTools, Tool } from "@/utils/nocodb";
import ToolGrid from '@/components/ToolGrid';
import ToolFilters from '@/components/ToolFilters';
import Hero from '@/components/Hero';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);

  // Récupérer les outils au chargement initial
  useEffect(() => {
    const fetchTools = async () => {
      const fetchedTools = await getTools();
      setTools(fetchedTools);
      setFilteredTools(fetchedTools);
    };
    fetchTools();
  }, []);

  // Filtrer les outils en fonction de la recherche et de la catégorie
  useEffect(() => {
    const filtered = tools.filter((tool) => {
      // Vérification de l'existence des propriétés
      const toolName = tool?.name || '';
      const toolDescription = tool?.description || '';
      const toolCategories = tool?.categories || '';

      const matchesSearch = searchQuery === '' || (
        toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        toolDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      const matchesCategory = 
        selectedCategory === 'tous' || toolCategories === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setFilteredTools(filtered);
  }, [searchQuery, selectedCategory, tools]);

  return (
    <>
      <Hero />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Nos Services</h1>
        <ToolFilters 
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
        <ToolGrid tools={filteredTools} />
      </div>
    </>
  );
}


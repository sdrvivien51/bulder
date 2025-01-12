import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToolFiltersProps {
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  selectedCategory: string;
}

export default function ToolFilters({
  onSearchChange,
  onCategoryChange,
  selectedCategory,
}: ToolFiltersProps) {
  const categories = [
    "tous",
    "ia conversationnelle",
    "génération d'images",
    "productivité",
    "automatisation",
    "base de données",
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 w-fit">
        <Input
          placeholder="Rechercher un outil..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-[400px]"
        />
        <Select
          value={selectedCategory}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem 
                key={category} 
                value={category}
                className="capitalize"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 
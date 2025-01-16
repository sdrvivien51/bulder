"use client";

import { useState } from 'react';
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Eye, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from 'next/image';

interface ShopifyVariant {
  id: number;
  title: string;
  price: string;
  sku: string;
  available: boolean;
  compare_at_price: string | null;
  grams: number;
  created_at: string;
  updated_at: string;
  featured_image?: {
    src: string;
    alt: string | null;
  };
}

interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  vendor: string;
  product_type: string;
  tags: string[];
  variants: ShopifyVariant[];
  images: {
    id: number;
    src: string;
    width: number;
    height: number;
    alt?: string;
  }[];
  options?: {
    name: string;
    values: string[];
  }[];
}

interface ProductDetailsProps {
  product: ShopifyProduct;
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

function ProductDetails({ product, isOpen, onClose, theme }: ProductDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-h-[95vh] flex flex-col
        ${theme === 'dark' 
          ? 'bg-gray-900 text-gray-100' 
          : 'bg-white text-gray-900'}`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold">{product.title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.variants[0]?.featured_image && (
                <div className="relative aspect-square">
                  <Image 
                    src={product.variants[0].featured_image.src} 
                    alt={product.title}
                    className="rounded-lg object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="space-y-4">
                <p><strong>Vendeur:</strong> {product.vendor}</p>
                <p><strong>Type:</strong> {product.product_type || 'Non spécifié'}</p>
                <div>
                  <strong>Tags:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-block px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Variantes:</h4>
                  <div className="space-y-2">
                    {product.variants.map((variant) => (
                      <div key={variant.id} className="p-3 bg-gray-800 rounded-lg">
                        <p>Titre: {variant.title}</p>
                        <p>Prix: ${variant.price}</p>
                        <p>SKU: {variant.sku}</p>
                        <p>Stock: {variant.available ? 'Disponible' : 'Indisponible'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {product.body_html && (
              <div>
                <h4 className="font-semibold mb-2">Description:</h4>
                <div 
                  className="prose prose-sm prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.body_html }} 
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ShopifyProductScraper() {
  const [domain, setDomain] = useState('');
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null);
  const { theme } = useTheme();
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const response = await fetch(`https://${cleanDomain}/products.json`);
      const data = await response.json();
      setProducts(data.products);
      toast({
        title: "Succès",
        description: `${data.products.length} produits récupérés`,
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les produits",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    try {
      // En-têtes détaillés
      const headers = [
        'ID Produit',
        'Titre',
        'Handle',
        'Description',
        'Date de publication',
        'Date de création',
        'Date de mise à jour',
        'Vendeur',
        'Type de produit',
        'Tags',
        // Variant details
        'Variante - ID',
        'Variante - Titre',
        'Variante - SKU',
        'Variante - Prix',
        'Variante - Prix comparé',
        'Variante - Poids (g)',
        'Variante - Stock',
        'Variante - Date de création',
        'Variante - Date de mise à jour',
        // Image details
        'Image principale - URL',
        'Image principale - Largeur',
        'Image principale - Hauteur',
        // Options
        'Options disponibles'
      ].join(';');

      const rows = products.map(product => {
        // Pour chaque produit, on prend la première variante comme référence
        const mainVariant = product.variants[0] || {};
        const mainImage = product.images[0] || {};
        
        return [
          product.id,
          `"${product.title}"`,
          `"${product.handle}"`,
          `"${product.body_html.replace(/"/g, '""')}"`, // Échapper les guillemets dans le HTML
          new Date(product.published_at).toLocaleString('fr-FR'),
          new Date(product.created_at).toLocaleString('fr-FR'),
          new Date(product.updated_at).toLocaleString('fr-FR'),
          `"${product.vendor}"`,
          `"${product.product_type}"`,
          `"${product.tags.join(', ')}"`,
          // Variant details
          mainVariant.id,
          `"${mainVariant.title}"`,
          `"${mainVariant.sku}"`,
          mainVariant.price,
          mainVariant.compare_at_price || '',
          mainVariant.grams,
          mainVariant.available ? 'En stock' : 'Rupture',
          new Date(mainVariant.created_at).toLocaleString('fr-FR'),
          new Date(mainVariant.updated_at).toLocaleString('fr-FR'),
          // Image details
          `"${mainImage.src || ''}"`,
          mainImage.width || '',
          mainImage.height || '',
          // Options
          `"${product.options?.map(opt => `${opt.name}: ${opt.values.join(', ')}`).join(' | ')}"`
        ].join(';');
      });

      const csvContent = [headers, ...rows].join('\n');
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `produits-${domain.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "Export CSV réussi avec tous les détails",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'export CSV",
        variant: "destructive",
      });
    }
  };

  return (
    <main className={theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}>
      <div className="mt-[150px] mb-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Shopify Product Scraper
          </h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-2xl`}>
            Extrayez facilement les données de produits depuis n&apos;importe quelle boutique Shopify
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <Card className={`p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Entrez l&apos;URL de la boutique Shopify"
              className={`flex-1 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            />
            <Button 
              onClick={fetchProducts}
              disabled={loading}
              className={theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}
            >
              {loading ? 'Chargement...' : 'Fetch Products'}
            </Button>
            {products.length > 0 && (
              <Button
                onClick={handleExportCSV}
                variant="secondary"
                className={theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </Button>
            )}
          </div>
        </Card>

        {products.length > 0 && (
          <Card className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Tags</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Vendor</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="p-3">
                        {product.variants[0]?.featured_image && (
                          <div className="relative w-12 h-12">
                            <Image 
                              src={product.variants[0].featured_image.src} 
                              alt={product.title}
                              className="rounded-md object-cover"
                              fill
                              sizes="48px"
                            />
                          </div>
                        )}
                      </td>
                      <td className="p-3">{product.title}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {product.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs rounded-full bg-secondary">
                              {tag}
                            </span>
                          ))}
                          {product.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs rounded-full bg-secondary">
                              +{product.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">${product.variants[0]?.price}</td>
                      <td className="p-3">{product.vendor}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.variants[0]?.available 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {product.variants[0]?.available ? 'En stock' : 'Rupture'}
                        </span>
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
      
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          theme={theme}
        />
      )}
    </main>
  );
} 
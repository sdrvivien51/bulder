import { getToolBySlug } from "@/utils/nocodb"
import ToolReviewHeader from "@/components/ToolReview/ToolReviewHeader"
import ToolReviewContent from "@/components/ToolReview/ToolReviewContent"
import ToolReviewGallery from "@/components/ToolReview/ToolReviewGallery"
import ToolReviewVideo from "@/components/ToolReview/ToolReviewVideo"
import ToolReviewComment from "@/components/ToolReview/ToolReviewComment"
import AlternativeTools from "@/components/ToolReview/AlternativeTools"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import ToolReviewFAQ from "@/components/ToolReview/ToolReviewFAQ"
import { BoxReveal } from "@/components/magicui/box-reveal";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";

interface FAQItem {
  question: string;
  answer: string;
}

interface RawFAQItem {
  question: string;
  answer: string;
}

const mockComments = [
  {
    id: 1,
    author: "John Doe",
    content: "Un excellent outil que j'utilise quotidiennement !",
    createdAt: "2024-03-20",
    rating: 5
  },
  {
    id: 2,
    author: "Jane Smith",
    content: "Très utile pour l'automatisation de mes tâches.",
    createdAt: "2024-03-19",
    rating: 4
  }
];

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const tool = await getToolBySlug(params.slug);

    if (!tool) {
      return {
        title: "Outil non trouvé",
        description: "L'outil que vous recherchez n'existe pas."
      }
    }

    return {
      title: tool.name,
      tagline: tool.tagline,
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Erreur",
      tagline: "Une erreur s'est produite lors du chargement de l'outil."
    }
  }
}

// Ajoutez une fonction pour récupérer les outils alternatifs
async function getAlternativeTools(currentToolId: string, category: string) {
  try {
    const { getTools } = await import("@/utils/nocodb");
    const allTools = await getTools();
    return allTools
      .filter(tool => 
        tool.Id !== currentToolId && 
        tool.categories.toLowerCase().includes(category.toLowerCase())
      )
      .slice(0, 3);
  } catch (error) {
    console.error('Error fetching alternative tools:', error);
    return [];
  }
}

export default async function ToolPage({ params }: { params: { slug: string } }) {
  try {
    // Ajout de logs pour déboguer
    console.log('Fetching tool with slug:', params.slug);
    
    const tool = await getToolBySlug(params.slug);
    console.log('Tool data received:', tool);

    if (!tool) {
      console.log('Tool not found, redirecting to 404');
      notFound();
    }

    // Log pour vérifier les données avant de récupérer les alternatives
    console.log('Tool categories:', tool.categories);
    console.log('Tool ID:', tool.Id);

    // Vérification des données requises
    if (!tool.categories || !tool.Id) {
      console.error('Missing required tool data:', { categories: tool.categories, id: tool.Id });
      throw new Error('Tool data is incomplete');
    }

    // Récupération des alternatives avec gestion d'erreur
    let alternativeTools = [];
    try {
      alternativeTools = await getAlternativeTools(tool.Id, tool.categories);
      console.log('Alternative tools found:', alternativeTools.length);
    } catch (alternativesError) {
      console.error('Error fetching alternatives:', alternativesError);
      // On continue même si la récupération des alternatives échoue
    }

    // Ajouter des logs pour déboguer
    console.log('Raw FAQ data:', tool.FAQ);

    const formattedFaqs: FAQItem[] = [];
    if (tool.FAQ && Array.isArray(tool.FAQ)) {
      console.log('FAQ is an array with length:', tool.FAQ.length);
      
      tool.FAQ.forEach((faqItem) => {
        console.log('Processing FAQ item:', faqItem);
        
        if (faqItem && typeof faqItem === 'object' && 'question' in faqItem && 'answer' in faqItem) {
          const { question, answer } = faqItem as RawFAQItem;
          formattedFaqs.push({
            question: question || 'Question non disponible',
            answer: answer || 'Réponse non disponible',
          });
        }
      });
    }

    console.log('Formatted FAQs:', formattedFaqs);

    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8 pl-0 sm:pl-4 lg:pl-6">
            <ToolReviewHeader 
              name={tool.name}
              rating={tool.rating}
              categories={tool.categories}
              pricing={tool.pricing}
              logo={tool.logo}
              website={tool.website}
              tagline={tool.tagline}
            />
            
            <div className="space-y-8">
              <ToolReviewContent 
                description={tool.description}
                features={[]}
                pros={tool.advantage || []}
                cons={tool.inconvenient || []}
                source_url={tool.source_url || []}
                videos={tool.youtube_url || []}
              />
              {tool.image && Array.isArray(tool.image) && tool.image.length > 0 && (
                <ToolReviewGallery images={tool.image} />
              )}
              {formattedFaqs.length > 0 ? (
                <ToolReviewFAQ faqs={formattedFaqs} />
              ) : (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Aucune FAQ disponible</h2>
                </div>
              )}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Commentaires</h2>
                <ToolReviewComment 
                  comments={tool.comments || []} 
                  toolId={tool.Id} 
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 pr-0 sm:pr-4 lg:pr-6">
            <AlternativeTools 
              tools={alternativeTools}
              adBanner={{
                image: "/ad-banner.jpg",
                link: "https://example.com",
                altText: "Advertisement"
              }}
            />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    // Amélioration de la gestion d'erreur
    console.error('Detailed error in ToolPage:', {
      error,
      slug: params.slug,
      message: error instanceof Error ? error.message : 'Unknown error'
    });

    // Si c'est une erreur 404, on utilise notFound()
    if (error instanceof Error && error.message.includes('not found')) {
      notFound();
    }

    // Pour les autres erreurs, on les remonte
    throw error;
  }
}
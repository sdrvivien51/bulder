import { getTools, getToolBySlug, Tool } from "@/utils/nocodb"
import ToolReviewHeader from "@/components/ToolReview/ToolReviewHeader"
import ToolReviewContent from "@/components/ToolReview/ToolReviewContent"
import ToolReviewGallery from "@/components/ToolReview/ToolReviewGallery"
import AlternativeTools from "@/components/ToolReview/AlternativeTools"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import ToolReviewFAQ from "@/components/ToolReview/ToolReviewFAQ"
import JsonLd from "@/components/JsonLd"

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
      description: tool.tagline,
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Erreur",
      description: "Une erreur s'est produite lors du chargement de l'outil."
    }
  }
}

// Fonction helper pour récupérer les alternatives
async function getAlternativeTools(currentTool: Tool): Promise<Tool[]> {
  try {
    const allTools = await getTools();
    console.log('Fetching alternatives for:', {
      currentToolId: currentTool.id,
      currentToolCategory: currentTool.categories,
      currentToolSlug: currentTool.slug
    });

    // Filtrer les alternatives
    const alternatives = allTools.filter(altTool => {
      const isSameCategory = altTool.categories.toLowerCase() === currentTool.categories.toLowerCase();
      const isDifferentTool = altTool.slug !== currentTool.slug;

      console.log('Comparing tool:', {
        toolSlug: altTool.slug,
        toolCategory: altTool.categories,
        isSameCategory,
        isDifferentTool
      });

      return isSameCategory && isDifferentTool;
    });

    console.log(`Found ${alternatives.length} alternatives`);
    return alternatives.slice(0, 3);
  } catch (error) {
    console.error('Error fetching alternative tools:', error);
    return [];
  }
}

export default async function ToolPage({ params }: { params: { slug: string } }) {
  try {
    const tool = await getToolBySlug(params.slug);
    
    if (!tool) {
      notFound();
    }

    // Récupérer les alternatives en utilisant l'outil actuel
    const alternativeTools = await getAlternativeTools(tool);
    console.log('Alternative tools:', alternativeTools);

    // Schema pour le produit
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": tool.name,
      "description": tool.description,
      "image": tool.banner_url,
      "brand": {
        "@type": "Brand",
        "name": tool.name
      },
      ...(tool.rating && {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": tool.rating,
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "1"
        }
      }),
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "url": tool.website
      }
    }

    // Schema pour la FAQ si elle existe
    const faqSchema = tool.FAQ && tool.FAQ.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": tool.FAQ.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    } : null

    return (
      <>
        <JsonLd data={productSchema} />
        {faqSchema && <JsonLd data={faqSchema} />}
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 pl-0 sm:pl-4 lg:pl-6">
              <ToolReviewHeader 
                name={tool.name}
                rating={tool.rating || null}
                categories={tool.categories}
                pricing={tool.pricing || null}
                logo={tool.logo || null}
                website={tool.website || null}
                tagline={tool.tagline || null}
              />
              
              <div className="space-y-8">
                <ToolReviewContent 
                  description={tool.description}
                  features={tool.features}
                  pros={tool.advantage}
                  cons={tool.inconvenient}
                  source_url={tool.source_url}
                  videos={tool.youtube_url}
                />
                {tool.banner_url && (
                  <ToolReviewGallery images={[tool.banner_url]} />
                )}
                {tool.FAQ && tool.FAQ.length > 0 && (
                  <ToolReviewFAQ faqs={tool.FAQ} />
                )}
              </div>
            </div>
            
            {/* Section des outils alternatifs */}
            <div className="lg:col-span-1 pr-0 sm:pr-4 lg:pr-6">
              {alternativeTools.length > 0 && (
                <AlternativeTools 
                  tools={alternativeTools}
                  adBanner={{
                    image: "/ad-banner.jpg",
                    link: "https://example.com",
                    altText: "Advertisement"
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error in ToolPage:', error);
    throw error;
  }
}
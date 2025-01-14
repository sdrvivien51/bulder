import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import TableOfContents from "@/components/TableOfContents"
import { Clock, Calendar } from "lucide-react"
import { getBlogPostBySlug } from "@/utils/nocodb"
import { getAllBlogPosts } from "@/utils/nocodb"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import ShareButtons from "@/components/ShareButtons"
import RelatedPosts from "@/components/RelatedPosts"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

interface BlogPostProps {
  params: {
    slug: string
  }
}
function addIdsToHeadings(htmlContent: string): string {
  return htmlContent.replace(
    /<h([23])[^>]*>(.*?)<\/h\1>/g,
    (match, level, content) => {
      const id = content
        .toLowerCase()
        .replace(/<[^>]+>/g, '') // Enlever les balises HTML
        .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères spéciaux par des tirets
        .replace(/^-+|-+$/g, ''); // Enlever les tirets au début et à la fin
      
      return `<h${level} id="${id}">${content}</h${level}>`;
    }
  );
}

export default async function BlogPost({ params }: BlogPostProps) {
  const post = await getBlogPostBySlug(params.slug)
  const allPosts = await getAllBlogPosts() // Récupérer tous les posts

  if (!post) {
    notFound()
  }

  // Extraction du contenu du body si nécessaire
  const contentMatch = post.content.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  const content = contentMatch ? contentMatch[1] : post.content

  const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  // Filtrer les articles connexes :
  // - Même catégorie
  // - Exclure l'article courant
  // - Limiter à 3 articles
  const relatedPosts = allPosts
    .filter(relatedPost => 
      relatedPost.slug !== params.slug && // Exclure l'article courant
      relatedPost.category === post.category // Même catégorie
    )
    .slice(0, 3) // Limiter à 3 articles
    .map(relatedPost => ({
      slug: relatedPost.slug,
      title: relatedPost.title,
      excerpt: relatedPost.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...', // Extraire un court extrait du contenu HTML
      coverImage: relatedPost.coverImage,
      date: new Date().toISOString(), // À adapter selon votre structure de données
      category: relatedPost.category
    }))

  const contentWithIds = addIdsToHeadings(content);

  return (
    <article className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span className="font-normal text-foreground">{post.title}</span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Image banner */}
      <div className="relative w-full h-[400px] mb-8">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover rounded-xl"
          priority
        />
      </div>

      {/* Header - Maintenant aligné avec le contenu principal */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          {/* Meta information row */}
          <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{readingTime} min de lecture</span>
            </div>
            
            <Separator orientation="vertical" className="h-4" />
            
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Publié le {format(new Date(), 'dd MMMM yyyy', { locale: fr })}</span>
            </div>
            
            <Separator orientation="vertical" className="h-4" />
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{post.category}</Badge>
            </div>
          </div>

          {/* Share buttons */}
          <ShareButtons />
        </div>

        <Separator className="my-8" />

        {/* Content container avec marges réduites */}
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1px_1fr] gap-8">
          {/* Table of contents */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <TableOfContents />
            </div>
          </aside>

          <Separator orientation="vertical" className="hidden lg:block" />

          <div className="space-y-12">
            {/* Contenu principal de l'article */}
            <main className="prose prose-lg dark:prose-invert max-w-none lg:pl-6">
              <div dangerouslySetInnerHTML={{ __html: contentWithIds }} />
            </main>

            {/* Articles similaires en dehors du main */}
            {relatedPosts.length > 0 && (
              <RelatedPosts posts={relatedPosts} />
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

// Génération des chemins statiques pour les articles
export async function generateStaticParams() {
  try {
    const { getAllBlogPosts } = await import('@/utils/nocodb')
    const posts = await getAllBlogPosts()
    
    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

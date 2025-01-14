import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar } from "lucide-react"
import { getBlogPostBySlug, BlogPost } from "@/utils/nocodb"
import { getAllBlogPosts } from "@/utils/nocodb"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import ShareButtons from "@/components/ShareButtons"
import RelatedPosts from "@/components/RelatedPosts"
import TableOfContents from "@/components/TableOfContents"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Interface pour les articles liés
interface RelatedPost {
  slug: string
  title: string
  excerpt: string
  coverImage: string
  date: string
  category: string
}

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

// Fonction pour ajouter des IDs aux titres
function addIdsToHeadings(content: string): { 
  contentWithIds: string
  tableOfContents: TableOfContentsItem[]
} {
  const toc: TableOfContentsItem[] = []
  
  // Remplacer les balises h2-h4 avec des IDs
  const contentWithIds = content.replace(
    /<h([2-3])>([^<]+)<\/h[2-4]>/g,
    (match, level, text) => {
      const id = text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")

      toc.push({
        id,
        text: text.trim(),
        level: parseInt(level, 10)
      })

      return `<h${level} id="${id}">${text}</h${level}>`
    }
  )

  return { contentWithIds, tableOfContents: toc }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)
  const allPosts = await getAllBlogPosts()

  if (!post) {
    notFound()
  }

  const wordCount = post.content.replace(/<[^>]+>/g, "").split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)

  // Ajouter les IDs aux titres et générer la table des matières
  const { contentWithIds, tableOfContents } = addIdsToHeadings(post.content)

  // Récupération des articles liés avec le typage correct
  const relatedPosts = allPosts
    .filter((relatedPost: BlogPost) => 
      relatedPost.slug !== params.slug && 
      relatedPost.category === post.category
    )
    .slice(0, 3)
    .map((relatedPost: BlogPost): RelatedPost => ({
      slug: relatedPost.slug,
      title: relatedPost.title,
      excerpt: relatedPost.content.substring(0, 150).replace(/<[^>]*>/g, "") + "...",
      coverImage: relatedPost.banner_url,
      date: relatedPost.date || new Date().toISOString(),
      category: relatedPost.category
    }))

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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8">
          <main className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: contentWithIds }} />
          </main>

          <aside className="hidden lg:block">
            {tableOfContents.length > 0 && (
              <div className="sticky top-8">
                <TableOfContents items={tableOfContents} />
              </div>
            )}
          </aside>
        </div>

        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} />
        )}
      </div>
    </article>
  )
}

export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts()
    return posts.map((post: BlogPost) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

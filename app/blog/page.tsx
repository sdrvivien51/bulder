import Link from 'next/link'
import Image from 'next/image'
import { getAllBlogPosts } from '@/utils/nocodb'
import ScrollProgress from '@/components/magicui/scroll-progress'

// Interface pour typer nos articles de blog
interface BlogPost {
  title: string
  content: string
  banner_url: string
  category: string
  slug: string
  date: string
  metadescription: string
}

export default async function BlogPage() {
  // Récupération des articles
  const posts = await getAllBlogPosts()

  return (
    <>
      <ScrollProgress className="top-[64px]" />
      <div className="container mx-auto px-4 py-8 pt-[80px]">
        {/* En-tête de la page */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-muted-foreground">
            Découvrez mes derniers articles et actualités
          </p>
        </header>

        {/* Grille d'articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: BlogPost) => (
            <Link 
              href={`/blog/${post.slug}`} 
              key={post.slug}
              className="group hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden"
            >
              <article className="border border-border rounded-lg overflow-hidden">
                {/* Image de couverture */}
                <div className="relative h-48 w-full">
                  <Image
                    src={post.banner_url}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Contenu de l'article */}
                <div className="p-4">
                  <div className="inline-block px-3 py-1 mb-3 text-sm bg-muted rounded-full">
                    {post.category}
                  </div>
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground line-clamp-2">
                    {post.metadescription.substring(0, 150)}
                  </p>
                  <div className="mt-4 text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface RelatedPost {
  slug: string
  title: string
  excerpt: string
  banner_url: string
  date: string
  category: string
}

interface RelatedPostsProps {
  posts: RelatedPost[]
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-8">Articles similaires</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="group"
          >
            <article className="bg-card rounded-lg overflow-hidden border transition-shadow hover:shadow-lg">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.banner_url}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">
                    {post.category}
                  </Badge>
                  <time className="text-sm text-muted-foreground">
                    {formatDate(post.date)}
                  </time>
                </div>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}

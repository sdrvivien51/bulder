'use client'

interface BlogContentProps {
  post: {
    title: string
    content: string
    banner_url: string
    category: string
    slug: string
    date: string
  }
}

export default function BlogContent({ post }: BlogContentProps) {
  return (
    <article className="border border-border rounded-lg overflow-hidden">
      {/* Contenu de l'article */}
      <div className="p-4">
        <div className="inline-block px-3 py-1 mb-3 text-sm bg-muted rounded-full">
          {post.category}
        </div>
        <h2 className="text-xl font-semibold mb-2 group-hover:text-primary">
          {post.title}
        </h2>
        <p className="text-muted-foreground line-clamp-2">
          {post.content.substring(0, 150)}...
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
  )
}

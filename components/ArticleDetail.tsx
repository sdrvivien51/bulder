interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

interface ArticleDetailProps {
  article: Article;
}

export default function ArticleDetail({ article }: ArticleDetailProps) {
  return (
    <article className="prose lg:prose-xl">
      <h1>{article.title}</h1>
      <p className="text-gray-500">
        Par {article.author} | Publié le {new Date(article.created_at).toLocaleDateString()}
      </p>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  );
}


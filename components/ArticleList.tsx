import Link from 'next/link';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
}

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  if (!articles || articles.length === 0) {
    return <div>Aucun article à afficher.</div>;
  }

  return (
    <div className="grid gap-4">
      {articles.map((article) => (
        <div key={article.id} className="border p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">
            <Link href={`/${article.slug}`} className="text-blue-600 hover:underline">
              {article.title}
            </Link>
          </h2>
          <p className="text-gray-600">{article.excerpt}</p>
        </div>
      ))}
    </div>
  );
}


"use client"

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  items: TableOfContentsItem[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  if (!items || items.length === 0) return null

  return (
    <nav className="space-y-1">
      <p className="font-medium mb-4 text-foreground">Table des matières</p>
      <div className="space-y-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block text-sm transition-colors hover:text-foreground ${
              item.level === 2 ? "pl-0" : "pl-4"
            } text-muted-foreground`}
          >
            {item.text}
          </a>
        ))}
      </div>
    </nav>
  )
}

// Exporter les types pour les utiliser ailleurs
export type { TableOfContentsItem, TableOfContentsProps }

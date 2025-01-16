"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  items: TableOfContentsItem[]
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-80px 0% -80% 0%",
        threshold: 1.0,
      }
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [items])

  if (!items || items.length === 0) return null

  return (
    <nav className="mt-64 sticky top-24 max-h-[calc(100vh-6rem)] overflow-auto rounded-lg bg-card p-6">
      <div className="space-y-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "block text-sm transition-all duration-200",
              item.level === 2 ? "pl-4" : "pl-8",
              activeId === item.id
                ? "bg-accent/50 text-primary font-medium"
                : "text-muted-foreground hover:bg-accent/30 hover:text-primary",
              "py-2 px-3 rounded-md"
            )}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(item.id)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
              })
            }}
          >
            {item.text}
          </a>
        ))}
      </div>
    </nav>
  )
}

export type { TableOfContentsItem, TableOfContentsProps }

"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TableOfContentsItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Cibler uniquement les titres dans le contenu principal de l'article
    const mainContent = document.querySelector('main[class*="prose"]')
    if (!mainContent) return

    // Récupérer les h2 et h3 uniquement dans le contenu principal
    const elements = Array.from(mainContent.querySelectorAll("h2, h3"))
    const items: TableOfContentsItem[] = elements.map((element) => ({
      id: element.id || element.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "",
      text: element.textContent || "",
      level: Number(element.tagName.charAt(1))
    }))

    // Ajouter des IDs aux éléments qui n'en ont pas
    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = items[index].id
      }
    })

    setHeadings(items)

    // Observer les sections pour le scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { 
        rootMargin: "-100px 0% -80% 0%",
        threshold: 1.0 
      }
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className="space-y-1">
      <p className="font-medium mb-4 text-foreground">Table des matières</p>
      <div className="space-y-1">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={cn(
              "block text-sm transition-colors hover:text-foreground",
              heading.level === 2 ? "pl-0" : "pl-4",
              activeId === heading.id
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            )}
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById(heading.id)
              if (element) {
                const yOffset = -100 // Ajustez selon votre header
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
                window.scrollTo({ top: y, behavior: "smooth" })
              }
            }}
          >
            {heading.text}
          </a>
        ))}
      </div>
    </nav>
  )
}

import Link from 'next/link'
import { Separator } from "@/components/ui/separator"

const footerLinks = [
  {
    title: "Légal",
    links: [
      { label: "Conditions d'utilisation", href: "/terms" },
      { label: "Politique de confidentialité", href: "/privacy" },
      { label: "Mentions légales", href: "/legal" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "À propos", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Twitter", href: "https://twitter.com/yourusername" },
      { label: "LinkedIn", href: "https://linkedin.com/in/yourusername" },
      { label: "GitHub", href: "https://github.com/yourusername" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-8 py-8 md:py-12 mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">OpenAutoma</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Découvrez les meilleurs outils d'IA et solutions no-code pour automatiser votre travail.
            </p>
          </div>
          
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="text-sm font-medium">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OpenAutoma. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-4">
            <Link 
              href="/sitemap.xml"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Plan du site
            </Link>
            <Link 
              href="/rss"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              RSS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

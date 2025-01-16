import ContactForm from "@/components/ContactForm"
import { Toaster } from "@/components/ui/toaster"

export default function ContactPage() {
  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-24 pt-[120px] pb-32 min-h-screen">
        <div className="max-w-2xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Contactez-nous</h1>
            <p className="text-muted-foreground text-lg">
  Vous avez un projet d&apos;automatisation ? Parlons-en ensemble !
</p>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-sm border">
            <ContactForm />
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  )
}

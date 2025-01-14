import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Outil non trouvé</h2>
      <p className="text-gray-600">
        Désolé, l&apos;outil que vous recherchez n&apos;existe pas ou a été supprimé.
      </p>
      <Button asChild>
        <Link href="/">
          Retour à l&apos;accueil
        </Link>
      </Button>
    </div>
  )
} 
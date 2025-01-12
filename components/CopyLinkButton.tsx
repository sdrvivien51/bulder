"use client"

import { Button } from "@/components/ui/button"
import { Link } from "lucide-react"

interface CopyLinkButtonProps {
  url: string
}

export default function CopyLinkButton({ url }: CopyLinkButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        navigator.clipboard.writeText(url)
      }}
    >
      <Link className="w-4 h-4 mr-2" />
      Copier le lien
    </Button>
  )
}

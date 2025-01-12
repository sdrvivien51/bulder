"use client"

import { Button } from "@/components/ui/button"
import { Twitter, Facebook } from "lucide-react"
import { LinkedinIcon } from "lucide-react"
import CopyLinkButton from "./CopyLinkButton"

export default function ShareButtons() {
  const currentUrl = window.location.href

  return (
    <div className="flex items-center gap-2">
      <CopyLinkButton url={currentUrl} />
      
      <Button variant="outline" size="icon" asChild>
        <a href={`https://twitter.com/intent/tweet?url=${currentUrl}`} target="_blank" rel="noopener noreferrer">
          <Twitter className="w-4 h-4" />
        </a>
      </Button>
      
      <Button variant="outline" size="icon" asChild>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`} target="_blank" rel="noopener noreferrer">
          <Facebook className="w-4 h-4" />
        </a>
      </Button>
      
      <Button variant="outline" size="icon" asChild>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`} target="_blank" rel="noopener noreferrer">
          <LinkedinIcon className="w-4 h-4" />
        </a>
      </Button>
    </div>
  )
}

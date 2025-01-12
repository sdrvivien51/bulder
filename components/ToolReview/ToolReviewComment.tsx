"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import ReCAPTCHA from "react-google-recaptcha"

interface Comment {
  prenom: string
  nom: string
  comments: string
  rating: number
}

interface ToolReviewCommentProps {
  comments?: Comment[]
  toolId: string
}

export default function ToolReviewComment({
  comments = [],
  toolId,
}: ToolReviewCommentProps) {
  const [prenom, setPrenom] = useState("")
  const [nom, setNom] = useState("")
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!captchaToken) {
      alert("Veuillez valider le captcha")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolId,
          prenom,
          nom,
          comments: comment,
          rating,
          captchaToken,
        }),
      })

      if (response.ok) {
        setPrenom("")
        setNom("")
        setComment("")
        setRating(5)
        setCaptchaToken(null)
        window.location.reload()
      } else {
        throw new Error('Erreur lors de la soumission')
      }
    } catch (error) {
      alert("Une erreur est survenue lors de l'envoi du commentaire")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Formulaire de commentaire */}
      <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg bg-card">
        <h3 className="text-xl font-semibold mb-4">Laisser un commentaire</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
          <Input
            placeholder="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 cursor-pointer transition-colors ${
                  i < rating ? "fill-yellow-500" : "fill-gray-300"
                }`}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
          
          <Textarea
            placeholder="Votre commentaire..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="min-h-[100px]"
          />
        </div>

        <div className="flex flex-col space-y-4">
          <ReCAPTCHA
            sitekey="6Ld2tLQqAAAAAALcNnrv5XyNZPH8_XVXUr-GwAMk"
            onChange={(token) => setCaptchaToken(token)}
          />

          <Button 
            type="submit" 
            disabled={isSubmitting || !captchaToken}
            className="w-full md:w-auto"
          >
            {isSubmitting ? "Envoi en cours..." : "Publier le commentaire"}
          </Button>
        </div>
      </form>

      {/* Liste des commentaires existants */}
      {Array.isArray(comments) && comments.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Commentaires</h3>
          {comments.map((comment, index) => (
            <div key={index} className="flex space-x-4 p-4 bg-card rounded-lg">
              <Avatar>
                <AvatarFallback>
                  {`${comment.prenom.charAt(0)}${comment.nom.charAt(0)}`}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">
                      {`${comment.prenom} ${comment.nom}`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < comment.rating ? "fill-yellow-500" : "fill-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-2 text-sm">{comment.comments}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 
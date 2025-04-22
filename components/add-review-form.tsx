"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/star-rating"
import { useToast } from "@/hooks/use-toast"
import { Loader2, LogIn } from "lucide-react"
import type { Review } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { createClient } from "@/lib/supabase-browser"

interface AddReviewFormProps {
  renterId: string
  onReviewAdded: (review: Review) => void
}

export default function AddReviewForm({ renterId, onReviewAdded }: AddReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()

  // Check authentication directly
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase.auth.getSession()

        if (data.session) {
          setIsAuthenticated(true)
          setCurrentUser(data.session.user)
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if user is authenticated
    if (!isAuthenticated || !currentUser) {
      toast({
        title: "Autenticación requerida",
        description: "Debe iniciar sesión para dejar una reseña",
        variant: "destructive",
      })
      return
    }

    // Validation
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Por favor, seleccione una calificación",
        variant: "destructive",
      })
      return
    }

    if (comment.trim().length < 10) {
      toast({
        title: "Error",
        description: "El comentario debe tener al menos 10 caracteres",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // Get user profile info
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", currentUser.id)
        .single()

      // Generate a UUID for the review
      const id = crypto.randomUUID()

      // Prepare the review data
      const newReview = {
        id,
        renter_id: renterId,
        host_id: currentUser.id,
        host_name: profile?.full_name || currentUser.email?.split("@")[0] || "Usuario",
        host_picture: profile?.avatar_url || "/placeholder.svg?height=40&width=40",
        rating: rating,
        comment: comment,
        created_at: new Date().toISOString(),
      }

      // Insert the review
      const { data, error } = await supabase.from("reviews").insert(newReview).select().single()

      if (error) {
        console.error("Insert error:", error)
        throw error
      }

      if (!data) {
        throw new Error("No se recibieron datos después de insertar la reseña")
      }

      // Format the review for the frontend
      const formattedReview: Review = {
        ...data,
        date: new Date(data.created_at).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      }

      // Update the UI with the new review
      onReviewAdded(formattedReview)

      // Reset the form
      setRating(0)
      setComment("")

      toast({
        title: "Reseña enviada",
        description: "Su reseña ha sido publicada exitosamente",
      })
    } catch (error: any) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar la reseña. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // If auth is still loading, show a loading state
  if (isAuthenticated === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cargando...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  // If user is not authenticated, show login prompt
  if (isAuthenticated === false) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Agregar una reseña</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <LogIn className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">
              Debe iniciar sesión para dejar una reseña sobre este arrendatario.
            </p>
            <Button asChild className="w-full">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Agregar una reseña</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Calificación</label>
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-2">
              Comentario
            </label>
            <Textarea
              id="comment"
              placeholder="Comparta su experiencia con este arrendatario..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Su reseña ayudará a otros anfitriones a tomar decisiones informadas.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Publicar reseña"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

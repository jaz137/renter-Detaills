"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase-singleton"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleTestLogin = async () => {
    setIsLoading(true)
    try {
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      })

      if (error) {
        throw error
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión como usuario de prueba",
      })
    } catch (error: any) {
      console.error("Error logging in:", error)
      toast({
        title: "Error de inicio de sesión",
        description: error.message || "No se pudo iniciar sesión",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleTestLogin} disabled={isLoading}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Iniciar sesión de prueba
    </Button>
  )
}

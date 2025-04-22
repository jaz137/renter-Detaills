"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Loader2 } from 'lucide-react'
import Link from "next/link"
import { createClient } from "@/lib/supabase-browser"

interface DirectAuthCheckProps {
  children: React.ReactNode
}

export default function DirectAuthCheck({ children }: DirectAuthCheckProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        
        
        const { data: sessionData } = await supabase.auth.getSession()
        
        
        if (!sessionData.session) {
          setIsAuthenticated(false)
          return
        }
        
        
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error checking auth:", error)
        
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isAuthenticated === false) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl">Acceso Restringido</CardTitle>
          <CardDescription>Necesita iniciar sesión para ver los detalles del arrendatario</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Esta información está disponible solo para usuarios registrados. Por favor inicie sesión o cree una cuenta
            para continuar.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" asChild>
            <Link href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}>Iniciar Sesión</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/register">Crear Cuenta</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return <>{children}</>
}

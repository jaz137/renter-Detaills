import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"

export default function AuthCheck() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-xl">Acceso Restringido</CardTitle>
          <CardDescription>
            Necesita iniciar sesión como anfitrión para ver los detalles del arrendatario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            Esta información es confidencial y solo está disponible para anfitriones registrados en la plataforma.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full">Iniciar Sesión</Button>
          <Button variant="outline" className="w-full">
            Registrarse como Anfitrión
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

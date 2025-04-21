import { Check } from "lucide-react"
import Link from "next/link"

interface VerifiedInfoProps {
  name: string
  verifiedItems: {
    identity: boolean
    email: boolean
    phone: boolean
  }
}

export default function VerifiedInfo({ name, verifiedItems }: VerifiedInfoProps) {
  return (
    <div className="bg-white rounded-lg border p-4 w-full">
      <h3 className="font-semibold text-lg mb-3">Información confirmada de {name}</h3>

      <div className="space-y-2">
        {verifiedItems.identity && (
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-2" />
            <span>Identidad</span>
          </div>
        )}

        {verifiedItems.email && (
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-2" />
            <span>Dirección de correo electrónico</span>
          </div>
        )}

        {verifiedItems.phone && (
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-2" />
            <span>Número de teléfono</span>
          </div>
        )}
      </div>

      <Link href="#" className="text-sm text-primary hover:underline block mt-3">
        Más información sobre la verificación de identidad
      </Link>
    </div>
  )
}

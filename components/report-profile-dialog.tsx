"use client"

import { ReactNode, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Flag, Loader2 } from "lucide-react"
import { reportRenter } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface ReportProfileDialogProps {
  renterId: string
  renterName: string
  children?: ReactNode
}


const reportReasons = [
  { id: "fake_profile", label: "Perfil falso o suplantación de identidad" },
  { id: "inappropriate_content", label: "Contenido inapropiado" },
  { id: "scam", label: "Intento de estafa" },
  { id: "bad_behavior", label: "Mal comportamiento no reportado en reseñas" },
  { id: "other", label: "Otro motivo" },
]

export default function ReportProfileDialog({ renterId, renterName }: ReportProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    
    if (!selectedReason) {
      toast({
        title: "Error",
        description: "Por favor, seleccione un motivo para el reporte",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await reportRenter(renterId, {
        reason: selectedReason,
        additionalInfo: additionalInfo.trim(),
      })

      toast({
        title: "Reporte enviado",
        description: "Gracias por ayudarnos a mantener la plataforma segura",
      })

      
      setIsOpen(false)
      setSelectedReason("")
      setAdditionalInfo("")
    } catch (error) {
      console.error("Error submitting report:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar el reporte. Intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
          <Flag className="h-4 w-4 mr-2" />
          Reportar perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reportar perfil de {renterName}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Motivo del reporte</h4>
              <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
                {reportReasons.map((reason) => (
                  <div key={reason.id} className="flex items-start space-x-2 mb-2">
                    <RadioGroupItem value={reason.id} id={reason.id} />
                    <Label htmlFor={reason.id} className="font-normal">
                      {reason.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="additional-info" className="text-sm font-medium mb-2 block">
                Información adicional (opcional)
              </Label>
              <Textarea
                id="additional-info"
                placeholder="Proporcione detalles adicionales sobre el problema..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="text-xs text-muted-foreground">
              <p>
                Su reporte será revisado por nuestro equipo. Todos los reportes son confidenciales y ayudan a mantener
                la plataforma segura para todos los usuarios.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar reporte"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

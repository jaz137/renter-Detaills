"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { WhatsappLogo } from "./icons/whatsapp-logo"

interface WhatsAppQRDialogProps {
  phoneNumber: string
  renterName: string
}

export default function WhatsAppQRDialog({ phoneNumber, renterName }: WhatsAppQRDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formattedPhone = phoneNumber.replace(/\s+/g, "").replace(/[^\d+]/g, "")
  const whatsappUrl = `https://wa.me/${formattedPhone}`
  const defaultMessage = `Hola ${renterName}, te contacto desde REDIBO sobre el alquiler de auto.`
  const whatsappUrlWithMessage = `${whatsappUrl}?text=${encodeURIComponent(defaultMessage)}`

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex justify-center items-center gap-2"
          style={{
            backgroundColor: "#FCA311", // Fondo naranja personalizado
            borderColor: "#FCA311", // Borde naranja personalizado
            color: "#000000", // Texto negro
          }}
        >
          <WhatsappLogo className="h-5 w-5" style={{ color: "#000000" }} /> {/* Ícono de WhatsApp en color negro */}
          Contactar por WhatsApp
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contactar por WhatsApp</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG
              value={whatsappUrlWithMessage}
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
              includeMargin={false}
            />
          </div>
          <p className="mt-4 text-sm text-center text-muted-foreground">
            Escanea este código QR con tu teléfono para iniciar una conversación de WhatsApp con {renterName}
          </p>
          <div className="mt-4 w-full">
            <Button
              className="w-full"
              style={{
                backgroundColor: "#FCA311", // Fondo naranja personalizado
                borderColor: "#FCA311", // Borde naranja personalizado
                color: "#000000", // Texto negro
              }}
              onClick={() => window.open(whatsappUrlWithMessage, "_blank")}
            >
              <WhatsappLogo className="mr-2 h-4 w-4" style={{ color: "#000000" }} /> {/* Ícono de WhatsApp en color negro */}
              Abrir WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

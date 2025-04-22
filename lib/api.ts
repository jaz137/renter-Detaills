import { supabase } from "./supabase-singleton"
import type { RenterDetailsType, Review, NewReview, ReportData, Report } from "./types"


function formatDate(dateString: string): string {
  if (!dateString) return "Fecha desconocida"

  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}


function formatDateRange(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return "Fechas desconocidas"

  const start = new Date(startDate)
  const end = new Date(endDate)

  return `${start.toLocaleDateString("es-ES", { day: "numeric" })} ${start.toLocaleDateString("es-ES", { month: "long" })} - ${end.toLocaleDateString("es-ES", { day: "numeric" })} ${end.toLocaleDateString("es-ES", { month: "long" })}, ${end.getFullYear()}`
}


export async function getFirstRenterId(): Promise<string | null> {
  const { data, error } = await supabase.from("renters").select("id").limit(1)

  if (error || !data || data.length === 0) {
    return null
  }

  return data[0].id
}


export async function fetchRenterDetails(renterId: string): Promise<RenterDetailsType> {
 
  const { data: renter, error: renterError } = await supabase.from("renters").select("*").eq("id", renterId).single()

  if (renterError) throw new Error(renterError.message)

  
  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("*")
    .eq("renter_id", renterId)
    .order("created_at", { ascending: false })

  if (reviewsError) throw new Error(reviewsError.message)

  
  const { data: rentalHistory, error: rentalError } = await supabase
    .from("rental_history")
    .select("*")
    .eq("renter_id", renterId)
    .order("start_date", { ascending: false })

  if (rentalError) throw new Error(rentalError.message)

  
  const processedReviews = reviews.map((review) => {
    
    if (!review.created_at) {
      review.created_at = new Date().toISOString()
    }
    return {
      ...review,
      host_name: review.host_name || "Anfitrión",
      host_picture: review.host_picture || "/placeholder.svg?height=40&width=40",
      date: formatDate(review.created_at),
    }
  })

  
  return {
    id: renter.id,
    firstName: renter.first_name || "",
    lastName: renter.last_name || "",
    age: renter.age || 0,
    occupation: renter.occupation || "No especificada",
    address: renter.address || "No especificada",
    email: renter.email || "",
    phone: renter.phone || "No especificado",
    profilePicture: renter.profile_picture || "/placeholder.svg?height=200&width=200",
    rating: Number.parseFloat(renter.rating) || 0,
    reviewCount: processedReviews.length,
    memberSince: formatDate(renter.member_since),
    completedRentals: rentalHistory.length,
    reviews: processedReviews,
    rentalHistory: rentalHistory.map((rental) => ({
      ...rental,
      car_model: rental.car_model || "Vehículo desconocido",
      dates: formatDateRange(rental.start_date, rental.end_date),
      status: rental.status || "Desconocido",
    })),
  }
}


export async function addReview(
  renterId: string,
  reviewData: { rating: number; comment: string },
  hostData?: { host_id: string; host_name: string; host_picture: string },
): Promise<Review> {
 
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    console.error("Auth error:", authError)
    throw new Error("Error de autenticación: " + authError.message)
  }

  if (!user) {
    console.error("No authenticated user found")
    throw new Error("Usuario no autenticado")
  }

  console.log("Authenticated user:", user.id)

 
  if (!hostData) {
    
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError && profileError.code !== "PGSQL_RELATION_DOES_NOT_EXIST") {
      console.error("Profile error:", profileError)
      throw new Error(profileError.message)
    }

    
    hostData = {
      host_id: user.id,
      host_name: profile?.full_name || user.email?.split("@")[0] || "Usuario",
      host_picture: profile?.avatar_url || "/placeholder.svg?height=40&width=40",
    }
  }

  const newReview: NewReview = {
    renter_id: renterId,
    ...hostData,
    rating: reviewData.rating,
    comment: reviewData.comment,
  }

  console.log("Submitting review:", newReview)

  const { data, error } = await supabase.from("reviews").insert(newReview).select().single()

  if (error) {
    console.error("Error inserting review:", error)
    throw new Error(error.message)
  }

  
  await updateRenterRating(renterId)

  return {
    ...data,
    date: formatDate(data.created_at),
  }
}


async function updateRenterRating(renterId: string) {
  
  const { data: reviews, error } = await supabase.from("reviews").select("rating").eq("renter_id", renterId)

  if (error) throw new Error(error.message)

  
  const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0)
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0

  
  const { error: updateError } = await supabase
    .from("renters")
    .update({ rating: averageRating.toFixed(2) })
    .eq("id", renterId)

  if (updateError) throw new Error(updateError.message)
}


export async function reportRenter(renterId: string, reportData: ReportData): Promise<Report> {
  
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    console.error("Auth error:", authError)
    throw new Error("Error de autenticación: " + authError.message)
  }

  if (!user) {
    console.error("No authenticated user found")
    throw new Error("Usuario no autenticado")
  }

  const newReport = {
    renter_id: renterId,
    reporter_id: user.id,
    reason: reportData.reason,
    additional_info: reportData.additionalInfo,
    status: "pending" as const,
  }

  
  const { data, error } = await supabase.from("reports").insert(newReport).select().single()

  if (error) {
    console.error("Error al guardar el reporte:", error)
    throw new Error(error.message)
  }

  return data
}

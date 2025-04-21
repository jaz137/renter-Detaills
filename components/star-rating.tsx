"use client"

import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  onRatingChange: (rating: number) => void
  max?: number
}

export function StarRating({ rating, onRatingChange, max = 5 }: StarRatingProps) {
  return (
    <div className="flex items-center">
      {[...Array(max)].map((_, i) => {
        const ratingValue = i + 1
        return (
          <Star
            key={i}
            className={`h-6 w-6 cursor-pointer transition-all ${
              ratingValue <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
            onClick={() => onRatingChange(ratingValue)}
            onMouseEnter={() => onRatingChange(ratingValue)}
          />
        )
      })}
      <span className="ml-2 text-sm font-medium">{rating > 0 ? `${rating} de ${max}` : ""}</span>
    </div>
  )
}

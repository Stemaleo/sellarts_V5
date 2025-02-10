"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  totalStars?: number;
  onRatingChange?: (rating: number) => void;
}

export function StarRatingComponent({ totalStars = 5, onRatingChange }: StarRatingProps = {}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleRating = (currentRating: number) => {
    setRating(currentRating);
    if (onRatingChange) {
      onRatingChange(currentRating);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            className={cn("transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-black rounded-full", hover >= starValue || rating >= starValue ? "text-yellow-400" : "text-gray-300")}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${starValue} out of ${totalStars} stars`}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
        );
      })}
      {/* <span className="ml-2 text-sm text-gray-600" aria-live="polite">
        {rating > 0 ? `${rating} out of ${totalStars} stars` : 'No rating selected'}
      </span> */}
    </div>
  );
}

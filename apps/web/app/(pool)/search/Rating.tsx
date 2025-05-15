import React from 'react'

const Rating = ({ rating, max = 5 }: { rating: number; max?: number }) => {
  const fullStars = Math.floor(rating);
  const partialStarPercentage = (rating % 1) * 100;
  const emptyStars = max - Math.ceil(rating);

  return (
    <div className="flex items-center">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <div key={`full-${i}`} className="text-[#EFBF04]">
          <StarIcon className="w-4 h-4 fill-current" />
        </div>
      ))}

      {/* Partial star */}
      {rating % 1 > 0 && (
        <div className="relative w-4 h-4">
          <StarIcon className="absolute w-4 h-4 text-gray-300 fill-current drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
          <div
            className="absolute w-4 h-4 overflow-hidden"
            style={{ width: `${partialStarPercentage}%` }}
          >
            <StarIcon className="w-4 h-4 text-[#EFBF04] fill-current drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
          </div>
        </div>
      )}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <div key={`empty-${i}`} className="text-gray-300">
          <StarIcon className="w-4 h-4 fill-current" />
        </div>
      ))}
    </div>
  )
}

export function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export default Rating
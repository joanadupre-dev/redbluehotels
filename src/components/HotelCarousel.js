"use client";

import { useRef } from "react";
import HotelCard from "@/components/HotelCard";

export default function HotelCarousel({ hoteis }) {
  const trackRef = useRef(null);

  function scroll(direction) {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstChild?.offsetWidth || 320;
    track.scrollBy({ left: direction * (cardWidth + 24), behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {hoteis.map((hotel) => (
          <div key={hotel.id} className="snap-start shrink-0 w-[280px] sm:w-[320px]">
            <HotelCard hotel={hotel} />
          </div>
        ))}
      </div>

      {hoteis.length > 1 && (
        <div className="flex gap-2 justify-end mt-4">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Anterior"
            className="h-9 w-9 rounded-full border border-navy-900/20 flex items-center justify-center hover:border-brick-500 hover:text-brick-500 transition-colors"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Próximo"
            className="h-9 w-9 rounded-full border border-navy-900/20 flex items-center justify-center hover:border-brick-500 hover:text-brick-500 transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

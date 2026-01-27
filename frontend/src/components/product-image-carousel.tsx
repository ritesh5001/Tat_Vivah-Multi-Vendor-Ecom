"use client";

import { useCallback, useMemo, useState } from "react";

interface ProductImageCarouselProps {
  images: string[];
  title?: string | null;
}

export default function ProductImageCarousel({
  images,
  title,
}: ProductImageCarouselProps) {
  const safeImages = useMemo(
    () => (images.length ? images : ["/images/product-placeholder.svg"]),
    [images]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      const maxIndex = safeImages.length - 1;
      if (index < 0) {
        setActiveIndex(maxIndex);
        return;
      }
      if (index > maxIndex) {
        setActiveIndex(0);
        return;
      }
      setActiveIndex(index);
    },
    [safeImages.length]
  );

  const visibleThumbs = safeImages.slice(0, 3);
  const remainingCount = Math.max(safeImages.length - 4, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-3xl border border-rose-100 bg-white/90 shadow-lg shadow-rose-100/30 dark:border-rose-500/20 dark:bg-slate-900/70">
        <img
          src={safeImages[activeIndex]}
          alt={title ?? "Product image"}
          className="aspect-[4/3] w-full bg-white object-contain p-6 dark:bg-slate-950"
          loading="lazy"
        />
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/50 bg-white/90 px-3 py-2 text-base font-semibold text-slate-700 shadow-md transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
          aria-label="Previous image"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/50 bg-white/90 px-3 py-2 text-base font-semibold text-slate-700 shadow-md transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
          aria-label="Next image"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {visibleThumbs.map((image, index) => {
          const isActive = index === activeIndex;
          const isLastThumb = index === visibleThumbs.length - 1;
          const showMore = remainingCount > 0 && isLastThumb;
          return (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => goTo(index)}
              className={`group relative overflow-hidden rounded-2xl border bg-white/80 dark:bg-slate-900/70 ${
                isActive
                  ? "border-rose-400 ring-2 ring-rose-200"
                  : "border-rose-100 hover:border-rose-300 dark:border-rose-500/20"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={title ?? "Product thumbnail"}
                className="aspect-square w-full object-contain p-2"
                loading="lazy"
              />
              {showMore ? (
                <div className="absolute inset-0 grid place-items-center bg-slate-900/70 text-sm font-semibold text-white">
                  +{remainingCount}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Image {activeIndex + 1} of {safeImages.length}
        </span>
        <span className="rounded-full border border-rose-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-500 dark:border-rose-500/30">
          Premium gallery
        </span>
      </div>
    </div>
  );
}

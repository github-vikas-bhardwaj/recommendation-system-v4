import Image from "next/image";

import { getShowImageSrc } from "@/lib/shows/format";

type ShowPosterProps = {
  src: string | null | undefined;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  placeholderClassName?: string;
  compact?: boolean;
  "aria-hidden"?: boolean;
};

export function ShowPoster({
  src,
  alt,
  sizes,
  className = "object-cover",
  priority = false,
  placeholderClassName = "",
  compact = false,
  "aria-hidden": ariaHidden,
}: ShowPosterProps) {
  const imageSrc = getShowImageSrc(src);

  if (!imageSrc) {
    return (
      <div
        aria-hidden={ariaHidden}
        className={`absolute inset-0 flex items-center justify-center bg-linear-to-br from-zinc-800 to-zinc-900 text-zinc-500 ${placeholderClassName}`}
      >
        {compact ? null : (
          <span className="px-3 text-center text-xs font-medium tracking-wide uppercase">
            No poster
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      aria-hidden={ariaHidden}
    />
  );
}

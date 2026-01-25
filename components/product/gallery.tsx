"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { GridTileImage } from "@/components/grid/tile";
import { useProduct, useUpdateURL } from "@/components/product/product-context";
import { useRTL } from "@/hooks/use-rtl";
import Image from "next/image";
import { startTransition } from "react";

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  const { state, updateImage } = useProduct();
  const updateURL = useUpdateURL();
  const { isRTL } = useRTL();
  const imageIndex = state.image ? Number.parseInt(state.image) : 0;

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const buttonClassName =
    "h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white flex items-center justify-center";

  return (
    <form>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {images[imageIndex] && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={images[imageIndex]?.altText as string}
            src={(images[imageIndex]?.src as string) || "/placeholder.svg"}
            priority={true}
          />
        )}

        {images.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur-sm dark:border-black dark:bg-neutral-900/80">
              <button
                formAction={() => {
                  // In RTL mode, the left button (visually) should go to the next image
                  const targetIndex = isRTL ? nextImageIndex : previousImageIndex;
                  const newState = updateImage(targetIndex.toString());
                  updateURL(newState);
                }}
                aria-label={isRTL ? "Next product image" : "Previous product image"}
                className={buttonClassName}
              >
                <ArrowLeftIcon className="h-5" />
              </button>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <button
                formAction={() => {
                  // In RTL mode, the right button (visually) should go to the previous image
                  const targetIndex = isRTL ? previousImageIndex : nextImageIndex;
                  const newState = updateImage(targetIndex.toString());
                  updateURL(newState);
                }}
                aria-label={isRTL ? "Previous product image" : "Next product image"}
                className={buttonClassName}
              >
                <ArrowRightIcon className="h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="my-12 flex items-center flex-wrap justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {images.map((image, index) => {
            const isActive = index === imageIndex;

            return (
              <li key={image.src} className="h-20 w-20">
                <div
                  onClick={() => {
                    startTransition(() => {
                      const newState = updateImage(index.toString());
                      updateURL(newState);
                    });
                  }}
                  aria-label="Select product image"
                  className="h-full w-full cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      startTransition(() => {
                        const newState = updateImage(index.toString());
                        updateURL(newState);
                      });
                    }
                  }}
                >
                  <GridTileImage
                    alt={image.altText}
                    src={image.src}
                    width={80}
                    height={80}
                    active={isActive}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </form>
  );
}

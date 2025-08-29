"use client";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

import {
  ProductCarouselButton,
  useProductCarouselButton,
} from "@/modules/ProductPage/ProductCarouselButtons";
import { StoreProductImage } from "@medusajs/types";


type ImageCarouselProps = {
  slides: StoreProductImage[] | null;
};
export function ProductCarousel({ slides }: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const { selectedIndex, onProductCarouselButtonClick } =
    useProductCarouselButton(emblaApi);

  return (
      <div className="flex flex-col-reverse md:flex-row max-md:justify-center gap-3">
        <div className="flex max-h-[384px] flex-shrink-0 md:flex-col gap-1 rounded-md md:overflow-x-hidden scrollbar-hidden overflow-y-auto">
          {slides?.map((slide, index) => (
            <ProductCarouselButton
              key={index}
              className={`overflow-hidden m-1 h-9 aspect-square flex-shrink-0 rounded-md border transition-transform duration-300 ${
                index === selectedIndex
                  ? "border-foreground border-2 scale-110"
                  : "border-foreground-300 opacity-80 hover:opacity-100"
              }`}
              onClick={() => onProductCarouselButtonClick(index)}
            >
              <Image
                alt={`Preview ${index}`}
                className="object-cover"
                height={32}
                src={slide.url}
                width={48}
              />
            </ProductCarouselButton>
          ))}
        </div>
        <div className="w-full flex justify-center">
          <div ref={emblaRef} className="max-w-sm h-fit border border-foreground-100 rounded-md overflow-hidden">
            <div className="flex">
              {slides?.map((slide: StoreProductImage, i: number) => {
                return (
                  <div key={i} className="flex-shrink-0 aspect-square overflow-hidden flex-grow-0 basis-full">
                    <Image
                      alt="image-slide"
                      className="min-w-0 object-cover"
                      height={250}
                      src={slide.url}
                      width={4000}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
  );
}

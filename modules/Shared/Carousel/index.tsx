"use client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import { DotButton, useDotButton } from "./dot-buttons"

type SlideType = {
  imageurl: string;
};

type ImageCarouselProps = {
  slides: SlideType[];
};
export function Carousel({ slides }: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ playOnInit: true, delay: 3000, stopOnInteraction: true }),
  ]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  return (
    <>
      <div className="w-full relative">
        <div ref={emblaRef} className="rounded-2xl overflow-hidden">
          <div className="flex">
            {slides.map((slide: SlideType, i: number) => {
              return (
                <div key={i} className="flex-shrink-0 flex-grow-0 basis-full ">
                  <Image
                    alt="image-slide"
                    className="min-w-0 object-cover"
                    height={250}
                    src={slide.imageurl}
                    width={4000}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2 absolute bottom-2 left-1/2 -translate-x-1/2">
          {scrollSnaps.map((_, index: number) => (
            <DotButton
              key={index}
              className={`h-2 rounded-full ${index === selectedIndex ? "bg-white w-6" : "bg-white/90 w-2"}`}
              onClick={() => onDotButtonClick(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

'use client';

import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { HOMEPAGE_JUMBOTRON } from '@data/homepage';
import Link from 'next/link';

const Jumbotron = ({ data }) => {
  const { t } = useTranslation('jumbotron');
  const slides = useMemo(() => Array.isArray(data) ? data : HOMEPAGE_JUMBOTRON, [data]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    skipSnaps: false,
    dragFree: false,
    align: 'start',
  });
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const autoplayRef = useRef();
  const [isPaused, setIsPaused] = React.useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect]);

  // Autoplay every 10 seconds, pause on hover/touch
  useEffect(() => {
    if (!emblaApi) return;
    const pause = () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      setIsPaused(true);
    };
    const resume = () => {
      pause();
      autoplayRef.current = setInterval(() => {
        if (emblaApi) emblaApi.scrollNext();
      }, 10000);
      setIsPaused(false);
    };
    if (!isPaused) resume();
    const node = emblaRef.current;
    if (node) {
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      node.addEventListener('touchstart', pause);
      node.addEventListener('touchend', resume);
    }
    return () => {
      pause();
      if (node) {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        node.removeEventListener('touchstart', pause);
        node.removeEventListener('touchend', resume);
      }
    };
    // eslint-disable-next-line
  }, [emblaApi, slides.length, emblaRef, isPaused]);

  const handlePausePlay = useCallback(() => {
    setIsPaused((prev) => {
      if (prev) {
        if (autoplayRef.current) clearInterval(autoplayRef.current);
        autoplayRef.current = setInterval(() => {
          if (emblaApi) emblaApi.scrollNext();
        }, 10000);
      } else {
        if (autoplayRef.current) clearInterval(autoplayRef.current);
      }
      return !prev;
    });
  }, [emblaApi]);

  const scrollTo = useCallback((idx) => emblaApi && emblaApi.scrollTo(idx), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  if (!slides.length) return null;

  return (
    <section
      className="relative w-full min-h-[420px] h-[100dvh] flex items-center bg-black overflow-hidden font-hk"
      role="region"
      aria-label="Jumbotron – carrousel principal"
    >
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="embla h-full w-full" ref={emblaRef}>
          <div className="embla__container flex h-full transition-all duration-700 will-change-transform">
            {slides.map((slide, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  className="embla__slide min-w-full h-full relative flex items-center justify-start transition-transform duration-700 will-change-transform"
                  key={idx}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Slide ${idx + 1} sur ${slides.length}`}
                  aria-hidden={!isSelected}
                  tabIndex={isSelected ? 0 : -1}
                >
                  <div className="absolute inset-0 w-full h-full z-0">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority={idx === 0}
                      fetchPriority={idx === 0 ? "high" : "auto"}
                      sizes="100vw"
                      className="object-cover object-center"
                      style={{ minHeight: 320 }}
                      draggable={false}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 z-10 transition-all" aria-hidden="true" />
                  <div className="relative z-20 flex flex-col items-start justify-center h-full text-left pl-15 lg:pl-30 max-w-[90vw] md:max-w-2xl w-full">
                    <h1 className="text-xl font-medium uppercase text-white mb-3 break-words max-w-full" style={{ textShadow: '0 2px 16px #000' }} id={`jumbotron-slide-title-${idx}`}>
                      {t(slide.title)}
                    </h1>
                    {slide.subtitle && (
                      <p className="text-md text-white font-light mb-4 max-w-full md:max-w-xl drop-shadow break-words" style={{ textShadow: '0 2px 16px #000' }}>
                        {t(slide.subtitle)}
                      </p>
                    )}
                    {slide.cta && (
                      <Link
                        href={slide.cta.href}
                        className="flex items-center justify-center px-2 py-8 bg-white text-black font-medium rounded-full shadow hover:bg-gray-100 transition text-xs md:text-xs hover:scale-95"
                        style={{ textDecoration: 'none' }}
                        tabIndex={isSelected ? 0 : -1}
                        aria-labelledby={`jumbotron-slide-title-${idx}`}
                      >
                        <span className="px-2 text-sm text-center w-full">{t(slide.cta.label)}</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Carousel controls */}
      <button
        onClick={scrollPrev}
        aria-label="Slide précédent"
        className="flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/70 text-white rounded-full p-1 transition"
        tabIndex={0}
      >
        <ChevronLeftIcon className="w-7 h-7" aria-hidden="true" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Slide suivant"
        className="flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/70 text-white rounded-full p-1 transition"
        tabIndex={0}
      >
        <ChevronRightIcon className="w-7 h-7" aria-hidden="true" />
      </button>
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30" role="tablist" aria-label="Navigation du carrousel">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`w-1.5 h-1.5 rounded-full ${idx === selectedIndex ? 'bg-white' : 'bg-white/40'} border border-white transition`}
            aria-label={`Aller au slide ${idx + 1}`}
            role="tab"
            aria-selected={selectedIndex === idx}
            tabIndex={selectedIndex === idx ? 0 : -1}
          />
        ))}
      </div>
      {/* Pause/Play Button */}
      <button
        onClick={handlePausePlay}
        aria-label={isPaused ? 'Lancer le défilement automatique' : 'Mettre en pause le défilement automatique'}
        className="absolute bottom-4 right-4 w-10 h-8 md:bottom-8 md:right-8 z-40 bg-black/30 hover:bg-black/60 text-white rounded-full p-1.5 flex items-center justify-center transition"
        type="button"
      >
        {isPaused ? (
          <PlayIcon className="w-5 h-5" aria-hidden="true" />
        ) : (
          <PauseIcon className="w-5 h-5" aria-hidden="true" />
        )}
      </button>
    </section>
  );
};

export default Jumbotron;

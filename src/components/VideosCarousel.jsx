'use client';

import React, { useEffect, useRef, useState } from "react";
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { ChevronLeftIcon, ChevronRightIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { HOMEPAGE_VIDEOS_CAROUSEL } from "@data/homepage";

// Responsive: number of visible videos
function getVisibleCount() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 3;
  return 5;
}

const VideosCarousel = () => {
  const { t } = useTranslation('common');
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef([]);

  // Responsive: update visibleCount on resize
  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount());
    setVisibleCount(getVisibleCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Play/pause videos depending on selection
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === selectedIndex) {
          video.muted = isMuted;
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [selectedIndex, isMuted, visibleCount]);

  // Compute which videos to display (always center the selected one)
  const getDisplayVideos = () => {
    const half = Math.floor(visibleCount / 2);
    const result = [];
    for (let i = -half; i <= half; i++) {
      let idx = (selectedIndex + i + HOMEPAGE_VIDEOS_CAROUSEL.length) % HOMEPAGE_VIDEOS_CAROUSEL.length;
      result.push({ ...HOMEPAGE_VIDEOS_CAROUSEL[idx], absIdx: idx, rel: i });
    }
    return result.slice(0, visibleCount);
  };

  const displayVideos = getDisplayVideos();

  // Navigation
  const scrollPrev = () => {
    setSelectedIndex((prev) => (prev - 1 + HOMEPAGE_VIDEOS_CAROUSEL.length) % HOMEPAGE_VIDEOS_CAROUSEL.length);
  };
  const scrollNext = () => {
    setSelectedIndex((prev) => (prev + 1) % HOMEPAGE_VIDEOS_CAROUSEL.length);
  };

  // Handle click on previous/next video
  const handleVideoClick = (rel) => {
    if (rel === -1) scrollPrev();
    if (rel === 1) scrollNext();
  };

  return (
    <>
      <div className="w-full p-2">
        <Link href="/about-us" style={{ textDecoration: 'none' }}>
          <h1
            className="text-center text-xl text-gray-700 uppercase antialiased font-light font-stretch-condensed"
            style={{ fontWeight: 'lighter' }}
          >
            {t('home_page_about_us')}
          </h1>
        </Link>
      </div>
      <div className="flex justify-center items-center w-full h-[400px] lg:h-[550px] my-4">
        {displayVideos.map(video => {
          // Style according to position relative to selection
          const isSelected = video.rel === 0;
          const base =
            "relative overflow-hidden group transition-all duration-800 flex flex-col items-center justify-center shadow-lg rounded-2xl";
          const height = isSelected ? "h-[400px] lg:h-[500px]" : "h-[400px]";
          const width = "w-[300px]";
          const z = isSelected ? "z-10" : "z-0";
          const scale = isSelected ? "scale-105 opacity-100" : "scale-85 opacity-80";
          const cursor = video.rel === -1 || video.rel === 1 ? "cursor-pointer" : "cursor-default";

          return (
            <div
              key={video.absIdx}
              className={clsx(base, height, width, z, scale, cursor, "flex items-center justify-center")}
              onClick={() => handleVideoClick(video.rel)}
            >
              <video
                ref={el => (videoRefs.current[video.absIdx] = el)}
                src={video.src}
                className="object-cover w-full h-full"
                muted={isMuted}
                autoPlay={isSelected}
                loop
                playsInline
                preload="metadata"
                tabIndex={-1}
              />
              {/* Mute/unmute button on selected video */}
              {isSelected && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setIsMuted(m => !m);
                  }}
                  className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition z-20"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  type="button"
                  style={{ borderRadius: "100%" }}
                >
                  {isMuted ? (
                    <SpeakerXMarkIcon className="w-5 h-5" />
                  ) : (
                    <SpeakerWaveIcon className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center">
        <div className="flex gap-4">
          <button
            onClick={scrollPrev}
            aria-label="Précédent"
            className="w-10 p-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 transition disabled:opacity-40 shadow-md"
            type="button"
            style={{ borderRadius: "100%" }}
          >
            <ChevronLeftIcon className="w-full" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Suivant"
            className="w-10 p-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 transition disabled:opacity-40 shadow-md"
            type="button"
            style={{ borderRadius: "100%" }}
          >
            <ChevronRightIcon className="w-full" />
          </button>
        </div>
      </div>
    </>
  );
};

export default VideosCarousel;
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { MENU } from "@data/menu";

const BigCards = () => {
  const { t } = useTranslation('common');

  return (
    <div
      id="big-cards"
      className="w-full flex flex-col md:flex-row md:gap-0 gap-0"
    >
      {MENU.map(({ title, position }) => {
        if (position !== 'static') return null;
        const cardName = t(title);

        return (
          <div
            key={title}
            className="relative flex-1 flex items-center justify-center w-full min-h-[15rem] md:min-h-[40rem] overflow-hidden group transition-opacity duration-300 opacity-100 hover:opacity-80"
          >
            <div className="flex flex-col items-center justify-center z-10">
              <Link
                href={`/${title}`}
                className="text-2xl md:text-3xl font-bold mb-4 capitalize text-white"
							  style={{ textDecoration: 'none' }}
              >
                <h3>{cardName}</h3>
              </Link>
            </div>
            <Image
              src={`/img/bigCards/${title}_categorie.webp`}
              alt={cardName}
              fill
              sizes="100vw"
              className="object-cover object-[center_15%] md:object-top transition-transform duration-700 group-hover:scale-105"
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/40 z-0" />
          </div>
        );
      })}
    </div>
  );
};

export default BigCards;

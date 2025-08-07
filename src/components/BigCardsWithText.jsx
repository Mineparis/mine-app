import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from 'next-i18next';

function BigImage({ label, link, index, imageName }) {
  const src = imageName
    ? `/img/bigCards/${imageName}.webp`
    : `/img/bigCards/subcategory${index}.webp`;

  const content = (
    <div
      className="flex items-center justify-center w-24 md:w-full h-56 md:h-56 m-[5px] relative overflow-hidden rounded-lg group cursor-pointer bg-gray-100 dark:bg-gray-800"
      tabIndex={0}
      aria-label={label}
      role="figure"
    >
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
        <h5 className="text-white text-lg font-semibold text-center px-2">{label}</h5>
      </div>
      <Image
        src={src}
        alt={label || ''}
        fill
        sizes="(max-width: 768px) 100vw, 24rem"
        className="object-cover object-top"
        draggable={false}
        priority
      />
    </div>
  );

  if (link) {
    return (
      <Link
        href={link}
        aria-label={label}
        tabIndex={0}
        className="focus:outline-primary focus-visible:ring-2 focus-visible:ring-primary"
      >
        {content}
      </Link>
    );
  }
  return content;
}

function BigCardsWithText({ title, description, cards, buttonLink, imageName, onClick }) {
  const { t } = useTranslation('common');
  const isSingleCard = !cards || cards.length < 2;

  return (
    <section
      id="big-cards-text"
      aria-labelledby="big-cards-title"
      className="flex flex-col md:flex-row w-full px-8 md:px-20 py-8 md:py-20"
    >
      <div
        className={`flex flex-col justify-center mr-4 mb-4 ${isSingleCard ? 'flex-[1.5]' : 'flex-[0.5]'} w-full`}
        data-single-card={isSingleCard}
      >
        <h2 id="big-cards-title" className="text-xl font-bold text-center mb-2">{title}</h2>
        <p className="mb-4 text-xs text-gray-700">{description}</p>
        {!onClick && buttonLink ? (
          <Link
            href={buttonLink}
            aria-label={t('see_more')}
            className="inline-block border border-primary text-primary px-6 py-2 rounded-lg font-semibold hover:bg-primary hover:text-white transition focus:outline-primary focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t('see_more')}
          </Link>
        ) : null}
        {onClick && !buttonLink ? (
          <button
            onClick={onClick}
            className="inline-block border border-primary text-primary px-6 py-2 rounded-lg font-semibold hover:bg-primary hover:text-white transition focus:outline-primary focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t('do_survey')}
            type="button"
          >
            {t('do_survey')}
          </button>
        ) : null}
      </div>
      <div className="flex flex-1 flex-row justify-evenly flex-wrap md:flex-nowrap">
        {imageName && !cards?.length && <BigImage imageName={imageName} />}
        {!imageName && cards?.map(({ label, link }, index) => (
          <BigImage key={label} label={label} link={link} index={index} />
        ))}
      </div>
    </section>
  );
}

export default BigCardsWithText;
import Head from 'next/head';
import Image from 'next/image';

import { aboutUs } from '@data/aboutUs';

export default function AboutUsPage() {
  const pageTitle = 'À propos de nous | Mine Paris';
  const metaDescription = aboutUs.jumbotron.description;
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content="https://mineparis.com/about-us" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={aboutUs.jumbotron.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={aboutUs.jumbotron.image} />
      </Head>

      {/* Jumbotron Section */}
      <section className="relative min-h-screen w-full overflow-x-hidden">
        <Image
          className="object-cover object-center z-0"
          src={aboutUs.jumbotron.image}
          alt="Mine Paris Jumbotron"
          fill
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 flex items-center justify-start z-20">
          <div className="w-full max-w-3xl ml-0 md:ml-12 py-16 md:py-24 text-white flex flex-col text-left pl-8 lg:pl-30">
            <h6 className="text-sm md:text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-gray-200 letter-spacing-5">{aboutUs.jumbotron.subtitle}</h6>
            <h1 className="text-2xl sm:text-4xl font-light mb-4 tracking-tight drop-shadow-lg uppercase">{aboutUs.jumbotron.title}</h1>
            <p className="text-xs md:text-lg max-w-2xl drop-shadow-lg font-light">{aboutUs.jumbotron.description}</p>
          </div>
        </div>
      </section>

      {/* Sections */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
        {aboutUs.sections.map((section, idx) => {
          // For Individualité and Inclusivité, align image to top
          const isTopAlignedImg = ["Individualité", "Inclusivité"].includes(section.title);
          return (
            <div
              key={section.title}
              className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16 py-12 w-full`}
            >
              <div className="w-full lg:w-1/2 px-0">
                <div className="mb-6">
                  <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">{section.subtitle}</h6>
                  <h2 className="text-2xl md:text-3xl font-light text-black mb-4">{section.title}</h2>
                  <p className="text-xs md:text-lg text-gray-700">{section.description}</p>
                </div>
              </div>
              <div className="w-full lg:w-1/2 px-0 flex items-start">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-md
    max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full mx-auto">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className={`object-cover ${isTopAlignedImg ? 'object-top' : 'object-center'}`}
                    priority
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 50vw"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

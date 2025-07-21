import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

const BlogPage = ({ blogArticles = [] }) => {
  const { t } = useTranslation('common');

  if (!blogArticles.length) return null;

  const [mainPost, ...posts] = blogArticles;

  // SEO meta
  const metaTitle = t('meta_title_magazine');
  const metaDescription = t('meta_description_magazine');
  const pageUrl = "https://mineparis.com/magazine";
  const ogImage = mainPost?.image?.src || '/img/slider/mine-carousel.jpg';

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={pageUrl} />
      </Head>

      {/* Main featured article as Jumbotron */}
      <section className="relative w-full min-h-[320px] h-[320px] md:min-h-[520px] md:h-[520px] flex items-stretch mb-8 overflow-hidden">
        <Image
          src={mainPost.image?.src || '/img/slider/mine-carousel.jpg'}
          alt={mainPost.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Overlay for readability */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-black/90 via-black/60 to-transparent
            md:from-black/80 md:via-black/40 md:to-transparent
            transition-colors
            duration-300
            pointer-events-none
          "
          aria-hidden="true"
        />
        {/* Content centered on image */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-2 sm:px-4">
          <div className="w-full max-w-2xl text-center bg-black/50 rounded-2xl px-3 py-4 md:px-4 md:py-8 backdrop-blur-xs mx-auto">
            <h1 className="text-white text-lg md:text-2xl font-bold drop-shadow-lg mb-3 leading-tight tracking-tight line-clamp-2">
              {mainPost.title}
            </h1>
            <p className="text-gray-100 text-base md:text-lg mb-4 line-clamp-3 drop-shadow">
              {mainPost.shortDescription}
            </p>
            <Link
              href={`/magazine/${mainPost.handle}`}
              className="inline-block px-5 py-2 bg-white font-semibold rounded-xl transition shadow-lg"
              style={{ textDecoration: 'none' }}
              aria-label={t('read_more', 'Lire l’article')}
            >
              {t('read_more', 'Lire l’article')}
            </Link>
          </div>
        </div>
      </section>

      {/* Grid of other articles */}
      <section aria-labelledby="blog-list-heading" className="max-w-7xl mx-auto px-4 my-5">
        <h2 id="blog-list-heading" className="sr-only">
          {t('other_articles', 'Autres articles')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((article) => (
            <article
              key={article.id}
              className="bg-white shadow hover:shadow-lg transition flex flex-col h-full rounded-2xl"
            >
              <Link
                href={`/magazine/${article.handle}`}
                className="block relative h-56 w-full overflow-hidden rounded-t-2xl"
                style={{ textDecoration: 'none' }}
              >
                <Image
                  src={article.image?.src}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105 rounded-t-2xl"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Link>
              <div className="flex flex-col flex-1 p-4">
                <Link
                  href={`/magazine/${article.handle}`}
                  className="block hover:text-primary-700 transition-colors"
                  style={{ textDecoration: 'none' }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.shortDescription}</p>
                <div className="mt-auto">
                  <Link
                    href={`/magazine/${article.handle}`}
                    className="inline-block text-primary font-semibold transition hover:text-primary-700"
                    style={{ textDecoration: 'none' }}
                    aria-label={t('read_more', 'Lire l’article')}
                  >
                    {t('read_more', 'Lire l’article')}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default BlogPage;

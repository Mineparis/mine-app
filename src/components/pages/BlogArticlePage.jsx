import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { renderShopifyRichText } from '@utils/shopifyRichText';

const BlogArticlePage = ({ blogArticle }) => {
  const { t } = useTranslation('common');

  if (!blogArticle) return null;

  const {
    title,
    description,
    image,
    publishedAt,
    handle,
  } = blogArticle;

  const pageUrl = `https://mineparis.com/magazine/${handle}`;
  const ogImage = image?.src || '/img/slider/mine-carousel.jpg';
  const metaTitle = t('meta_title_magazine');
  const metaDescription = t('meta_description_magazine');

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
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={pageUrl} />
      </Head>

      {/* Jumbotron full screen */}
      <div className="relative w-full min-h-[60vh] h-[60vh] md:h-[60vh] flex items-stretch overflow-hidden">
        {image?.src && (
          <Image
            src={image.src}
            alt={image.altText || title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" aria-hidden="true" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 md:px-6">
          <h1 className="text-white text-xl md:text-2xl font-bold text-center drop-shadow-lg mb-2 leading-tight tracking-tight max-w-3xl">
            {title}
          </h1>
          {publishedAt && (
            <time
              dateTime={publishedAt}
              className="block text-sm text-gray-200 text-center mb-2"
              suppressHydrationWarning
            >
              {new Date(publishedAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <section
          className="prose max-w-none text-gray-900 custom-prose-h1 prose-p:my-2 prose-h2:mt-6 prose-h2:mb-2 prose-h3:mt-4 prose-h3:mb-1 prose-img:rounded-xl prose-img:mx-auto prose-a:text-primary prose-a:underline hover:prose-a:text-primary-700"
          aria-label={t('article_content', 'Contenu de l’article')}
          tabIndex={0}
          dangerouslySetInnerHTML={{ __html: renderShopifyRichText(description) }}
        />

        <div className="mt-10 flex justify-center">
          <Link
            href="/magazine"
            className="px-6 py-2 bg-primary text-white font-semibold rounded-xl transition hover:bg-primary-700"
            style={{ textDecoration: 'none' }}
          >
            {t('back_to_magazine', 'Retour au magazine')}
          </Link>
        </div>
      </article>
    </>
  );
};

export default BlogArticlePage;
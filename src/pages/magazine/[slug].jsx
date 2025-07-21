import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getShopifyBlogArticleByHandle, getAllBlogArticleHandles } from '@lib/shopify/requests/blogs';
import { DEFAULT_LANG, REVALIDATE_PAGE_SECONDS } from '@utils/constants';
import BlogArticlePage from '@components/pages/BlogArticlePage';

export default function BlogArticleWrapper(props) {
  return <BlogArticlePage {...props} />;
}

export const getStaticPaths = async () => {
  const handles = await getAllBlogArticleHandles();

  return {
    paths: handles.map((handle) => ({ params: { slug: handle } })),
    fallback: 'blocking',
  };
};

export async function getStaticProps({ params, locale }) {
  const lang = locale || DEFAULT_LANG;
  const slug = params?.slug;

  const [blogArticle, translations] = await Promise.all([
    getShopifyBlogArticleByHandle(slug),
    serverSideTranslations(lang, ['common']),
  ]);

  if (!blogArticle) return { notFound: true };

  return {
    props: {
      ...translations,
      blogArticle,
    },
    revalidate: REVALIDATE_PAGE_SECONDS,
  };
}

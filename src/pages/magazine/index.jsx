import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { getShopifyBlogArticles } from '@lib/shopify/requests/blogs';
import { DEFAULT_LANG, REVALIDATE_PAGE_SECONDS } from '@utils/constants';
import BlogPage from '@components/pages/BlogPage';

export default function BlogWrapper(props) {
  return <BlogPage {...props} />;
}

export async function getStaticProps({ locale }) {
  const lang = locale || DEFAULT_LANG;

  const [blogArticles, translations] = await Promise.all([
    getShopifyBlogArticles(),
    serverSideTranslations(lang, ['common']),
  ]);

  return {
    props: {
      ...translations,
      blogArticles,
    },
		revalidate: REVALIDATE_PAGE_SECONDS,
  };
}

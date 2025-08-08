import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { getMultipleShopifyProducts } from '@lib/shopify/requests/multipleProducts';
import { getShopifyBlogArticles } from '@lib/shopify/requests/blogs';
import { PAGE_LIMIT, REVALIDATE_PAGE_SECONDS } from '@utils/constants';
import HomePage from '@components/pages/HomePage';

export default function HomePageWrapper(props) {
  return <HomePage {...props} />;
}

export async function getStaticProps({ locale }) {
  const lang = locale || 'fr';

  const [newProducts, bestSellersProducts, blogArticles] = await Promise.all([
    getMultipleShopifyProducts({ sortKey: 'CREATED_AT', limit: PAGE_LIMIT }),
    getMultipleShopifyProducts({ sortKey: 'BEST_SELLING', limit: PAGE_LIMIT }),
    getShopifyBlogArticles(12),
  ]);

  return {
    props: {
      ...(await serverSideTranslations(lang, ['common', 'jumbotron'])),
      bestSellersProducts,
      newProducts,
      blogArticles,
    },
    revalidate: REVALIDATE_PAGE_SECONDS,
  };
}

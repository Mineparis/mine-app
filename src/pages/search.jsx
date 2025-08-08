
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { fetchProducts } from '@lib/shopify/requests/shared';

import SearchPage from '@components/pages/SearchPage';

export default function SearchPageWrapper(props) {
  return <SearchPage {...props} />;
}

import { PAGE_LIMIT, SORT_OPTIONS } from '@utils/constants';

export async function getServerSideProps({ query, locale }) {
  const keyword = query.keyword || '';
  const lang = locale || 'fr';
  const page = parseInt(query.page, 10) || 1;
  const sortOptionSelected = query.sort || 'newest';
  const sortOptions = SORT_OPTIONS;
  let products = [];
  let nbProducts = 0;
  let totalPages = 1;

  if (keyword) {
    const shopifyQuery = `title:*${keyword}* OR vendor:*${keyword}*`;
    // Fetch all matching products for count and sorting
    const allProducts = await fetchProducts(shopifyQuery, 100);
    nbProducts = allProducts.length;

    let sortedProducts = [...allProducts];
    if (sortOptionSelected === 'price-asc') {
      sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOptionSelected === 'price-desc') {
      sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOptionSelected === 'newest') {
      sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    totalPages = Math.max(1, Math.ceil(nbProducts / PAGE_LIMIT));
    const start = (page - 1) * PAGE_LIMIT;
    const end = start + PAGE_LIMIT;
    products = sortedProducts.slice(start, end);
  }

  return {
    props: {
      ...(await serverSideTranslations(lang, 'common')),
      products,
      nbProducts,
      page,
      totalPages,
      sortOptionSelected,
      sortOptions,
      keyword,
    },
  };
}

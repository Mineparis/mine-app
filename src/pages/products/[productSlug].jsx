import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { getShopifyProductByHandle, getAllShopifyProductHandles } from '@lib/shopify/requests/productByHandle';
import { getProductsByConcerns } from '@lib/shopify/requests/productsByConcerns';
import { DEFAULT_LANG, REVALIDATE_PAGE_SECONDS } from '@utils/constants';
import ProductPage from '@components/pages/ProductPage';

export async function getStaticPaths() {
  const handles = await getAllShopifyProductHandles();
  
  const paths = handles.map((handle) => ({
    params: { productSlug: handle },
  }));
  
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params, locale }) {
  const { productSlug } = params;
  const lang = locale || DEFAULT_LANG;

  try {
    const [product, translations] = await Promise.all([
      getShopifyProductByHandle(productSlug),
      serverSideTranslations(lang, ['common']),
    ]);

    if (!product) {
      return { notFound: true };
    }

    const productConcerns = product.concerns || [];
    const primaryCategory = product.categories?.[0] || null;

    const similarProducts = await getProductsByConcerns(
      productConcerns,
      primaryCategory,
      product.handle,
      4
    );

    return {
      props: {
        ...translations,
        product,
        averageRating: null,
        comments: [],
        similarProducts,
      },
      revalidate: REVALIDATE_PAGE_SECONDS,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { notFound: true };
  }
}

export default function ProductSlugPage(props) {
  const router = useRouter();
  const { t } = useTranslation('common');
  
  if (router.isFallback) {
    return <div>{t('loading')}</div>;
  }

  return <ProductPage {...props} />;
}

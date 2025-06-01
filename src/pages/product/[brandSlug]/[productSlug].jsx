import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import qs from 'qs';

import { fetchAPI } from '@lib/api';
import { getShopifyProduct } from '@lib/shopify/requests/product';
import { getEnrichedProducts } from '@lib/shopify/requests/multipleProducts';
import { getCommentsAverageRating } from '@utils/comments';
import { DEFAULT_LANG, REVALIDATE_PAGE_SECONDS } from '@utils/constants';
import ProductPage from '@components/pages/ProductPage';

export const getStaticPaths = async () => {
	const products = await fetchAPI('/products?_locale=fr');

	return {
		paths: products.map(({ brandSlug, productSlug, locale }) => ({
			params: { brandSlug, productSlug },
			locale,
		})),
		fallback: 'blocking',
	};
};

export const getStaticProps = async ({ params, locale }) => {
	const { productSlug } = params;
	const lang = locale || DEFAULT_LANG;
	const products = await fetchAPI(`/products?productSlug=${productSlug}&_locale=${lang}`);
	const product = products?.[0];

	if (!product) return { notFound: true };

	const averageRating = getCommentsAverageRating(product.comments);

	// Query for similar products based on same category
	const query = qs.stringify({
		_where: {
			'categories.slug': product.categories.map(({ slug }) => slug),
			stock_gt: 0,
			id_ne: product.id,
		},
		_sort: 'sold:DESC',
		_limit: 4,
		_locale: lang,
	});

	try {
		const { products: similarProducts } = await getEnrichedProducts({
			dataURL: `/products?${query}`
		});

		const shopifyProduct = await getShopifyProduct(product.shopifyProductId);

		return {
			props: {
				...(await serverSideTranslations(lang, 'common')),
				product,
				shopifyProduct,
				similarProducts,
				averageRating,
			},
			revalidate: REVALIDATE_PAGE_SECONDS,
		};
	} catch (err) {
		return { notFound: true };
	}
};

export default function ProductSlugPage(props) {
	return <ProductPage {...props} />;
}

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { getEnrichedProducts } from '@lib/shopify/requests/multipleProducts';
import { DEFAULT_LANG, PAGE_LIMIT, sortQueryMapping } from '@utils/constants';
import BrandPage from '@components/pages/BrandPage';

export async function getServerSideProps({ params, query, locale }) {
	const slugRequested = params.brandSlug;
	const lang = locale || DEFAULT_LANG;
	const page = parseInt(query.page) || 1;
	const sort = query.sort || 'newest';

	const start = (page - 1) * PAGE_LIMIT;
	const sortQuery = sortQueryMapping[sort] || sortQueryMapping.newest;

	const countURL = `/products/count?brandSlug=${slugRequested}&_locale=${lang}`;
	const dataURL = `/products?brandSlug=${slugRequested}&_limit=${PAGE_LIMIT}&_start=${start}&_sort=${sortQuery}&_locale=${lang}`;

	const { products, nbProducts } = await getEnrichedProducts({ dataURL, countURL });

	if (!products || products.length === 0) {
		return { notFound: true };
	}

	return {
		props: {
			...(await serverSideTranslations(lang, ['common'])),
			products,
			nbProducts,
			slugRequested,
			brandName: products[0].brand,
			currentPage: page,
			sortOption: sort,
		},
	};
}

export default function BrandSlugPage(props) {
	return <BrandPage {...props} />;
}

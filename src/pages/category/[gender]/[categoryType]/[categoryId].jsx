import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { fetchAPI } from '@lib/api';
import { DEFAULT_LANG, PAGE_LIMIT, sortQueryMapping } from '@utils/constants';
import { getEnrichedProducts } from '@lib/shopify/requests/multipleProducts';
import CategoryPage from '@components/pages/CategoryPage';

export const getServerSideProps = async ({ locale, params, query, res }) => {
	const { gender, categoryType, categoryId } = params;
	const { sort = 'newest', page = 1 } = query;

	const lang = locale || DEFAULT_LANG;
	const start = (Number(page) - 1) * PAGE_LIMIT;
	const sortQuery = sortQueryMapping[sort] || sortQueryMapping.newest;

	const commonParams = [
		`categories.gender=${gender}`,
		`categories.parent=${categoryType}`,
		`categories.categoryId=${categoryId}`,
		`_locale=${lang}`,
	];

	const dataURL = `/products?${[
		...commonParams,
		`_limit=${PAGE_LIMIT}`,
		`_start=${start}`,
		`_sort=${sortQuery}`,
	].filter(Boolean).join('&')}`;

	const countURL = `/products/count?${commonParams.filter(Boolean).join('&')}`;

	const categories = await fetchAPI(
		`/categories?gender=${gender}&parent=${categoryType}&_locale=${lang}`
	);

	const matchedCategory = categories.find(c => c.categoryId === categoryId);
	if (!matchedCategory) return { notFound: true };

	const { products, nbProducts } = await getEnrichedProducts({ dataURL, countURL });

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			category: matchedCategory,
			products,
			nbProducts,
			page: Number(page),
			sortOptionSelected: sort,
			typesSelected: [categoryId],
		},
	};
};

export default function CategoryIdPage(props) {
	return <CategoryPage {...props} />;
}

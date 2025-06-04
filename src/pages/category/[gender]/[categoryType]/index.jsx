import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import CategoryPage from '@components/pages/CategoryPage';
import { fetchAPI } from '@lib/api';
import { DEFAULT_LANG, PAGE_LIMIT, sortQueryMapping } from '@utils/constants';
import { getEnrichedProducts } from '@lib/shopify/requests/multipleProducts';

const buildOrFilterQuery = (key, values) =>
	values && values.length
		? values.map((v, i) => `_where[_or][${i}][${key}]=${v}`).join('&')
		: '';

export const getServerSideProps = async ({ locale, params, query, res }) => {
	const { gender, categoryType } = params;
	const { sort = 'newest', page = 1, types } = query;
	const lang = locale || DEFAULT_LANG;
	const start = (Number(page) - 1) * PAGE_LIMIT;
	const sortQuery = sortQueryMapping[sort] || sortQueryMapping.newest;
	const selectedTypes = types ? types.split(',') : [];

	const filtersQuery = buildOrFilterQuery('categories.categoryId', selectedTypes);

	const commonParams = [
		`categories.gender=${gender}`,
		`categories.parent=${categoryType}`,
		`_locale=${lang}`,
		filtersQuery,
	];

	const dataURL = `/products?${[
		...commonParams,
		`_limit=${PAGE_LIMIT}`,
		`_start=${start}`,
		`_sort=${sortQuery}`,
	].filter(Boolean).join('&')}`;

	const countURL = `/products/count?${commonParams.filter(Boolean).join('&')}`;

	const categories = await fetchAPI(`/categories?gender=${gender}&parent=${categoryType}&_locale=${lang}`);
	const menuData = await fetchAPI(`/categories/menu/paths`);
	const subCategories = menuData
		.filter(data => data.gender === gender && data.categoryType === categoryType && data.locale === lang)
		.map(data => ({ categoryId: data.categoryId, name: data.categoryName }));

	if (!categories?.length) return { notFound: true };

	const { products, nbProducts } = await getEnrichedProducts({ dataURL, countURL });

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			category: categories[0],
			subCategories,
			products,
			nbProducts,
			page: Number(page),
			sortOptionSelected: sort,
			typesSelected: selectedTypes,
		},
	};
};

export default function CategoryIndexPage(props) {
	return <CategoryPage {...props} />;
}

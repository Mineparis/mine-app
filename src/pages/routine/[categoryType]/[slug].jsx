import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import RoutinePage from '@components/pages/RoutinePage';
import { fetchAPI } from '@lib/api';
import { getEnrichedProducts } from '@lib/shopify/requests/multipleProducts';
import { DEFAULT_LANG, PAGE_LIMIT, sortQueryMapping } from '@utils/constants';

export const getServerSideProps = async ({ locale, params, query, res }) => {
	const lang = locale || DEFAULT_LANG;
	const { slug } = params;
	const { sort = 'newest', page = 1, type = '' } = query;

	const currentPage = Number(page) || 1;
	const start = (currentPage - 1) * PAGE_LIMIT;
	const sortQuery = sortQueryMapping[sort] || sortQueryMapping.newest;

	const [routine] = await fetchAPI(`/routines?slug=${slug}&_locale=${lang}`);
	if (!routine) return { notFound: true };

	const commonParams = [
		`routines.slug=${routine.slug}`,
		`_locale=${lang}`,
	];

	const dataURL = `/products?${[
		...commonParams,
		`_limit=${PAGE_LIMIT}`,
		`_start=${start}`,
		`_sort=${sortQuery}`,
	].join('&')}`;

	const allProductsURL = `/products?${commonParams.join('&')}`;
	const { products } = await getEnrichedProducts({ dataURL });

	const totalProducts = await fetchAPI(allProductsURL);
	const nbProducts = totalProducts.length;

	return {
		props: {
			...(await serverSideTranslations(lang, ['common'])),
			routine,
			products,
			nbProducts,
			page: currentPage,
			sortOptionSelected: sort,
			typeSelected: type,
		},
	};
};

export default function RoutineIndexPage(props) {
	return <RoutinePage {...props} />;
}

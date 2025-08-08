import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getProductsByPreoccupation } from '@lib/shopify/requests/productsByPreoccupation';
import CategoryPage from '@components/pages/CategoryPage';
import { DEFAULT_LANG, PAGE_LIMIT, SORT_OPTIONS } from '@utils/constants';
import { MENU } from '@data/menu';

function PreoccupationPage(props) {
	return <CategoryPage {...props} />;
}

export const getServerSideProps = async ({ locale, params, query }) => {
	const { category, preoccupation } = params;
	const { sort = 'newest', page = 1 } = query;
	const lang = locale || DEFAULT_LANG;

	const categoryItem = MENU.find(({ title }) => title === category);

	if (!categoryItem) {
		return {
			notFound: true,
		};
	}

	try {
		const allProducts = await getProductsByPreoccupation(category, preoccupation);

		let sortedProducts = [...allProducts];
		switch (sort) {
			case 'price-asc':
				sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
				break;
			case 'price-desc':
				sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
				break;
			case 'newest':
			default:
				// Products are already sorted by default (newest first)
				break;
		}

		const totalProducts = sortedProducts.length;
		const totalPages = Math.ceil(totalProducts / PAGE_LIMIT);
		const pageNumber = parseInt(page, 10);
		const startIndex = (pageNumber - 1) * PAGE_LIMIT;
		const endIndex = startIndex + PAGE_LIMIT;
		const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

		const preoccupationData = categoryItem.preoccupations?.find(p => p.slug === preoccupation);
		const preoccupationTitle = preoccupationData?.title || preoccupation
			.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

		return {
			props: {
				categoryName: category,
				subCategoryName: null,
				subCategoryTitle: preoccupationTitle,
				products: paginatedProducts,
				nbProducts: totalProducts,
				page: pageNumber,
				totalPages,
				sortOptionSelected: sort,
				sortOptions: SORT_OPTIONS,
				isAllCategory: false,
				isPreoccupationPage: true,
				...(await serverSideTranslations(lang, ['common', 'menu'])),
			},
		};
	} catch (error) {
		console.error('Error fetching products by preoccupation:', error);
		return {
			props: {
				categoryName: category,
				subCategoryName: null,
				subCategoryTitle: preoccupation,
				products: [],
				nbProducts: 0,
				page: 1,
				totalPages: 0,
				sortOptionSelected: sort,
				sortOptions: SORT_OPTIONS,
				isAllCategory: false,
				isPreoccupationPage: true,
				...(await serverSideTranslations(lang, ['common', 'menu'])),
			},
		};
	}
};

export default PreoccupationPage;

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getProductsBySubCategory } from '@lib/shopify/requests/productsBySubCategory';
import CategoryPageShopify from '@components/pages/CategoryPageShopify';
import { DEFAULT_LANG, PAGE_LIMIT, SORT_OPTIONS } from '@utils/constants';
import { MENU } from '@utils/menu';

export const getServerSideProps = async ({ locale, params, query }) => {
	const { category, subCategory } = params;
	const { sort = 'newest', page = 1 } = query;
	const lang = locale || DEFAULT_LANG;
	const pageNum = Number(page);
	const start = (pageNum - 1) * PAGE_LIMIT;

	const menuCategory = MENU.find((m) => m.title.toLowerCase() === category.toLowerCase());
	const subCategories = menuCategory?.sousCategories?.map((sc) => sc.title) || [];

	const productsAll = await getProductsBySubCategory(category.toLowerCase(), subCategory);
	let products = productsAll;
	if (sort === 'price-asc') products = [...products].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
	if (sort === 'price-desc') products = [...products].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
	if (sort === 'newest') products = products; // TODO: améliorer si possible
	const nbProducts = products.length;
	const totalPages = Math.ceil(nbProducts / PAGE_LIMIT);
	const paginatedProducts = products.slice(start, start + PAGE_LIMIT);

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			categoryName: category,
			subCategoryName: subCategory,
			products: paginatedProducts,
			subCategories,
			nbProducts,
			page: pageNum,
			totalPages,
			sortOptionSelected: sort,
			sortOptions: SORT_OPTIONS,
		},
	};
};

export default CategoryPageShopify;

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { getProductsByCategory } from '@lib/shopify/requests/productsByCategory';
import { getCollectionByHandle } from '@lib/shopify/requests/collection';
import CategoryPage from '@components/pages/CategoryPage';
import { DEFAULT_LANG, SORT_OPTIONS, REVALIDATE_PAGE_SECONDS } from '@utils/constants';
import { MENU } from '@data/menu';
import { useProductSortingAndPagination } from '@hooks/useProductSortingAndPagination';

function CategoryPageWrapper({ allProducts, ...props }) {
	const {
		products,
		nbProducts,
		page,
		totalPages,
		sortOptionSelected,
		handleSortChange,
		handlePageChange,
	} = useProductSortingAndPagination(allProducts);

	return (
		<CategoryPage 
			{...props}
			products={products}
			nbProducts={nbProducts}
			page={page}
			totalPages={totalPages}
			sortOptionSelected={sortOptionSelected}
			handleSortChange={handleSortChange}
			handlePageChange={handlePageChange}
		/>
	);
}

export async function getStaticPaths() {
	const paths = MENU.map((menuItem) => ({
		params: { category: menuItem.title },
	}));

	return {
		paths,
		fallback: 'blocking'
	};
}

export async function getStaticProps({ locale, params }) {
	const { category } = params;
	const lang = locale || DEFAULT_LANG;

	try {
		const menuCategory = MENU.find((m) => m.title === category);
		
		if (!menuCategory) {
			return { notFound: true };
		}

		const subCategories = menuCategory.subCategories || [];
		const [allProducts, collectionInfo] = await Promise.all([
			getProductsByCategory(category),
			getCollectionByHandle(category),
		]);

		return {
			props: {
				...(await serverSideTranslations(lang, 'common')),
				categoryName: category,
				subCategoryName: null,
				allProducts,
				subCategories,
				sortOptions: SORT_OPTIONS,
				isAllCategory: true,
				collectionInfo,
			},
			revalidate: REVALIDATE_PAGE_SECONDS,
		};
	} catch (error) {
		console.error('Error fetching category products:', error);
		return { notFound: true };
	}
}

export default CategoryPageWrapper;

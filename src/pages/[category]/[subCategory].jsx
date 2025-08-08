import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getProductsBySubCategory } from '@lib/shopify/requests/productsBySubCategory';
import CategoryPage from '@components/pages/CategoryPage';
import { DEFAULT_LANG, SORT_OPTIONS, REVALIDATE_PAGE_SECONDS } from '@utils/constants';
import { MENU } from '@data/menu';
import { useProductSortingAndPagination } from '@hooks/useProductSortingAndPagination';

function SubCategoryPage({ allProducts, ...props }) {
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
	const paths = [];
	
	MENU.forEach((menuItem) => {
		menuItem.subCategories?.forEach((subCategory) => {
			paths.push({
				params: { 
					category: menuItem.title,
					subCategory: subCategory.slug 
				},
			});
		});
	});

	return {
		paths,
		fallback: 'blocking'
	};
}

export async function getStaticProps({ locale, params }) {
	const { category, subCategory } = params;
	const lang = locale || DEFAULT_LANG;

	try {
		const menuCategory = MENU.find((m) => m.title === category);
		
		if (!menuCategory) {
			return { notFound: true };
		}

		const subCategories = menuCategory.subCategories || [];
		const currentSubCategory = subCategories.find(sc => sc.slug === subCategory);

		if (!currentSubCategory) {
			return { notFound: true };
		}

		const subCategoryTitle = currentSubCategory.title || subCategory;
		const allProducts = await getProductsBySubCategory(category, subCategory);

		return {
			props: {
				...(await serverSideTranslations(lang, 'common')),
				categoryName: category,
				subCategoryName: subCategory,
				subCategoryTitle,
				allProducts,
				subCategories,
				sortOptions: SORT_OPTIONS,
			},
			revalidate: REVALIDATE_PAGE_SECONDS,
		};
	} catch (error) {
		console.error('Error fetching subcategory products:', error);
		return { notFound: true };
	}
}

export default SubCategoryPage;

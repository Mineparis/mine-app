import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getProductsByBrand } from '@lib/shopify/requests/productsByBrand';
import BrandPage from '@components/pages/BrandPage';
import { DEFAULT_LANG, SORT_OPTIONS, REVALIDATE_PAGE_SECONDS } from '@utils/constants';
import { useProductSortingAndPagination } from '@hooks/useProductSortingAndPagination';
import { getAllShopifyProductHandles } from '@lib/shopify/requests/productByHandle';

function BrandPageWrapper({ allProducts, brandName, brandSlug, ...props }) {
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
		<BrandPage 
			{...props}
			brandName={brandName}
			brandSlug={brandSlug}
			products={products}
			nbProducts={nbProducts}
			page={page}
			totalPages={totalPages}
			sortOptionSelected={sortOptionSelected}
			sortOptions={SORT_OPTIONS}
			handleSortChange={handleSortChange}
			handlePageChange={handlePageChange}
		/>
	);
}


export async function getStaticPaths() {
	const handles = await getAllShopifyProductHandles();
	
	const paths = handles.map((handle) => ({
		params: { brandSlug: handle },
	}));
	
	return {
		paths,
		fallback: 'blocking',
	};
}

export async function getStaticProps({ params, locale }) {
  const { brandSlug } = params;
  const lang = locale || DEFAULT_LANG;

  if (!brandSlug) return { notFound: true };

  try {
	const allProducts = await getProductsByBrand(brandSlug);

	if (!allProducts || allProducts.length === 0) {
	  return {
		notFound: true,
	  };
	}

	const brandName = brandSlug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

	return {
	  props: {
		...(await serverSideTranslations(lang, 'common')),
		brandName,
		brandSlug,
		allProducts,
	  },
	  revalidate: REVALIDATE_PAGE_SECONDS,
	};
  } catch (error) {
	console.error('Error fetching brand products:', error);
	return {
	  notFound: true,
	};
  }
}

export default BrandPageWrapper;

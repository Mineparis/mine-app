
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import ShopHeader from '@components/ShopHeader';
import ProductGrid from '@components/ProductGrid';
import Pagination from '@components/Pagination';
import EmptyState from '@components/EmptyState';

export default function CategoryPage({
	categoryName,
	subCategoryName,
	subCategoryTitle,
	products,
	nbProducts,
	page,
	totalPages,
	sortOptionSelected,
	sortOptions,
	isAllCategory = false,
	isPreoccupationPage = false,
	collectionInfo = null,
	handleSortChange,
	handlePageChange,
}) {
	const { t } = useTranslation('common');
	const router = useRouter();

	const [selectedSubCategory, setSelectedSubCategory] = useState(subCategoryName);

	useEffect(() => {
		setSelectedSubCategory(subCategoryName);
	}, [subCategoryName]);

	const handleSubCategoryChange = (subCatSlug) => {
		setSelectedSubCategory(subCatSlug);
		router.push({ pathname: `/${categoryName}/${subCatSlug}` });
	};

	const handleAllCategoryClick = () => {
		router.push({ pathname: `/${categoryName}` });
	};

	// Use passed handlers or fallback to default behavior
	const onSortChange = handleSortChange || ((newSort) => {
		const currentPath = router.asPath.split('?')[0];
		router.push({
			pathname: currentPath,
			query: { sort: newSort, page: 1 },
		});
	});

	const onPageChange = handlePageChange || ((newPage) => {
		const currentPath = router.asPath.split('?')[0];
		const queryParams = { page: newPage };
		if (router.query.sort) {
			queryParams.sort = router.query.sort;
		}
		router.push({
			pathname: currentPath,
			query: queryParams,
		});
	});

	const titleLabel = isAllCategory 
		? t('seo_category_title', { category: (t(categoryName) || categoryName).charAt(0).toUpperCase() + (t(categoryName) || categoryName).slice(1) })
		: t('seo_subcategory_title', { 
			category: (t(categoryName) || categoryName).charAt(0).toUpperCase() + (t(categoryName) || categoryName).slice(1), 
			subcategory: (t(subCategoryTitle || subCategoryName) || subCategoryTitle || subCategoryName).charAt(0).toUpperCase() + (t(subCategoryTitle || subCategoryName) || subCategoryTitle || subCategoryName).slice(1) 
		});
	
	const descriptionLabel = isAllCategory 
		? t('seo_category_description', { category: (t(categoryName) || categoryName).charAt(0).toUpperCase() + (t(categoryName) || categoryName).slice(1) })
		: t('seo_subcategory_description', { 
			category: (t(categoryName) || categoryName).charAt(0).toUpperCase() + (t(categoryName) || categoryName).slice(1), 
			subcategory: (t(subCategoryTitle || subCategoryName) || subCategoryTitle || subCategoryName).charAt(0).toUpperCase() + (t(subCategoryTitle || subCategoryName) || subCategoryTitle || subCategoryName).slice(1) 
		});

	const displayTitle = isAllCategory ? t(categoryName) : t(subCategoryTitle || subCategoryName);
	
	const canonicalUrl = isAllCategory 
		? `https://mineparis.com/${categoryName}`
		: `https://mineparis.com/${categoryName}/${subCategoryName}`;
	
	const ogImage = '/img/slider/mine-carousel.webp';
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"name": displayTitle,
		"description": descriptionLabel,
		"url": canonicalUrl,
		"mainEntity": {
			"@type": "ItemList",
			"numberOfItems": nbProducts,
			"itemListElement": products.slice(0, 10).map((product, index) => ({
				"@type": "Product",
				"position": index + 1,
				"name": product.name,
				"url": `https://mineparis.com/product/${product.brandSlug}/${product.productSlug}`,
				"image": product.images?.[0]?.url
			}))
		}
	};

	return (
		<div className="min-h-screen bg-white text-neutral-900">
			<Head>
				<title>{titleLabel}</title>
				<meta name="description" content={descriptionLabel} />
				<link rel="canonical" href={canonicalUrl} />
				<meta property="og:title" content={titleLabel} />
				<meta property="og:description" content={descriptionLabel} />
				<meta property="og:url" content={canonicalUrl} />
				<meta property="og:type" content="website" />
				<meta property="og:image" content={ogImage} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={titleLabel} />
				<meta name="twitter:description" content={descriptionLabel} />
				<meta name="twitter:image" content={ogImage} />
				<script 
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
				/>
			</Head>
			
			{/* Skip to main content link for screen readers */}
			<a 
				href="#main-content" 
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded"
			>
				{t('skip_to_main_content')}
			</a>

			<main id="main-content">
				<section className="w-full max-w-7xl mx-auto px-4 py-8" aria-labelledby="category-heading">
					<ShopHeader
						title={displayTitle}
						categoryName={categoryName}
						subCategoryName={isAllCategory ? null : (subCategoryTitle || subCategoryName)}
						selectedSubCategory={selectedSubCategory}
						onSubCategoryChange={handleSubCategoryChange}
						onAllCategoryClick={handleAllCategoryClick}
						sortOptions={sortOptions}
						selectedSort={sortOptionSelected}
						onSortChange={onSortChange}
						nbProducts={nbProducts}
						isAllCategory={isAllCategory}
						isPreoccupationPage={isPreoccupationPage}
						selectedPreoccupation={isPreoccupationPage ? subCategoryTitle?.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') : null}
						collectionInfo={collectionInfo}
					/>

					{/* Hidden heading for screen readers */}
					<h2 id="category-heading" className="sr-only">
						{`${displayTitle} products`}
					</h2>

					{/* Products section with proper ARIA labels */}
					<section aria-labelledby="products-heading" aria-live="polite">
						<h2 id="products-heading" className="sr-only">
							{products.length > 0 ? t('products_found', { count: nbProducts }) : t('no_products_found_status')}
						</h2>
						
						{/* Products grid */}
						{products.length > 0 ? (
							<div 
								className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8"
								role="grid"
								aria-label={`${displayTitle} grille de produits`}
								aria-rowcount={Math.ceil(products.length / 4)}
							>
								<ProductGrid products={products} />
							</div>
						) : (
							<div role="status" aria-live="polite">
								<EmptyState categoryName={categoryName} />
							</div>
						)}
					</section>

					{/* Pagination with proper ARIA labels */}
					{products.length > 0 && (
						<nav aria-label="Products pagination" className="mt-8">
							<Pagination 
								page={page} 
								totalPages={totalPages} 
								onPageChange={onPageChange} 
							/>
						</nav>
					)}
				</section>
			</main>
		</div>
	);
}

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import ProductGrid from '@components/ProductGrid';
import Pagination from '@components/Pagination';

export default function BrandPage({
	brandName,
	brandSlug,
	products,
	nbProducts,
	page,
	totalPages,
	sortOptionSelected,
	sortOptions,
	handleSortChange,
	handlePageChange,
}) {
	const { t } = useTranslation('common');
	const router = useRouter();

	// Use passed handlers or fallback to default behavior
	const onSortChange = handleSortChange || ((newSort) => {
		router.push({
			pathname: `/brands/${brandSlug}`,
			query: { sort: newSort, page: 1 },
		});
	});

	const onPageChange = handlePageChange || ((newPage) => {
		const queryParams = { page: newPage };
		if (router.query.sort) {
			queryParams.sort = router.query.sort;
		}
		router.push({
			pathname: `/brands/${brandSlug}`,
			query: queryParams,
		});
	});

	const titleLabel = t('seo_brand_title', { brand: brandName });
	const descriptionLabel = t('seo_brand_description', { brand: brandName });
	const canonicalUrl = `https://mineparis.com/brands/${brandSlug}`;
	const ogImage = '/img/slider/mine-carousel.webp';

	const structuredData = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"name": `${brandName} - ${t('brand_products')}`,
		"description": descriptionLabel,
		"url": canonicalUrl,
		"mainEntity": {
			"@type": "ItemList",
			"numberOfItems": nbProducts,
			"itemListElement": products.slice(0, 10).map((product, index) => ({
				"@type": "Product",
				"position": index + 1,
				"name": product.name,
				"url": `https://mineparis.com/brands/${product.brandSlug}`,
				"image": product.images?.[0]?.url,
				"brand": {
					"@type": "Brand",
					"name": brandName
				}
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
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded outline-none"
			>
				{t('skip_to_main_content')}
			</a>

			<main id="main-content">
				<section className="w-full max-w-7xl mx-auto px-4 py-8" aria-labelledby="brand-heading">
					{/* Brand Header */}
					<div className="text-center mb-12">
						<h1 id="brand-heading" className="text-xl font-semibold text-neutral-900 mb-4">
							{brandName}
						</h1>
						<p className="text-neutral-600 mb-8">
							{t('brand_page_description', { brand: brandName })}
						</p>
						
						{/* Sort and count */}
						<div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
							<div className="text-sm text-neutral-500">
								{t('products_count', { count: nbProducts })}
							</div>
							
							{/* Sort dropdown */}
							<div className="flex items-center gap-2">
								<label htmlFor="sort-select" className="text-sm text-neutral-600">
									{t('sort_by')}:
								</label>
								<select
									id="sort-select"
									value={sortOptionSelected}
									onChange={(e) => onSortChange(e.target.value)}
									className="px-3 py-2 border border-neutral-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
									aria-label={t('sort_products')}
								>
									{sortOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{t(option.label)}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>

					{/* Hidden heading for screen readers */}
					<h2 id="products-heading" className="sr-only">
						{products.length > 0 ? t('products_found', { count: nbProducts }) : t('no_products_found_status')}
					</h2>

					{/* Products section with proper ARIA labels */}
					<section aria-labelledby="products-heading" aria-live="polite">
						{/* Products grid */}
						{products.length > 0 ? (
							<div 
								className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8"
								role="grid"
								aria-label={`${brandName} products grid`}
								aria-rowcount={Math.ceil(products.length / 4)}
							>
								<ProductGrid products={products} />
							</div>
						) : (
							<div role="status" aria-live="polite" className="text-center py-12">
								<div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
									<svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
									</svg>
								</div>
								<h3 className="text-lg font-light text-neutral-600 mb-2">
									{t('no_products_found_brand', { brand: brandName })}
								</h3>
								<p className="text-neutral-500 mb-6">
									{t('no_products_found_brand_description')}
								</p>
							</div>
						)}
					</section>

					{/* Pagination with proper ARIA labels */}
					{products.length > 0 && totalPages > 1 && (
						<nav aria-label={t('products_pagination')} className="mt-8">
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

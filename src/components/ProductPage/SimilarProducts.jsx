import React from 'react';
import { useTranslation } from 'next-i18next';
import ProductGrid from '@components/ProductGrid';

const SimilarProducts = ({ products = [] }) => {
	const { t } = useTranslation('common');

	if (!products.length) return null;

	// Transform products to match ProductGrid format
	const transformedProducts = products.map(product => {
		// Extract variant ID properly
		let variantId = null;
		if (product.variants?.nodes?.length > 0) {
			const firstVariant = product.variants.nodes[0];
			variantId = firstVariant.id;
		} else if (product.variants?.length > 0) {
			const firstVariant = product.variants[0];
			variantId = firstVariant.id;
		}

		// Extract images properly from Shopify response
		let images = [];
		if (product.images?.edges?.length > 0) {
			// If images come from GraphQL response
			images = product.images.edges.map(edge => ({
				src: edge.node.url,
				altText: edge.node.altText || product.title
			}));
		} else if (Array.isArray(product.images)) {
			// If images are already transformed
			images = product.images.map(img => ({
				src: img.url || img.src,
				altText: img.altText || product.title
			}));
		}

		// Extract price properly
		let price = '0';
		if (product.variants?.nodes?.length > 0) {
			price = product.variants.nodes[0].price?.amount || '0';
		} else if (product.variants?.length > 0) {
			price = product.variants[0].price?.amount || '0';
		} else if (product.priceRange?.minVariantPrice?.amount) {
			price = product.priceRange.minVariantPrice.amount;
		}

		return {
			id: product.id,
			name: product.title,
			brand: product.vendor,
			handle: product.handle,
			variantId: variantId,
			availableForSale: product.availableForSale,
			images: images,
			price: parseFloat(price).toFixed(2)
		};
	});

	return (
		<section className="bg-white pb-6">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-12">
					<h2 className="text-3xl lg:text-4xl font-light text-black mb-4">
						{t('similar_products_title')}
					</h2>
					<p className="text-gray-600 text-lg max-w-2xl mx-auto">
						{t('similar_products_description')}
					</p>
				</div>

				{/* Products Grid */}
				<div
					className="grid grid-cols-2 sm:grid-cols-4 gap-2"
					role="grid"
					aria-label="Grille de produits"
					aria-rowcount={Math.ceil(products.length / 4)}
				>
					{transformedProducts.map((product) => (
						<div
							key={product.id}
							className="w-full max-w-[220px] sm:max-w-[260px] mx-auto"
						>
							<ProductGrid products={[product]} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default SimilarProducts;

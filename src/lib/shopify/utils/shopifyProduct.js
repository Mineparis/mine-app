export function mapShopifyProductNode(node) {
	if (!node) return null;
	const variant = node.variants?.nodes?.[0] || {};
	return {
		id: node.id,
		name: node.title,
		descriptionHtml: node.descriptionHtml,
		brand: node.vendor,
		subCategory: node.metafield?.value || '',
		price: node.priceRange?.minVariantPrice?.amount || '',
		currency: node.priceRange?.minVariantPrice?.currencyCode || '',
		images: node.images?.edges?.map(e => ({ src: e.node.src, altText: e.node.altText })) || [],
		availableForSale: variant.availableForSale || false,
		variantId: variant.id,
	};
}

export const extractProductInfo = (product) => {
	if (!product) return null;

	const variant = product.variants?.nodes?.[0] || {};
	const extractId = id => id?.split('/').pop() || '';

	return {
		productId: extractId(product.id),
		brand: product.vendor || '',
		name: product.title || '',
		descriptionHtml: product.descriptionHtml || '',
		variantId: extractId(variant.id),
		availableForSale: variant.availableForSale || false,
		price: product.priceRange?.minVariantPrice?.amount || '',
		images: product.images?.edges?.map(edge => ({
			src: edge.node.src,
			altText: edge.node.altText || '',
		})) || [],
		instructions: product.instructions?.value || '',
		composition: product.composition?.value || '',
	};
};

export const mergeProductsData = (strapiProducts, shopifyProducts) => {
	const shopifyMap = {};

	for (const product of shopifyProducts) {
		shopifyMap[product.productId] = product;
	}

	return strapiProducts.map(product => {
		const shopifyProduct = shopifyMap[product.shopifyProductId] || null;
		return { ...product, shopifyProduct };
	});
};

export const extractShopifyProductIds = (productLists) => {
	return [...new Set(
		productLists
			.flat()
			.map(p => p.shopifyProductId)
			.filter(Boolean)
	)];
};

import { extractShopifyId } from '@utils/shopifyIds';

export function mapShopifyProductNode(node) {
	if (!node) return null;
	const variant = node.variants?.nodes?.[0] || {};
	
	let subCategory = '';
	if (node.metafield?.value) {
		try {
			const parsed = JSON.parse(node.metafield.value);
			subCategory = Array.isArray(parsed) ? parsed[0] : parsed;
		} catch {
			subCategory = node.metafield.value;
		}
	}
	
	return {
		id: node.id,
		name: node.title,
		handle: node.handle,
		descriptionHtml: node.descriptionHtml,
		brand: node.vendor,
		createdAt: node.createdAt,
		subCategories: node.metafield?.value ? JSON.parse(node.metafield?.value) : [],
		price: node.priceRange?.minVariantPrice?.amount || '',
		currency: node.priceRange?.minVariantPrice?.currencyCode || '',
		images: node.images?.edges?.map(e => ({ src: e.node.src, altText: e.node.altText })) || [],
		availableForSale: variant.availableForSale || false,
		variantId: variant.id ? extractShopifyId(variant.id) : null,
		collections: (node.collections?.edges || []).map(e => e.node),
	};
}

export const extractProductInfo = (product) => {
	if (!product) return null;

	const variant = product.variants?.nodes?.[0] || {};
	const extractId = id => id?.split('/').pop() || '';

	return {
		productId: extractId(product.id),
		handle: product.handle,
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

export const parseShopifyArticle = (node) => {
  if (!node) return null;
  return {
    id: node.id ?? null,
    title: node.title ?? null,
    handle: node.handle ?? null,
    publishedAt: node.publishedAt ?? null,
    shortDescription: node.excerpt ?? null,
    description: node.contentHtml ?? null,
    image: node.image ?? null,
  };
}

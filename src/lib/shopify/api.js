import { createStorefrontClient } from '@shopify/hydrogen-react';

export const client = createStorefrontClient({
	storeDomain: process.env.NEXT_PUBLIC_PUBLIC_STORE_DOMAIN,
	storefrontAccessToken: process.env.NEXT_PUBLIC_PUBLIC_STOREFRONT_API_TOKEN,
	privateStorefrontToken: process.env.PRIVATE_STOREFRONT_API_TOKEN,
});

/**
 * Shopify GraphQL request utility
 * @param {Object} options
 * @param {string} options.query
 * @param {Object} [options.variables]
 * @returns {Promise<any>}
 */
export const shopifyRequest = async ({ query, variables }) => {
	const response = await fetch(client.getStorefrontApiUrl(), {
		method: 'POST',
		headers: client.getPrivateTokenHeaders(),
		body: JSON.stringify({ query, variables }),
	});
	if (!response.ok) {
		throw new Error(`Shopify API error: ${response.status}`);
	}
	return response.json();
}
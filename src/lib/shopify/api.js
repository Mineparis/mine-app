import { createStorefrontClient } from '@shopify/hydrogen-react';

export const client = createStorefrontClient({
	storeDomain: process.env.NEXT_PUBLIC_PUBLIC_STORE_DOMAIN,
	storefrontAccessToken: process.env.NEXT_PUBLIC_PUBLIC_STOREFRONT_API_TOKEN,
	privateStorefrontToken: process.env.PRIVATE_STOREFRONT_API_TOKEN,
});

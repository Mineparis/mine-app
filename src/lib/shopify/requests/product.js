import { client } from "../api";

const GRAPHQL_GET_PRODUCT = `
query getProduct($id: ID!) {
	product(id: $id) {
		title
		descriptionHtml
		priceRange {
			minVariantPrice {
				amount
				currencyCode
			}
		}
		images(first: 2) {
			edges {
				node {
					src
					altText
				}
			}
		}
	}
}
`;

export const getShopifyProduct = async (id) => {
	if (!id) return;

	try {
		const response = await fetch(client.getStorefrontApiUrl(), {
			body: JSON.stringify({
				query: GRAPHQL_GET_PRODUCT,
				variables: {
					id: `gid://shopify/Product/${id}`,
				},
			}),
			headers: client.getPrivateTokenHeaders(),
			method: 'POST',
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const body = await response.json();

		if (!body.data.product) throw Error(`The product ${id} doesn't exist.`);

		return body.data.product;
	} catch (error) {
		throw { error, query };
	}
};

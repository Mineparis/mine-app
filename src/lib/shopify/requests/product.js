import { client } from "../api";
import { extractProductInfo } from "../utils";

const GRAPHQL_GET_PRODUCT = `
query getProduct($id: ID!) {
  product(id: $id) {
    title
    descriptionHtml
    vendor
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 3) {
      edges {
        node {
          src
          altText
        }
      }
    }
    instructions: metafield(namespace: "custom", key: "instructions") {
      value
    }
    composition: metafield(namespace: "custom", key: "composition") {
      value
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
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

		return extractProductInfo(body.data.product);
	} catch (error) {
		throw error;
	}
};

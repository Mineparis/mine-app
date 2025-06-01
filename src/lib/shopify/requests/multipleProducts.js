import { fetchAPI } from "../../api";
import { client } from "../api";
import { extractProductInfo, extractShopifyProductIds, mergeProductsData } from "../utils";

const GRAPHQL_GET_MULTIPLE_PRODUCTS = `
  query getMultipleProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
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
  }
`;

export const getMultipleShopifyProducts = async (ids = []) => {
	if (!Array.isArray(ids) || ids.length === 0) return [];

	try {
		const response = await fetch(client.getStorefrontApiUrl(), {
			body: JSON.stringify({
				query: GRAPHQL_GET_MULTIPLE_PRODUCTS,
				variables: {
					ids: ids.map(id => `gid://shopify/Product/${id}`),
				},
			}),
			headers: client.getPrivateTokenHeaders(),
			method: 'POST',
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const body = await response.json();

		if (!body.data || !body.data.nodes) {
			throw new Error("Invalid Shopify response format.");
		}

		return body.data.nodes
			.filter(Boolean)
			.map(extractProductInfo);
	} catch (error) {
		console.error("Shopify fetch error:", error);
		throw error;
	}
};

const addShopifyDataInProducts = async (data) => {
	const allProductIds = extractShopifyProductIds(data);
	const shopifyProducts = await getMultipleShopifyProducts(allProductIds);
	const products = mergeProductsData(data, shopifyProducts);

	return products;
};

export const getEnrichedProducts = async ({ dataURL, countURL }) => {
	const data = await fetchAPI(dataURL);
	const nbProducts = await fetchAPI(countURL);

	const strapiProducts = data?.data ? data.data : data;
	const totalProducts = data?.data ? data.meta.pagination.total : nbProducts;

	const products = await addShopifyDataInProducts(strapiProducts);

	return {
		products,
		nbProducts: totalProducts || 0,
	};
};
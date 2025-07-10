import { client } from '../api';
import { mapShopifyProductNode } from '../utils/shopifyProduct';

const PRODUCTS_BY_SUBCATEGORY_QUERY = `
  query ProductsBySubCategory($query: String!, $first: Int = 24) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          descriptionHtml
          vendor
          metafield(namespace: "custom", key: "sous-categorie") { value }
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 3) { edges { node { src altText } } }
          variants(first: 1) { nodes { id availableForSale } }
        }
      }
    }
  }
`;

export async function getProductsBySubCategory(category, subCategory, first = 24) {
	const query = `collection:${category}`;
	const response = await fetch(client.getStorefrontApiUrl(), {
		method: 'POST',
		headers: client.getPrivateTokenHeaders(),
		body: JSON.stringify({
			query: PRODUCTS_BY_SUBCATEGORY_QUERY,
			variables: { query, first },
		}),
	});
	if (!response.ok) throw new Error('Shopify API error');
	const body = await response.json();
	console.log({ body: JSON.stringify(body, null, 2) });
	return (body.data?.products?.edges || []).map(e => mapShopifyProductNode(e.node));
}

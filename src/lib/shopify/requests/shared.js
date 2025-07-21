import { shopifyRequest } from '../api';
import { mapShopifyProductNode } from '../utils/shopifyProduct';

const PRODUCTS_QUERY = `
  query Products($query: String!, $first: Int = 100) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          descriptionHtml
          vendor
          createdAt
          subCategoryMetafield: metafield(namespace: "custom", key: "sous_categorie") { value }
          preoccupationsMetafield: metafield(namespace: "custom", key: "preoccupations") { value }
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 3) { edges { node { src altText } } }
          variants(first: 1) { nodes { id availableForSale } }
        }
      }
    }
  }
`;

/**
 * Utility function to fetch and map Shopify products with metafields
 * @param {string} query - Shopify query (e.g., "collection:cheveux", "*" for all products)
 * @param {number} first - Number of products to fetch (default: 100)
 * @returns {Promise<Object[]>} - Array of mapped products with subcategory and preoccupations
 * @throws {Error} - Throws error if Shopify API request fails
 */
export async function fetchProducts(query, first = 100) {
  const body = await shopifyRequest({
    query: PRODUCTS_QUERY,
    variables: { query, first },
  });
  
  if (body.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(body.errors)}`);
  }
  
  return (body.data?.products?.edges || []).map(edge => {
    const product = mapShopifyProductNode(edge.node);

    // Add subcategory metafield to product
    if (edge.node.subCategoryMetafield?.value) {
      product.subCategory = edge.node.subCategoryMetafield.value;
    }
    
    // Add preoccupations metafield to product
    if (edge.node.preoccupationsMetafield?.value) {
      try {
        product.preoccupations = JSON.parse(edge.node.preoccupationsMetafield.value);
      } catch {
        // Fallback to array with single value if JSON parsing fails
        product.preoccupations = [edge.node.preoccupationsMetafield.value];
      }
    } else {
      product.preoccupations = [];
    }
    
    return product;
  });
}

import { shopifyRequest } from "../api";
import { extractProductInfo } from "../utils/shopifyProduct";

const GRAPHQL_GET_PRODUCTS_SORTED = `
  query getProductsSorted($first: Int!, $sortKey: ProductSortKeys!) {
    products(first: $first, sortKey: $sortKey, reverse: true) {
      edges {
        node {
          id
          handle
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
  }
`;

export const getMultipleShopifyProducts = async ({ sortKey, limit = 12 }) => {
  try {
    const body = await shopifyRequest({
      query: GRAPHQL_GET_PRODUCTS_SORTED,
      variables: {
        first: limit,
        sortKey,
      },
    })

    if (!body.data || !body.data.products) {
      throw new Error("Invalid Shopify response format.");
    }

    return body.data.products.edges
      .map(edge => edge.node)
      .filter(Boolean)
      .map(extractProductInfo);
  } catch (error) {
    console.error("Shopify fetch error:", error);
    throw error;
  }
};

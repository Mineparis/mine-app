import { shopifyRequest } from "../api";
import { extractProductInfo } from "../utils/shopifyProduct";

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
    const body = await shopifyRequest({
      query: GRAPHQL_GET_PRODUCT,
      variables: {
        id: `gid://shopify/Product/${id}`,
      },
    })

    if (!body.data.product) throw Error(`The product ${id} doesn't exist.`);

    return extractProductInfo(body.data.product);
  } catch (error) {
    throw error;
  }
};

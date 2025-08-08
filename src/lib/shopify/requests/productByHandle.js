import { shopifyRequest } from "../api";

const GRAPHQL_GET_PRODUCT_BY_HANDLE = `
query getProductByHandle($handle: String!) {
  product(handle: $handle) {
    id
    title
    handle
    descriptionHtml
    description
    vendor
    collections(first: 3) {
      edges {
        node {
          handle
        }
      }
    }
    productType
    availableForSale
    createdAt
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    instructions: metafield(namespace: "custom", key: "instructions") {
      value
    }
    composition: metafield(namespace: "custom", key: "composition") {
      value
    }
    preoccupations: metafield(namespace: "custom", key: "preoccupations") {
      value
    }
    sousCategorie: metafield(namespace: "custom", key: "sous_categorie") {
      value
    }
    variants(first: 20) {
      nodes {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        image {
          id
          url
          altText
          width
          height
        }
        selectedOptions {
          name
          value
        }
      }
    }
    options {
      id
      name
      values
    }
    tags
    seo {
      title
      description
    }
  }
}
`;

/**
 * Retrieves a Shopify product by its handle
 * @param {string} handle - The product handle
 * @returns {Promise<Object|null>} - The product data or null if not found
 */
export const getShopifyProductByHandle = async (handle) => {
  if (!handle) return null;

  try {
    const body = await shopifyRequest({
      query: GRAPHQL_GET_PRODUCT_BY_HANDLE,
      variables: { handle },
    });

    if (body.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(body.errors)}`);
    }

    if (!body.data?.product) {
      return null;
    }

    const product = body.data.product;

    return {
      id: product.id,
      handle: product.handle,
      title: product.title,
      description: product.description,
      descriptionHtml: product.descriptionHtml,
      vendor: product.vendor,
      categories: product.collections.edges.map(edge => edge.node.handle),
      productType: product.productType,
      availableForSale: product.availableForSale,
      createdAt: product.createdAt,
      priceRange: product.priceRange,
      compareAtPriceRange: product.compareAtPriceRange,
      images: product.images?.edges?.map(edge => ({
        id: edge.node.id,
        url: edge.node.url,
        src: edge.node.url, // backward compatibility
        altText: edge.node.altText || product.title,
        width: edge.node.width,
        height: edge.node.height,
      })) || [],
      variants: product.variants?.nodes?.map(variant => ({
        id: variant.id,
        title: variant.title,
        availableForSale: variant.availableForSale,
        price: variant.price?.amount || '',
        compareAtPrice: variant.compareAtPrice?.amount || null,
        currency: variant.price?.currencyCode || 'EUR',
        image: variant.image ? {
          id: variant.image.id,
          url: variant.image.url,
          src: variant.image.url, // backward compatibility
          altText: variant.image.altText || product.title,
          width: variant.image.width,
          height: variant.image.height,
        } : null,
        selectedOptions: variant.selectedOptions || [],
      })) || [],
      options: product.options || [],
      tags: product.tags || [],
      // Parse instructions as JSON if possible, otherwise fallback to string
      instructions: (() => {
        try {
          return product.instructions?.value ? JSON.parse(product.instructions.value) : '';
        } catch {
          return product.instructions?.value || '';
        }
      })(),
      composition: product.composition?.value || '',
      concerns: product.preoccupations?.value ? JSON.parse(product.preoccupations.value) : [],
      subCategory: product.sousCategorie?.value ? JSON.parse(product.sousCategorie.value) : [],
      categories: product.collections?.edges?.map(edge => edge.node.handle) || [],
      // Additional fields needed by ProductPage component
      name: product.title, // Alias for title
      brand: product.vendor, // Alias for vendor
      brandSlug: product.vendor?.toLowerCase().replace(/\s+/g, '-') || '',
      productSlug: product.handle || '',
      comments: [], // Default empty array for comments
      // Enhanced pricing data for ProductHero
      pricing: {
        currentPrice: product.variants?.nodes?.[0]?.price?.amount || product.priceRange?.minVariantPrice?.amount || '0',
        comparePrice: product.variants?.nodes?.[0]?.compareAtPrice?.amount || product.compareAtPriceRange?.maxVariantPrice?.amount || null,
        currency: product.variants?.nodes?.[0]?.price?.currencyCode || product.priceRange?.minVariantPrice?.currencyCode || 'EUR',
        get hasDiscount() {
          return this.comparePrice && parseFloat(this.comparePrice) > parseFloat(this.currentPrice);
        },
        get savings() {
          return this.hasDiscount ? Math.max(0, parseFloat(this.comparePrice) - parseFloat(this.currentPrice)) : 0;
        },
        get discountPercentage() {
          return this.hasDiscount ? Math.round(((parseFloat(this.comparePrice) - parseFloat(this.currentPrice)) / parseFloat(this.comparePrice)) * 100) : 0;
        },
        get formattedCurrentPrice() {
          const numPrice = parseFloat(this.currentPrice);
          return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: this.currency }).format(numPrice);
        },
        get formattedComparePrice() {
          return this.comparePrice ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: this.currency }).format(parseFloat(this.comparePrice)) : null;
        },
        get formattedSavings() {
          return this.savings > 0 ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: this.currency }).format(this.savings) : null;
        }
      },
      seo: {
        title: product.seo?.title || product.title,
        description: product.seo?.description || product.description?.substring(0, 160) || '',
      },
    };
  } catch (error) {
    console.error('Error retrieving product by handle:', error);
    return null;
  }
};

let handlesCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 10 * 1000; // 10 minutes

/**
 * Fetch all product handles from Shopify.
 * @returns {Promise<string[]>} Array of product handles (slugs)
 */
export const getAllShopifyProductHandles = async () => {
  // Use cache if available and fresh
  if (handlesCache && Date.now() - cacheTimestamp < CACHE_TTL) {
    return handlesCache;
  }

  const query = `
    query getAllProductHandles($cursor: String) {
      products(first: 250, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            handle
          }
        }
      }
    }
  `;

  let handles = [];
  let hasNextPage = true;
  let cursor = null;

  try {
    while (hasNextPage) {
      const variables = cursor ? { cursor } : {};
      const res = await shopifyRequest({ query, variables });
      const products = res?.data?.products;
      if (!products) break;

      handles.push(...products.edges.map(edge => edge.node.handle));
      hasNextPage = products.pageInfo.hasNextPage;
      cursor = products.pageInfo.endCursor;
    }
    // Set cache
    handlesCache = handles;
    cacheTimestamp = Date.now();
    return handles;
  } catch (error) {
    console.error('Error fetching product handles:', error);
    return [];
  }
};
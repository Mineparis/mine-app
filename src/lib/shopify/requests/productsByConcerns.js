const GRAPHQL_GET_PRODUCTS_BY_CONCERNS = `
query getProductsByConcerns($query: String!, $first: Int = 8) {
  products(query: $query, first: $first) {
    edges {
      node {
        id
        title
        handle
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
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
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
        preoccupations: metafield(namespace: "custom", key: "preoccupations") {
          value
        }
        subCategory: metafield(namespace: "custom", key: "sous_categorie") {
          value
        }
        tags
        variants(first: 1) {
          nodes {
            id
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
}
`;

export const getProductsByConcerns = async (concerns = [], category, excludeHandle = null, limit = 4) => {
  try {
    let query = 'available_for_sale:true';
    
    // Add preoccupations filter if provided
    if (Array.isArray(concerns) && concerns.length > 0) {
      const concernsQuery = concerns.map(concern => 
        `metafield.custom.preoccupations:*${concern}*`
      ).join(' OR ');
      query += ` AND (${concernsQuery})`;
    }
    const body = JSON.stringify({
      query: GRAPHQL_GET_PRODUCTS_BY_CONCERNS,
      variables: {
        query,
        first: limit * 4 // Get more to ensure we have enough after filtering
      }
    });

    const response = await fetch(`https://${process.env.NEXT_PUBLIC_PUBLIC_STORE_DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_PUBLIC_STOREFRONT_API_TOKEN,
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return [];
    }
    
    let products = result.data?.products?.edges?.map(edge => edge.node) || [];
    
    // Exclude current product
    if (excludeHandle) {
      products = products.filter(product => product.handle !== excludeHandle);
    }
    
    // Filter by category (collection handle) since we can't do it in the query
    if (category) {
      products = products.filter(product => {
        const collections = product.collections?.edges?.map(edge => edge.node) || [];
        return collections.some(collection => collection.handle === category);
      });
    }

    // If we don't have enough products, try fallback with just category
    if (products.length < limit && category) {
      const fallbackQuery = `available_for_sale:true`;
      
      const fallbackBody = JSON.stringify({
        query: GRAPHQL_GET_PRODUCTS_BY_CONCERNS,
        variables: {
          query: fallbackQuery,
          first: limit * 6 // Get even more for fallback
        }
      });

      const fallbackResponse = await fetch(`https://${process.env.NEXT_PUBLIC_PUBLIC_STORE_DOMAIN}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_PUBLIC_STOREFRONT_API_TOKEN,
        },
        body: fallbackBody,
      });

      if (fallbackResponse.ok) {
        const fallbackResult = await fallbackResponse.json();
        if (fallbackResult.data?.products?.edges) {
          let fallbackProducts = fallbackResult.data.products.edges.map(edge => edge.node);
          
          // Filter fallback products by category and exclude current/existing
          fallbackProducts = fallbackProducts.filter(product => {
            const collections = product.collections?.edges?.map(edge => edge.node) || [];
            const hasCategory = collections.some(collection => collection.handle === category);
            const isNotCurrent = product.handle !== excludeHandle;
            const isNotAlreadyIncluded = !products.some(p => p.id === product.id);
            
            return hasCategory && isNotCurrent && isNotAlreadyIncluded;
          });
          
          products = [...products, ...fallbackProducts];
        }
      }
    }
    
    // Shuffle the products array to get random selection
    const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
    
    return shuffledProducts.slice(0, limit);
  } catch (error) {
    console.error('Error fetching products by concerns:', error);
    return [];
  }
};

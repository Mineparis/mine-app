const COLLECTION_QUERY = `
query getCollection($handle: String!) {
  collection(handle: $handle) {
    id
    title
    description
    handle
    image {
      id
      url
      altText
    }
  }
}
`;

export const getCollectionByHandle = async (handle) => {
  try {
    const body = JSON.stringify({
      query: COLLECTION_QUERY,
      variables: {
        handle
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
      return null;
    }

    return result.data?.collection || null;
  } catch (error) {
    console.error('Error fetching collection:', error);
    return null;
  }
};

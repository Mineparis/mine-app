import { shopifyRequest } from "../api";
import { parseShopifyArticle } from "../utils/shopifyProduct";

const GRAPHQL_GET_BLOG_ARTICLES = `
  query getBlogArticles($first: Int!) {
    blogs(first: 1) {
      edges {
        node {
          id
          articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
            edges {
              node {
                id
                title
                handle
                publishedAt
                excerpt
                image {
                  src
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GRAPHQL_GET_BLOG_ARTICLE_BY_HANDLE = `
  query getBlogArticleByHandle($handle: String!) {
    blogs(first: 1) {
      edges {
        node {
          articles(first: 1, query: $handle) {
            edges {
              node {
                id
                title
                handle
                publishedAt
                contentHtml
                image {
                  src
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GRAPHQL_GET_ALL_ARTICLE_HANDLES = `
  query getAllBlogArticleHandles($first: Int!, $after: String) {
    blogs(first: 1) {
      edges {
        node {
          articles(first: $first, after: $after, sortKey: PUBLISHED_AT, reverse: true) {
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
      }
    }
  }
`;

export const getShopifyBlogArticles = async (limit = 100) => {
  try {
    const body = await shopifyRequest({
      query: GRAPHQL_GET_BLOG_ARTICLES,
      variables: { first: limit },
    });

    const blogNode = body?.data?.blogs?.edges?.[0]?.node;
    if (!blogNode) return [];

    return blogNode.articles.edges
      .map(({ node }) => parseShopifyArticle(node))
    } catch (error) {
    console.error("Shopify blog fetch error:", error);
    return [];
  }
};

// Fetch a single blog article by its handle (slug)
export const getShopifyBlogArticleByHandle = async (handle) => {
  try {
    const body = await shopifyRequest({
      query: GRAPHQL_GET_BLOG_ARTICLE_BY_HANDLE,
      variables: { handle },
    });

    const articleNode =
      body?.data?.blogs?.edges?.[0]?.node?.articles?.edges?.[0]?.node;

    return parseShopifyArticle(articleNode);
  } catch (error) {
    console.error("Shopify blog article fetch error:", error);
    return null;
  }
};

// Fetch all blog article handles for static paths
export const getAllBlogArticleHandles = async () => {
  const PAGE_SIZE = 50;
  let handles = [];
  let hasNextPage = true;
  let endCursor = null;

  try {
    while (hasNextPage) {
      const body = await shopifyRequest({
        query: GRAPHQL_GET_ALL_ARTICLE_HANDLES,
        variables: { first: PAGE_SIZE, after: endCursor },
      });

      const articles = body?.data?.blogs?.edges?.[0]?.node?.articles;
      if (!articles) break;

      handles.push(
        ...articles.edges.map(({ node }) => node.handle)
      );

      hasNextPage = articles.pageInfo.hasNextPage;
      endCursor = articles.pageInfo.endCursor;
    }
    return handles;
  } catch (error) {
    console.error("Shopify blog handles fetch error:", error);
    return [];
  }
};
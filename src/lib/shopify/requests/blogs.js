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
                contentHtml
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

export const getShopifyBlogArticles = async (limit = 100, handle) => {
  try {
    const body = await shopifyRequest({
      query: GRAPHQL_GET_BLOG_ARTICLES,
      variables: { first: limit },
    });

    const articlesNode = body?.data?.blogs?.edges?.[0]?.node.articles.edges;
    if (!articlesNode) return [];

    if (handle) {
      const articleNode = articlesNode.find(({ node }) => node.handle === handle)?.node;
      return parseShopifyArticle(articleNode);
    }

    return articlesNode.map(({ node }) => parseShopifyArticle(node));
  } catch (error) {
    console.error("Shopify blog fetch error:", error);
    return [];
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
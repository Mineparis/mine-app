import { fetchProducts } from './shared';

/**
 * Fetch products by keyword (in title or vendor)
 * @param {string} keyword
 * @param {number} first
 * @returns {Promise<Object[]>}
 */
export async function getProductsByKeyword(keyword, first = 10) {
  if (!keyword) return [];
  const query = `title:*${keyword}* OR vendor:*${keyword}*`;
  return fetchProducts(query, first);
}

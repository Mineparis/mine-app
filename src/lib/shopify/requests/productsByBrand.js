import { fetchProducts } from './shared';

/**
 * Fetches all products for a given brand (Shopify vendor)
 * @param {string} brandSlug - The brand slug (e.g. 'jia-paris')
 * @param {number} first - Maximum number of products to fetch
 * @returns {Promise<Object[]>} - Array of products for the brand
 */
export async function getProductsByBrand(brandSlug, first = 100) {
  try {
    return await fetchProducts(`vendor:${brandSlug}`, first);
  } catch (error) {
    console.error('Error fetching products by brand:', error);
    return [];
  }
}

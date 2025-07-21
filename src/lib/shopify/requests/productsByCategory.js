import { fetchProducts } from './shared';

/**
 * Fetches all products from a specific category
 * @param {string} category - Category slug (e.g., 'cheveux', 'peau', 'barbe')
 * @param {number} first - Maximum number of products to fetch
 * @returns {Promise<Object[]>} - Array of products in the category
 */
export async function getProductsByCategory(category, first = 100) {
  try {
    // Fetch all products in the category collection
    return await fetchProducts(`collection:${category}`, first);
    
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

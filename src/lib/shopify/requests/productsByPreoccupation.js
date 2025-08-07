import { fetchProducts } from './shared';
import { belongsToCategory } from './utils';
import { MENU } from '@data/menu';

/**
 * Fetches products filtered by category and preoccupation
 * @param {string} category - Category slug (e.g., 'cheveux', 'peau', 'barbe')
 * @param {string} preoccupationSlug - Preoccupation slug to filter by
 * @param {number} first - Maximum number of products to fetch
 * @returns {Promise<Object[]>} - Array of filtered products
 */
export async function getProductsByPreoccupation(category, preoccupationSlug, first = 100) {
  try {
    // Fetch products, preferring collection-specific query
    let allProducts = await fetchProducts(`collection:${category}`, first);
    if (!allProducts.length) return [];

    // Filter products that truly belong to the requested collection
    const filteredByCategory = allProducts.filter(product =>
      Array.isArray(product.collections) &&
      product.collections.some(col => col.handle === category)
    );

    // Find category configuration from menu
    const categoryItem = MENU.find(({ title }) => title === category);
    if (!categoryItem) {
      console.warn(`Category '${category}' not found in menu configuration`);
      return [];
    }

    // Create lookup set for performance
    const validSubCategories = new Set(
      categoryItem.subCategories?.map(sub => sub.slug) || []
    );

    // Filter products by subcategory and preoccupation
    return filteredByCategory.filter(product =>
      belongsToCategory(product, validSubCategories) &&
      product.preoccupations?.includes(preoccupationSlug)
    );

  } catch (error) {
    console.error('Error fetching products by preoccupation:', error);
    return [];
  }
}

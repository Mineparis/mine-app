import { fetchProducts } from './shared';
import { belongsToSubCategory } from './utils';

/**
 * Fetches products filtered by category and subcategory
 * @param {string} category - Category slug (e.g., 'cheveux', 'peau', 'barbe')
 * @param {string} subCategorySlug - Subcategory slug to filter by (optional)
 * @param {number} first - Maximum number of products to fetch
 * @returns {Promise<Object[]>} - Array of filtered products
 */
export async function getProductsBySubCategory(category, subCategorySlug, first = 100) {
  try {
    const allProducts = await fetchProducts(`collection:${category}`, first);

    const filteredByCollection = allProducts.filter(product =>
      product.collections?.some(col => col.handle === category)
    );

    // Filter products that belong to the requested subcategory
    if (subCategorySlug) {
      return filteredByCollection.filter(product =>
        belongsToSubCategory(product, subCategorySlug)
      );
    }
    return filteredByCollection;
  } catch (error) {
    console.error('Error fetching products by subcategory:', error);
    return [];
  }
}

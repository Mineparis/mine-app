import { fetchProducts } from './shared';
import { belongsToSubCategory } from './utils';

/**
 * Fetches products filtered by category and subcategory
 * @param {string} category - Category slug (e.g., 'cheveux', 'peau', 'barbe')
 * @param {string} subCategorySlug - Subcategory slug to filter by
 * @param {number} first - Maximum number of products to fetch
 * @returns {Promise<Object[]>} - Array of filtered products
 */
export async function getProductsBySubCategory(category, subCategorySlug, first = 100) {
  try {
    // Fetch products from the specific category collection
    const allProducts = await fetchProducts(`collection:${category}`, first);
    
    // Filter products that belong to the requested subcategory
    return allProducts.filter(product => 
      belongsToSubCategory(product, subCategorySlug)
    );
    
  } catch (error) {
    console.error('Error fetching products by subcategory:', error);
    return [];
  }
}

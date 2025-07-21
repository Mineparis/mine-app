/**
 * Utility functions for product filtering and processing
 */

/**
 * Normalizes a string to match slug format
 * @param {string} str - String to normalize
 * @returns {string} - Normalized slug
 */
export function normalizeToSlug(str) {
  if (typeof str !== 'string') return '';
  
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Parses subcategory metafield value into an array
 * @param {*} subCategory - Subcategory value from metafield
 * @returns {string[]} - Array of subcategory strings
 */
export function parseSubCategories(subCategory) {
  if (!subCategory) return [];
  if (Array.isArray(subCategory)) return subCategory;
  
  try {
    const parsed = JSON.parse(subCategory);
    return Array.isArray(parsed) ? parsed : [subCategory];
  } catch {
    return [subCategory];
  }
}

/**
 * Checks if a product belongs to the specified category
 * @param {Object} product - Product object with subCategory metafield
 * @param {Set} validSubCategories - Set of valid subcategory slugs for the category
 * @returns {boolean} - Whether the product belongs to the category
 */
export function belongsToCategory(product, validSubCategories) {
  const productSubCategories = parseSubCategories(product.subCategory);
  
  return productSubCategories.some(subCat => 
    validSubCategories.has(normalizeToSlug(subCat))
  );
}

/**
 * Checks if a product belongs to a specific subcategory
 * @param {Object} product - Product object with subCategory metafield
 * @param {string} targetSubCategorySlug - Target subcategory slug
 * @returns {boolean} - Whether the product belongs to the subcategory
 */
export function belongsToSubCategory(product, targetSubCategorySlug) {
  const productSubCategories = parseSubCategories(product.subCategory);
  
  return productSubCategories.some(subCat => 
    normalizeToSlug(subCat) === targetSubCategorySlug
  );
}

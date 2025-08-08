/**
 * Extracts the numeric ID from a Shopify GID
 * @param {string} gid - The complete Shopify ID (e.g., "gid://shopify/ProductVariant/123456")
 * @returns {string} The numeric ID (e.g., "123456")
 */
export const extractShopifyId = (gid) => {
  if (!gid) return '';
  
  if (!gid.includes('gid://')) return gid;
  
  const parts = gid.split('/');
  return parts[parts.length - 1];
};

/**
 * Creates a complete Shopify GID from a numeric ID
 * @param {string} id - The numeric ID
 * @param {string} type - The type (ProductVariant, Product, etc.)
 * @returns {string} The complete GID
 */
export const createShopifyGid = (id, type = 'ProductVariant') => {
  if (!id) return '';
  
  if (id.includes('gid://')) return id;
  
  return `gid://shopify/${type}/${id}`;
};

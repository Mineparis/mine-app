// Utility to render Shopify rich text metafield JSON to HTML
// Handles Shopify's Portable Text-like format

export function renderShopifyRichText(richText) {
  if (!richText) return '';
  if (typeof richText === 'string') {
    try {
      const parsed = JSON.parse(richText);
      return renderShopifyRichText(parsed);
    } catch {
      // Not JSON, fallback: wrap in <p> instead of  <br>
      return `<p>${richText}</p>`;
    }
  }
  if (typeof richText === 'object' && Array.isArray(richText.children)) {
    return richText.children.map(renderShopifyRichText).join('');
  }
  if (typeof richText === 'object' && richText.type === 'root' && Array.isArray(richText.children)) {
    return richText.children.map(renderShopifyRichText).join('');
  }
  if (typeof richText === 'object' && richText.type === 'paragraph') {
    return `<p>${richText.children.map(renderShopifyRichText).join('')}</p>`;
  }
  if (typeof richText === 'object' && richText.type === 'text') {
    return richText.value || '';
  }
  // Add more node types as needed (list, heading, etc.)
  return '';
}

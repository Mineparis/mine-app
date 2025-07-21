import { getProductsByKeyword } from '../../lib/shopify/requests/productsByKeyword';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { keyword, limit } = req.query;
  if (!keyword || typeof keyword !== 'string') {
    return res.status(400).json({ error: 'Missing keyword' });
  }
  try {
    const products = await getProductsByKeyword(keyword, Number(limit) || 8);
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}

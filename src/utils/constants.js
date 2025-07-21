export const DEFAULT_LANG = 'fr';

export const REVALIDATE_PAGE_SECONDS = 3600; // 1 hour

export const PAGE_LIMIT = 20;

export const sortQueryMapping = {
	popularity: 'sold:desc',
	newest: 'published_at:desc',
	ascending_price: 'originalPrice:asc,salePricePercent:asc',
	descending_price: 'originalPrice:desc,salePricePercent:desc',
};

export const SORT_OPTIONS = [
	{ value: 'newest', label: 'newest' },
	{ value: 'price-asc', label: 'price_asc' },
	{ value: 'price-desc', label: 'price_desc' },
];
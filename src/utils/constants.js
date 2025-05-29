export const DEFAULT_LANG = 'fr';

export const REVALIDATE_PAGE_SECONDS = 120;

export const PAGE_LIMIT = 12;

export const sortQueryMapping = {
	popularity: 'sold:desc',
	newest: 'published_at:desc',
	ascending_price: 'originalPrice:asc,salePricePercent:asc',
	descending_price: 'originalPrice:desc,salePricePercent:desc',
};
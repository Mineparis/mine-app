import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getEnrichedProducts } from '@lib/shopify/requests/multipleProducts';
import { DEFAULT_LANG, PAGE_LIMIT, sortQueryMapping } from '@utils/constants';
import SearchPage from '@components/pages/SearchPage';

export async function getServerSideProps({ query, locale }) {
	const { keyword = '', sort = 'newest' } = query;
	const lang = locale || DEFAULT_LANG;
	const page = parseInt(query.page || '1', 10);

	const start = (page - 1) * PAGE_LIMIT;
	const sortQuery = sortQueryMapping[sort] || sortQueryMapping.newest;

	const queryParams = new URLSearchParams({
		keyword,
		_limit: PAGE_LIMIT.toString(),
		_start: start.toString(),
		_sort: sortQuery,
		_locale: lang,
	}).toString();

	const dataURL = `/products/search?${queryParams}`;

	const { products, nbProducts } = await getEnrichedProducts({ dataURL });

	const totalPages = Math.ceil(nbProducts / PAGE_LIMIT);

	return {
		props: {
			...(await serverSideTranslations(lang, ['common'])),
			products,
			keyword,
			page,
			totalPages,
			nbProducts,
			sortOption: sort,
		},
	};
}

export default function Search(props) {
	return <SearchPage {...props} />;
}

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const usePagination = (initialPage = 1) => {
	const router = useRouter();
	const [page, setPage] = useState(initialPage);
	const hasInitialized = useRef(false);

	useEffect(() => {
		if (hasInitialized.current) return;
		const pageFromQuery = parseInt(router.query.page) || initialPage;
		setPage(pageFromQuery);
		hasInitialized.current = true;
	}, [router.query.page, initialPage]);

	useEffect(() => {
		if (!hasInitialized.current) return;  // Ne pas changer l'URL avant l'initialisation

		const currentPageInUrl = parseInt(router.query.page);

		if (page !== currentPageInUrl) {
			router.replace(
				{
					pathname: router.pathname,
					query: { ...router.query, page },
				},
				undefined,
				{ shallow: true }  // Shallow routing pour éviter un rechargement complet
			);
		}
	}, [page, router.query.page, router.pathname]);

	return [page, setPage];
};

export default usePagination;

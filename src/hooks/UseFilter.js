import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSWRConfig } from 'swr';

const setAllCategoryNameFilter = (typesSelected) =>
	typesSelected
		.map(value => `&categories.categoryId=${value}`)
		.join('');

const useFilter = (URL) => {
	const router = useRouter();
	const { mutate } = useSWRConfig();

	const [typesSelected, setTypesSelected] = useState([]);

	const baseURL = router.asPath.split('?')[0];
	const URLWithQueryParams = typesSelected.length ? URL + `${setAllCategoryNameFilter(typesSelected)}` : URL;

	const handleChangeType = (catId) => () => {
		const newTypesSelected = typesSelected.includes(catId)
			? typesSelected.filter(catIdSelected => catIdSelected !== catId)
			: [...typesSelected, catId];

		setTypesSelected(newTypesSelected);
		router.push(newTypesSelected.length ? `${baseURL}?types=${newTypesSelected.join(',')}` : baseURL);
	};

	const handleResetType = () => {
		if (typesSelected.length) {
			setTypesSelected([]);
			router.push(baseURL);
		};
	};

	useEffect(() => {
		const typesQueryParams = router.query?.types;

		if (typesQueryParams) {
			const typesSearched = typesQueryParams.split(',');
			const isSame = typesSearched.every(typeSearched => typesSelected.includes(typeSearched));
			if (!isSame) {
				setTypesSelected(typesSearched);
				mutate(URLWithQueryParams);
			}
		}
	}, [router.query.types]);

	return {
		handleChangeType,
		handleResetType,
		URLWithQueryParams,
		typesSelected,
	};
};

export default useFilter;
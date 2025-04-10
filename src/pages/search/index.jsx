import { useState } from 'react';
import { useTranslation } from "next-i18next";
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import useSWRImmutable from 'swr/immutable';
import { Container, Row, Col, Spinner } from 'reactstrap';

import Product from '@components/Product';
import Hero from '@components/Hero';
import { fetchAPI } from '../../lib/api';
import { DEFAULT_LANG } from '../../utils/constants';
import ShopHeader from '@components/ShopHeader';
import ShopPagination from '@components/ShopPagination';
import usePagination from '@hooks/UsePagination';

const PAGE_LIMIT = 12;

export async function getServerSideProps({ query, locale }) {
	const keyword = query.keyword || '';
	const lang = locale || DEFAULT_LANG;

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			locale: lang,
			keyword,
		},
	};
}

const sortQueryMapping = {
	popularity: 'sold:desc',
	newest: 'published_at:desc',
	ascending_price: 'originalPrice:asc,salePricePercent:asc',
	descending_price: 'originalPrice:desc,salePricePercent:desc',
};

const SearchPage = ({ locale }) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const { keyword } = router.query;

	const [sortOptionSelected, setSortOptionSelected] = useState('popularity');
	const [page, setPage] = usePagination();

	const start = (page - 1) * PAGE_LIMIT;
	const sortQuery = sortQueryMapping[sortOptionSelected];
	const searchURL = `/products/search?keyword=${encodeURIComponent(keyword)}&_limit=${PAGE_LIMIT}&_start=${start}&_sort=${sortQuery}&_locale=${locale}`;
	const { data = {}, error } = useSWRImmutable(searchURL, fetchAPI);

	const products = data?.data ?? [];
	const nbProducts = data?.meta?.pagination.total ?? 0;
	const totalPages = data?.meta?.pagination.pageCount ?? 0;

	const titleLabel = `Mine: Résultats de recherche pour "${keyword}"`;
	const descriptionLabel = `Résultats de recherche pour "${keyword}" sur Mine Paris. Découvrez nos produits cosmétiques naturels.`;
	const canonicalUrl = `https://mineparis.com/search?keyword=${encodeURIComponent(keyword)}`;

	return (
		<>
			<Head>
				<title>{titleLabel}</title>
				<meta name="description" content={descriptionLabel} />
				<meta name="robots" content="index, follow" />
				<meta property="og:title" content={titleLabel} />
				<meta property="og:description" content={descriptionLabel} />
				<meta property="og:url" content={canonicalUrl} />
				<meta name="twitter:title" content={titleLabel} />
				<meta name="twitter:description" content={descriptionLabel} />
				<link rel="canonical" href={canonicalUrl} />
			</Head>

			<Hero
				className="hero-content mt-3"
				title={`${t('result_for')} "${keyword}"`}
				subtitle={`${nbProducts} produits trouvés`}
			/>

			<Container>
				<Row>
					<Col xs="12" className="products-grid sidebar-none">
						<ShopHeader
							nbProducts={nbProducts}
							sortOptionSelected={sortOptionSelected}
							setSortOptionSelected={setSortOptionSelected}
						/>

						{error ? (
							<div className="text-center py-5">
								<p>{t('error_default_message')}</p>
							</div>
						) : !products || !products?.length ? (
							<div className="d-flex justify-content-center align-items-center py-7 my-6">
								{keyword ? (
									<p>{t('no_results_found')}</p>
								) : (
									<Spinner color="dark" role="status" />
								)}
							</div>
						) : (
							<>
								<Row>
									{products.map((productData) => (
										<Col key={productData.id} xs="6" sm="4" md="4" lg="3" xl="3">
											<Product data={productData} />
										</Col>
									))}
								</Row>

								{totalPages > 1 && (
									<ShopPagination
										page={page}
										totalItems={nbProducts}
										totalPages={totalPages}
										handleChangePage={setPage}
									/>
								)}
							</>
						)}
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default SearchPage;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Form, Input, ListGroup, ListGroupItem, Spinner, Row, Col, Button } from 'reactstrap';
import { getStrapiMedia } from '../lib/media';

const NB_PRODUCTS_RESULTS_MAX = 4;

const SearchResultItem = ({ data, onClose }) => {
	const router = useRouter();
	const { brand, name, brandSlug, productSlug, thumbnail } = data;

	const handleRedirect = () => {
		router.push(`/product/${brandSlug}/${productSlug}`);
		onClose();
	};

	return (
		<ListGroupItem
			className="p-3 border-0 cursor-pointer"
			tag="a"
			action
			onClick={handleRedirect}
		>
			<Row className="align-items-center">
				<Col xs="auto" className="pe-0">
					<div style={{ width: 64, height: 64, position: 'relative' }} className="border rounded">
						{thumbnail && (
							<Image
								src={getStrapiMedia(thumbnail)}
								alt={name}
								fill
								className="rounded"
								style={{ objectFit: 'cover' }}
								sizes="64px"
								quality={80}
							/>
						)}
					</div>
				</Col>
				<Col>
					<div className="text-truncate fw-semibold">{name}</div>
					<small className="text-muted">{brand}</small>
				</Col>
			</Row>
		</ListGroupItem>
	);
};

const Searchbar = ({ searchToggle, setSearchToggle, searchResults, onSearch, isLoading }) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');

	if (!searchToggle) return null;

	const handleToggleSearch = () => {
		setSearchToggle(!searchToggle);
		setSearchTerm('');
	};

	const handleInputChange = (e) => {
		const value = e.target.value;
		setSearchTerm(value);
		onSearch(value);
	};

	const handleSeeMore = () => {
		router.push(`/search?keyword=${encodeURIComponent(searchTerm)}`);
		setSearchToggle(false);
	};

	const displayedResults = searchResults?.slice(0, NB_PRODUCTS_RESULTS_MAX);

	return (
		<div className="search-area-wrapper" style={{ display: "block" }}>
			<div className="search-area d-flex align-items-center justify-content-center flex-column">
				<div className="close-btn" onClick={handleToggleSearch}>
					<svg className="svg-icon svg-icon-light w-3rem h-3rem">
						<use xlinkHref="/icons/orion-svg-sprite.svg#close-1"> </use>
					</svg>
				</div>

				<div className="w-75">
					<Form className="p-4" onSubmit={(e) => e.preventDefault()}>
						<Input
							className="search-area-input"
							type="search"
							name="search"
							id="search"
							value={searchTerm}
							onChange={handleInputChange}
							autoFocus
							placeholder={t('search_placeholder')}
						/>
					</Form>

					<div className="container-fluid">
						<ListGroup>
							{isLoading
								? (
									<ListGroupItem className="d-flex justify-content-center align-items-center py-5 border-0">
										<Spinner className="mx-2" size="sm" color="primary" />
										<span>{t('searching')}</span>
									</ListGroupItem>
								)
								: displayedResults?.length
									? displayedResults.map((data) => (
										<SearchResultItem
											key={data.id}
											data={data}
											onClose={handleToggleSearch}
										/>
									))
									: searchTerm && !isLoading && (
										<ListGroupItem className="d-flex justify-content-center align-items-center" disabled>
											<i className="bi bi-search text-muted mx-2" />
											<p className="m-0">{t('no_results_found')}</p>
										</ListGroupItem>
									)}
						</ListGroup>
					</div>

					<div className="d-flex justify-content-center">
						{displayedResults.length > NB_PRODUCTS_RESULTS_MAX - 1 && (
							<Button
								className="text-center my-4"
								color="secondary"
								onClick={handleSeeMore}
							>
								{t('see_more_results')} ({searchResults.length - NB_PRODUCTS_RESULTS_MAX}+)
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Searchbar;

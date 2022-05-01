import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'reactstrap';
import { useTranslation } from 'next-i18next';

import Stars from "./Stars";
import Pagination from '../components/Pagination';
import { dateFormat } from '../utils/date';

const ITEMS_PER_PAGE = 5;

const Reviews = ({ comments, averageRating }) => {
	const { t } = useTranslation('common');

	const [currentPage, setCurrentPage] = useState(1);
	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(4);

	const handleChangePage = (page) => {
		setCurrentPage(page);
	};

	useEffect(() => {
		const startIndex = (currentPage * ITEMS_PER_PAGE) - ITEMS_PER_PAGE;
		setStart(startIndex);
		setEnd(startIndex + ITEMS_PER_PAGE);
	}, [currentPage]);

	return (
		<Container className="mb-5 col-xs-12 col-md-6">
			<Row className="mb-4">
				<Col className="d-flex flex-column align-items-center">
					<Stars
						stars={averageRating}
						secondColor="gray-300"
						starClass="mr-1"
						className="mr-2"
					/>

					<span className="text-muted text-uppercase text-sm mt-1">
						{nbComments} {t('reviews')}
					</span>
				</Col>
			</Row>
			{comments.slice(start, end).map((review) => (
				<Row key={review.name} className="review" lg="8">
					<Col className="d-flex align-items-center" lg="2">
						<div className="review-detail">
							<h5 className="mt-2 mb-1">{review.name}</h5>
							<Stars
								stars={review.rating}
								secondColor="gray-300"
								starClass="fa-xs"
							/>
						</div>
					</Col>
					<Col>
						<div className="mr-4 mr-xl-5 mb-2">
							<span className="text-muted">
								{dateFormat(review.created_at)}
							</span>
						</div>
						<p>{review.content}</p>
					</Col>
				</Row>
			))}
			<Pagination
				currentPage={currentPage}
				totalItems={nbComments}
				itemsPerPage={ITEMS_PER_PAGE}
				handleChangePage={handleChangePage}
			/>
		</Container>
	);
};

export default Reviews;
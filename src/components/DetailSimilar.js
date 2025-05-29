import React from "react";
import { Container, Row, Col } from "reactstrap";
import { useTranslation } from 'next-i18next';

import Product from "./Product";

const DetailSimilar = ({ products = [] }) => {
	const { t } = useTranslation('common');

	if (!products.length) return null;

	return (
		<Container id="detail-similar" className="container my-5">
			<Row>
				<h6 className="hero-heading">{t('might_like')}</h6>
			</Row>

			<Row className="justify-content-start">
				{products.map((data, index) => (
					<Col xl="3" lg="3" md="4" xs="6" key={index}>
						<Product data={data} />
					</Col>
				))}
			</Row>
		</Container>
	);
};

export default DetailSimilar;

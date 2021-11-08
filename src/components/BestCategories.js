import React from "react";
import Image from 'next/image';
import { Col, Row, Container } from "reactstrap";

const BestCategories = ({ t }) => {
	const categories = ['haircare', 'skincare', 'beardcare'];

	return (
		<Container>
			<Row>
				{categories.map(category => {
					const catName = t(category);

					return (
						<Col className="dark-overlay p-6 m-2">
							<div className="overlay-content text-center text-white">
								<h3>{catName}</h3>
							</div>
							<Image
								src={`/img/categories/${category}.jpg`}
								layout="fill"
								objectFit="cover"
								objectPosition="center"
								alt={catName}
							/>
						</Col>
					);
				})}
			</Row>
		</Container>
	);
};

export default BestCategories;

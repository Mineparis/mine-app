import React from "react";
import { Col, Row, Container } from "reactstrap";

const ServicesBlock = ({ data }) => {
	const { title, value1, value2, value3 } = data;
	return (
		<section className="py-6">
			<Container>
				<Row>
					<Col className="d-flex justify-content-center mb-5 text-muted">
						<h3>{title}</h3>
					</Col>
				</Row>
				<Row>
					<Col lg="4" className="service-column">
						<svg className="svg-icon service-icon">
							<use xlinkHref="/icons/orion-svg-sprite.svg#recycle-1">
								{" "}
							</use>
						</svg>
						<div className="service-text">
							<p className="text-muted font-weight-light text-sm mt-3">
								{value1}
							</p>
						</div>
					</Col>
					<Col lg="4" className="service-column">
						<svg className="svg-icon service-icon">
							<use xlinkHref="/icons/orion-svg-sprite.svg#approve-comment-1"> </use>
						</svg>
						<div className="service-text">
							<p className="text-muted font-weight-light text-sm mt-3">
								{value2}
							</p>
						</div>
					</Col>
					<Col lg="4" className="service-column">
						<svg className="svg-icon service-icon">
							<use xlinkHref="/icons/orion-svg-sprite.svg#like-1">
								{" "}
							</use>
						</svg>
						<div className="service-text">
							<p className="text-muted font-weight-light text-sm mt-3">
								{value3}
							</p>
						</div>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default ServicesBlock;

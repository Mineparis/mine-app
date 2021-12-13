import React from "react";
import Image from "next/image";
import { Card, CardBody, Row, Col, CardText } from "reactstrap";

const ImageOverlay = () => {
	return (
		<div id="imageoverlay" className="docs-item element">
			<h5 className="text-uppercase mb-4">Image overlay</h5>
			<div className="docs-desc">
				<p className="lead">
					Utility class that darkens or lightens the backround image of the
					element to enhance the legibility. It can be used with cards, carousel
					slides, etc. Now with responsive behaviour too.
				</p>
			</div>
			<div className="mt-5">
				<Row>
					<Col lg="6">
						<Card className="mb-5 border-0 text-white dark-overlay">
							<Image
								layout="fill"
								src="/img/photo/malvestida-magazine-458585-unsplash.jpg"
								alt=""
								className="card-img"
							/>
							<a href="/category-full" className="tile-link" />
							<div className="card-img-overlay d-flex align-items-center">
								<div className="text-center w-100 overlay-content">
									<h2 className="display-4 font-weight-bold text-uppercase text-center mb-0">
										Ladies{" "}
									</h2>
								</div>
							</div>
						</Card>
					</Col>
					<Col lg="6">
						<Card className="mb-5 border-0 text-center light-overlay">
							<Image
								layout="fill"
								src="/img/photo/malvestida-magazine-458585-unsplash.jpg"
								alt=""
								className="card-img"
							/>
							<a href="/category-full" className="tile-link" />
							<div className="card-img-overlay d-flex align-items-center">
								<div className="text-center w-100 overlay-content">
									<h2 className="display-4 font-weight-bold text-uppercase text-center mb-0">
										Ladies{" "}
									</h2>
								</div>
							</div>
						</Card>
					</Col>
				</Row>
				<Card className="bg-gray-100 border-0">
					<CardBody>
						<h6 className="text-muted text-uppercase font-weight-normal mb-3">
							Class reference
						</h6>
						<CardText>
							<code>.dark-overlay</code> or <code>.light-overlay</code> - CSS
							class to be used on the element, accepts Boostrap responsive
							suffixes. (e.g. <code>.dark-overlay.dark-overlay-lg-0</code>{" "}
							creates overlay on smaller viewports and hides it on lg+ screens.)
						</CardText>
						<CardText>
							<code>.overlay-content</code> - use this class on the element's
							content to increase its Z-index and move it above the overlay
							layer
						</CardText>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default ImageOverlay;

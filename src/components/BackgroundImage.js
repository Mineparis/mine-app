import React from "react";

import { Container, Card, CardBody } from "reactstrap";

const BackgroundImage = ({ src, alt = '', isFullScreen, isDarkOverlay, size = 'py-6', children }) => {
	const overlayAttr = isDarkOverlay ? 'dark-overlay' : '';
	return isFullScreen ? (
		<div className={`mh-full-screen pt-header-height ${overlayAttr}`}>
			<img
				className="bg-image"
				src={src}
				alt={alt}
				layout="fill"
			/>
			<Container className={`d-flex flex-column align-items-center text-center overlay-content ${size}`}>
				{children}
			</Container>
		</div>
	) : (
		<Card className={`border-0 position-relative overflow-hidden ${size} ${overlayAttr}`}>
			<img
				className="bg-image"
				src={src}
				alt={alt}
			/>
			<CardBody className={`text-center position-relative overlay-content ${size}`}>
				{children}
			</CardBody>
		</Card>
	);
};

export default BackgroundImage;

import React from "react";
import { Container, Row, Col } from "reactstrap";

import Breadcrumbs from "./Breadcrumbs";

const Hero = ({
	children,
	className = 'hero-content pb-5 text-center',
	breadcrumbs,
	title,
	content,
	centerBreadcrumbs
}) => {
	return (
		<section className="hero">
			<Container>
				{breadcrumbs && <Breadcrumbs className="no-border mb-0 pb-4" links={breadcrumbs} center={centerBreadcrumbs} />}
				<div className={className}>
					<h1 className="mb-3 text-capitalize font-italic">{title}</h1>
					{content && (
						<Row>
							<Col md="6" xl="6" className="mb-1">
								<h3 className="lead">{content}</h3>
							</Col>
						</Row>
					)}
					{children}
				</div>
			</Container>
		</section>
	);
};

export default Hero;

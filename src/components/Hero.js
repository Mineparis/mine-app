import React from "react";
import Breadcrumbs from "./Breadcrumbs";

import { Container, Row, Col } from "reactstrap";

const Hero = ({ children, className = 'hero-content pb-5 text-center', breadcrumbs, title, content }) => {

	return (
		<section className="hero">
			<Container>
				{breadcrumbs && <Breadcrumbs className="no-border mb-0 pb-4" links={breadcrumbs} />}
				<div className={className}>
					<h1 className="mb-3 text-capitalize font-italic">{title}</h1>
					{content && (
						<Row>
							<Col xl="4" dangerouslySetInnerHTML={{ __html: content }} />
						</Row>
					)}
					{children}
				</div>
			</Container>
		</section>
	);
};

export default Hero;

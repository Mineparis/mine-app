import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { Container, Row, Col } from "reactstrap";

import Hero from "../components/Hero";
import ContactForm from "../components/ContactForm";

import UseWindowSize from "../hooks/UseWindowSize";

export async function getStaticProps() {
	return {
		props: {
			nav: {
				light: true,
				classes: "navbar-sticky bg-fixed-white",
				color: "white",
			},
			title: "Contact",
		},
	};
}

let Map;

const Contact = (props) => {
	const [mapLoaded, setMapLoaded] = useState(false);
	const [dragging, setDragging] = useState(false);
	const [tap, setTap] = useState(false);

	const size = UseWindowSize();

	useEffect(() => {
		Map = dynamic(() => import("../components/Map"), { ssr: false });
		setMapLoaded(true);

		setTap(size.width > 700 ? true : false);
		setDragging(size.width > 700 ? true : false);
	}, []);

	return (
		<>
			<Hero title={props.title} />

			<section>
				<Container>
					<Row>
						<Col className="mb-3">
							<ContactForm />
						</Col>
					</Row>
				</Container>
			</section>
			<div className="map-wrapper-300">
				{mapLoaded && (
					<Map
						className="h-100"
						center={[48.85674116011365, 2.3484260449616103]}
						markerPosition={[48.85674116011365, 2.3484260449616103]}
						zoom={12}
						dragging={dragging}
						tap={tap}
					/>
				)}
			</div>
		</>
	);
};

export default Contact;
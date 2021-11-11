import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Container, Row, Col } from "reactstrap";

import Hero from "../components/Hero";
import ContactForm from "../components/ContactForm";

import UseWindowSize from "../hooks/UseWindowSize";

export const getStaticProps = async ({ locale }) => {
	const lang = locale || DEFAULT_LANG;

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
		},
	};
};

let Map;
const markerPosition = [48.86613886844974, 2.329385919103998];


const Contact = () => {
	const [mapLoaded, setMapLoaded] = useState(false);
	const [tap, setTap] = useState(false);

	const size = UseWindowSize();

	useEffect(() => {
		Map = dynamic(() => import("../components/Map"), { ssr: false });
		setMapLoaded(true);
		setTap(size.width > 700);
	}, []);

	return (
		<>
			<Hero title="Contact" />

			<section>
				<Container>
					<Row>
						<Col className="mb-3 mx-5">
							<ContactForm />
						</Col>
					</Row>
				</Container>
			</section>
			<div className="map-wrapper-300">
				{mapLoaded && (
					<Map
						className="h-100"
						center={markerPosition}
						markerPosition={markerPosition}
						zoom={12}
						dragging={tap}
						tap={tap}
					/>
				)}
			</div>
		</>
	);
};

export default Contact;
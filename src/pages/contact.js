import React from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Container, Row, Col } from "reactstrap";

import Hero from "../components/Hero";
import ContactForm from "../components/ContactForm";


export const getStaticProps = async ({ locale }) => {
	const lang = locale || DEFAULT_LANG;

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			lang,
		},
	};
};


const Contact = ({ lang }) => {
	return (
		<>
			<Hero title="Contact" />

			<section>
				<Container>
					<Row>
						<Col className="mb-3 mx-5">
							<ContactForm lang={lang} />
						</Col>
					</Row>
				</Container>
			</section>
		</>
	);
};

export default Contact;
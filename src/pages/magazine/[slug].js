import React from "react";
import { Container, Row, Col } from "reactstrap";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Hero from "../../components/Hero";
import { dateFormat } from "../../utils/date";
import { DEFAULT_LANG, REVALIDATE_PAGE_SECONDS } from "../../utils/constants";
import { fetchAPI } from "../../lib/api";

export const getStaticPaths = async () => {
	const posts = await fetchAPI('/blogs');

	return {
		paths: posts.map(({ slug }) => ({ params: { slug } })),
		fallback: false,
	};
};

export const getStaticProps = async ({ params, locale }) => {
	const lang = locale || DEFAULT_LANG;

	const [post] = await fetchAPI(`/blogs?slug=${params.slug}`);
	const { title, content, created_at } = post;

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			title,
			content,
			created_at,
		},
		revalidate: REVALIDATE_PAGE_SECONDS
	};
};

const MagazinePost = ({ title, content, created_at }) => {
	const breadcrumbs = [{ name: 'Magazine', link: '/magazine' }];

	return (
		<>
			<Hero
				className="hero-content text-center"
				title={title}
				breadcrumbs={breadcrumbs}
				centerBreadcrumbs
			>
				<Row>
					<Col lg="10" xl="8" className="mx-auto">
						<div className="mb-5 text-muted font-weight-light d-flex align-items-center justify-content-center">
							{dateFormat(created_at)}
						</div>
					</Col>
				</Row>
			</Hero>

			<section>
				<Container>
					<Row>
						<Col xl="8" lg="10" className="mx-auto">
							<div className="text-content text-lg">
								<div dangerouslySetInnerHTML={{ __html: content }} className="ck-content" />
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		</>
	);
};

export default MagazinePost;
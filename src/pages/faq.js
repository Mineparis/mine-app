import Hero from "../components/Hero";
import React from 'react';
import { Container, Row, Col } from "reactstrap";

import data from "../data/faq.json";

export async function getStaticProps() {
	return {
		props: {
			nav: {
				light: true,
				classes: "navbar-sticky bg-fixed-white",
				color: "white",
			},
			title: "FAQs",
		},
	};
}

export default function Faq() {
	const groupByN = (n, data) => {
		let result = [];
		for (let i = 0; i < data.length; i += n) result.push(data.slice(i, i + n));
		return result;
	};

	return (
		<>
			<Hero
				title={data.title}
				breadcrumbs={data.breadcrumbs}
				content={data.content}
			/>

			<section className="py-6">
				<Container>
					{data.questionGroups &&
						data.questionGroups.map((group) => {
							const groupedQuestions =
								group.questions && groupByN(2, group.questions);

							return (
								<div key={group.title} className="py-4">
									<h2 className="mb-5 text-muted">{group.title}</h2>
									<Row>
										{groupedQuestions.map((questions) => (
											<Col md="6" key={questions[0].title}>
												{questions.map((question) => (
													<React.Fragment key={question.title}>
														<h5>{question.title}</h5>
														<p className="text-muted mb-4">
															{question.content}
														</p>
													</React.Fragment>
												))}
											</Col>
										))}
									</Row>
								</div>
							);
						})}
				</Container>
			</section>
		</>
	);
}

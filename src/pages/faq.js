import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Container, Row, Col } from "reactstrap";
import { DEFAULT_LANG } from '../utils/constants';

import data from "../data/faq.json";

export const getStaticProps = async ({ locale }) => {
	const lang = locale || DEFAULT_LANG;

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
		},
	};
};

const FAQ = () => {
	const groupByN = (n, data) => {
		let result = [];
		for (let i = 0; i < data.length; i += n) result.push(data.slice(i, i + n));
		return result;
	};

	return (
		<Container>
			{data.groups.map(({ title, questions }) => {
				const groupedQuestions = questions && groupByN(2, questions);

				return (
					<div key={title} className="py-4">
						<h2 className="mb-5 text-muted">{title}</h2>
						<Row>
							{groupedQuestions.map((questions) => (
								<Col md="6" key={questions[0].title}>
									{questions.map((question) => (
										<React.Fragment key={question.title}>
											<h5>{question.title}</h5>
											{question?.content && <p className="text-muted mb-4">{question.content}</p>}
											{question?.table?.length && (
												<table className="my-3">
													<tbody>
														{question.table.map(({ col1, col2 }) => (
															<tr>
																<td className="border px-1">{col1}</td>
																<td className="border px-1">{col2}</td>
															</tr>
														))}
													</tbody>
												</table>
											)}
											{question?.info1 && <p className="text-muted mb-1">{question.info1}</p>}
											{question?.info2 && <p className="text-muted mb-1">{question.info2}</p>}
										</React.Fragment>
									))}
								</Col>
							))}
						</Row>
					</div>
				);
			})}
		</Container>
	);
};

export default FAQ;
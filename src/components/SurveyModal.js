import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button, Modal, ModalHeader, ModalBody, Container, Row, Col, Progress } from 'reactstrap';

const SurveyModal = ({ survey, isOpen = false, onToggleModal }) => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const [page, setPage] = useState(0);
	const [responsesSelected, setResponsesSelected] = useState([]);
	const { questions, redirectionMessage, redirections } = survey;

	const handleToggleModal = () => {
		onToggleModal(!isOpen);
	};

	const handleGoPrevPage = () => {
		setPage(page - 1);
	};

	const handleSelectResponse = (responseNumber) => {
		const nextPage = page + 1;
		setResponsesSelected([...responsesSelected, `${nextPage}-${responseNumber}`]);
		setPage(nextPage);
	};

	const getRedirectionLink = () => {
		const redirection = redirections.find(({ responsesSerie }) => {
			const responsesSelectedStringify = responsesSelected.join();
			const series = responsesSerie.split('|');

			const hasValidConditionedSeries = series.some(serie => {
				const seriesConditioned = serie.split('&');
				return seriesConditioned.every(serieConditioned => responsesSelectedStringify.includes(serieConditioned));
			});

			return hasValidConditionedSeries;
		});

		return redirection.link;
	};

	const getQuestion = () => {
		if (page >= questions.length) {
			const redirectionLink = getRedirectionLink();

			if (!redirectionLink) {
				return (
					<Row className="d-flex flex-column justify-content-center h-100">
						<h3>{t('error_default_message')}</h3>
					</Row>
				);
			}

			setTimeout(() => {
				router.push(redirectionLink);
			}, 2000);

			return (
				<Col className="d-flex flex-column justify-content-center h-100">
					<Row className="d-flex justify-content-center">
						<h4>{redirectionMessage}</h4>
					</Row>
				</Col>
			);
		} else {
			const { question, responses } = questions[page];

			return (
				<>
					<Row className="m-4 d-flex justify-content-center">
						<h4>{question}</h4>
					</Row>
					<Row>
						<div className="d-flex flex-column d-grid gap-2 col-lg-6 col-md-12 mx-auto">
							{responses
								.sort((a, b) => a.number - b.number)
								.map(({ label, number }, index) => (
									<Button
										key={`${index}-${number}`}
										className="my-2"
										onClick={() => handleSelectResponse(number)}
									>
										{label}
									</Button>
								))
							}
						</div>
					</Row>
				</>
			);
		}
	};

	const CloseBtn = (
		<Button type="button" onClick={handleToggleModal} outline>
			<i className="bi bi-x-lg" />
		</Button>
	);

	const progressValue = page * 100 / questions.length;
	const hasPrevBtn = page > 0 && page !== questions.length;

	return (
		<div>
			<Modal className="modal-fullscreen" isOpen={isOpen} toggle={handleToggleModal} fade>
				<Progress style={{ height: "3px" }} color="dark" value={progressValue} />
				<ModalHeader toggle={handleToggleModal} close={CloseBtn}>
					<div style={{ height: "3rem" }}>
						{hasPrevBtn && <Button type="button" onClick={handleGoPrevPage} outline><i className="bi bi-arrow-left" /></Button>}
					</div>
					<div className="d-flex justify-content-center pl-5">
						<img src="svg/logo.svg" alt="" />
					</div>
				</ModalHeader>
				<ModalBody>
					<Container className="h-100">
						{getQuestion()}
					</Container>
				</ModalBody>
			</Modal>
		</div>
	);
};

export default SurveyModal;
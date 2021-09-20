import {
	Container,
	Row,
	Col,
	Form,
	FormGroup,
	Label,
	Input,
	Button,
} from "reactstrap";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Link from "next/link";

import { DEFAULT_LANG } from "../utils/constants";
import { useTranslation } from "next-i18next";

export async function getStaticProps({ locale }) {
	const lang = locale || DEFAULT_LANG;
	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
		},
	};
}

const Login = () => {
	const { t } = useTranslation('common');

	return (
		<Container>
			<Row className="justify-content-center">
				<Col lg="5">
					<div className="block">
						<div className="block-header">
							<h6 className="text-uppercase mb-0">{t('log_in')}</h6>
						</div>
						<div className="block-body">
							<Form>
								<FormGroup>
									<Label className="form-label" htmlFor="email_1">
										Email
									</Label>
									<Input id="email_1" type="text" />
								</FormGroup>
								<FormGroup>
									<Label className="form-label text-capitalize" htmlFor="password_1">
										{t('password')}
									</Label>
									<Input id="password" type="password_1" />
								</FormGroup>
								<FormGroup>
									<Button color="outline-dark" type="submit">
										<i className="fa fa-sign-in-alt mr-2" /> {t('log_in')}
									</Button>
								</FormGroup>
							</Form>
						</div>
					</div>
				</Col>
				<Col lg="5">
					<div className="block">
						<div className="block-header">
							<h6 className="text-uppercase mb-0">{t('new_account')}</h6>
						</div>
						<div className="block-body">
							<p className="lead">{t('new_account_message')}</p>
							<p className="text-muted">
								{t('new_account_contact_message')}{" "}
								<Link href="/contact">
									<a>{t('contact_us')}</a>
								</Link>
								.
							</p>
							<hr />
							<Form>
								<FormGroup>
									<Label className="form-label" htmlFor="firstName">
										{t('firstName')}
									</Label>
									<Input id="firstName" type="text" />
								</FormGroup>
								<FormGroup>
									<Label className="form-label" htmlFor="lastName">
										{t('lastName')}
									</Label>
									<Input id="lastName" type="text" />
								</FormGroup>
								<FormGroup>
									<Label className="form-label" htmlFor="email">
										Email
									</Label>
									<Input id="email" type="text" />
								</FormGroup>
								<FormGroup>
									<Label className="form-label" htmlFor="password">
										{t('password')}
									</Label>
									<Input id="password" type="password" />
								</FormGroup>
								<FormGroup>
									<Button color="outline-dark" type="submit">
										<i className="far fa-user mr-2" />
										{t('register')}
									</Button>
								</FormGroup>
							</Form>
						</div>
					</div>
				</Col>
			</Row>
		</Container>
	);
};

export default Login;
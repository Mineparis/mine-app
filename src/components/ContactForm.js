import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import { Row, Col, Form, FormGroup, Input, Button } from "reactstrap";
import * as Sentry from "@sentry/nextjs";

import { fetchAPI } from "../lib/api";

const ContactForm = (props) => {
	const { t } = useTranslation('common');

	const [formData, setFormData] = useState({
		firstName: null,
		lastName: null,
		email: null,
		message: null,
	});

	const handleChangeData = ({ target: { name, value } }) => {
		setFormData(prevState => ({ ...prevState, [name]: value }));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		fetchAPI('/contact', 'POST', formData).then(res => {
			if (res.ok) {
				const msg = t('email_sent_successfully');
				toast.success(msg);
			} else {
				Sentry.captureException(res);
				const errMsg = t('error_default_message');
				toast.error(errMsg);
			}
		});
	};

	return (
		<Form {...props} onSubmit={handleSubmit}>
			<div className="controls">
				<Row>
					<Col sm="6">
						<FormGroup>
							<Input
								type="text"
								name="firstName"
								id="firstName"
								placeholder={t('firstName')}
								onChange={handleChangeData}
								required
							/>
						</FormGroup>
					</Col>
					<Col sm="6">
						<FormGroup>
							<Input
								type="text"
								name="lastName"
								id="lastName"
								placeholder={t('lastName')}
								onChange={handleChangeData}
								required
							/>
						</FormGroup>
					</Col>
				</Row>
				<FormGroup>
					<Input
						type="email"
						name="email"
						id="email"
						placeholder="Email"
						onChange={handleChangeData}
						required
					/>
				</FormGroup>
				<FormGroup>
					<Input
						type="textarea"
						rows="4"
						name="message"
						id="message"
						placeholder="Message"
						onChange={handleChangeData}
						required
					/>
				</FormGroup>
				<Button type="submit" color="outline-dark" className="mx-auto">
					{t('send')}
				</Button>
			</div>
		</Form>
	);
};

export default ContactForm;

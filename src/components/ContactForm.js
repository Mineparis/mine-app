import { Row, Col, Form, FormGroup, Input, Label, Button } from "reactstrap";

const ContactForm = (props) => {
	return (
		<Form {...props}>
			<div className="controls">
				<Row>
					<Col sm="6">
						<FormGroup>
							<Label for="firstName" className="form-label">
								First name *
              </Label>
							<Input
								type="text"
								name="firstName"
								id="firstName"
								placeholder="Enter your first name"
								required
							/>
						</FormGroup>
					</Col>
					<Col sm="6">
						<FormGroup>
							<Label for="lastName" className="form-label">
								Last name *
              </Label>
							<Input
								type="text"
								name="lastName"
								id="lastName"
								placeholder="Enter your last name"
								required
							/>
						</FormGroup>
					</Col>
				</Row>
				<FormGroup>
					<Label for="email" className="form-label">
						Email *
          </Label>
					<Input
						type="email"
						name="email"
						id="email"
						placeholder="Enter your email"
						required
					/>
				</FormGroup>
				<FormGroup>
					<Label for="message" className="form-label">
						Message *
          </Label>
					<Input
						type="textarea"
						rows="4"
						name="message"
						id="message"
						placeholder="Enter your message"
						required
					/>
				</FormGroup>
				<Button type="submit" color="outline-dark">
					Send
        </Button>
			</div>
		</Form>
	);
};

export default ContactForm;

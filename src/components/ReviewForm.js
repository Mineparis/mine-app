import React from "react";

import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  Badge,
} from "reactstrap";

const ReviewForm = () => {
  return (
    <div className="py-5 px-3">
      <h4 className="mb-4">Leave a review</h4>
      <Form className="mb-4 form">
        <Row>
          <Col sm="6">
            <FormGroup>
              <Label for="name" className="form-label">
                Your name *
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your name"
                required
              />
            </FormGroup>
          </Col>
          <Col sm="6">
            <FormGroup>
              <Label for="rating" className="form-label">
                Your name *
              </Label>
              <select
                name="rating"
                id="rating"
                className="custom-select focus-shadow-0"
              >
                <option value="5">
                  &#9733;&#9733;&#9733;&#9733;&#9733; (5/5)
                </option>
                <option value="4">
                  &#9733;&#9733;&#9733;&#9733;&#9734; (4/5)
                </option>
                <option value="3">
                  &#9733;&#9733;&#9733;&#9734;&#9734; (3/5)
                </option>
                <option value="2">
                  &#9733;&#9733;&#9734;&#9734;&#9734; (2/5)
                </option>
                <option value="1">
                  &#9733;&#9734;&#9734;&#9734;&#9734; (1/5)
                </option>
              </select>
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="email" className="form-label">
            Your name *
          </Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your  email"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="review" className="form-label">
            Review text *
          </Label>
          <Input
            rows="4"
            type="textarea"
            name="review"
            id="review"
            placeholder="Enter your review"
            required
          />
        </FormGroup>
        <Button type="submit" color="outline-dark">
          Post review
        </Button>
      </Form>
      <p className="text-muted text-sm">
        <Badge color="info">Note</Badge> This form shows usage of the classic
        Bootstrap form controls, not their underlined variants. You can choose
        whichever variant you want.
      </p>
    </div>
  );
};

export default ReviewForm;

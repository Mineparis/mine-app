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

import CustomerSidebar from "../components/CustomerSidebar";
import Hero from "../components/Hero";

import data from "../data/customer-account.json";

export async function getStaticProps() {
  return {
    props: {
      nav: {
        light: true,
      },
      title: "Customer - Account",
      loggedUser: true,
    },
  };
}

export default function CustomerAccount() {
  return (
    <>
      <Hero
        title={data.subtitle}
        breadcrumbs={data.breadcrumbs}
        content={data.content}
      />

      <section>
        <Container>
          <Row>
            <Col lg="8" xl="9">
              <div className="block mb-5">
                <div className="block-header">
                  <strong className="text-uppercase">
                    Change your password
                  </strong>
                </div>
                <div className="block-body">
                  <Form>
                    <Row>
                      <Col sm="6">
                        <FormGroup>
                          <Label className="form-label" htmlFor="password_old">
                            Old password
                          </Label>
                          <Input id="password_old" type="password" />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        <FormGroup>
                          <Label className="form-label" htmlFor="password_1">
                            New password
                          </Label>
                          <Input id="password_1" type="password" />
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <FormGroup>
                          <Label className="form-label" htmlFor="password_2">
                            Retype new password
                          </Label>
                          <Input id="password_2" type="password" />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="mt-4 text-center">
                      <Button color="dark" type="submit">
                        <i className="far fa-save mr-2" />
                        Change password
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
              <div className="block mb-5">
                <div className="block-header">
                  <strong className="text-uppercase">Personal details</strong>
                </div>
                <div className="block-body">
                  <Form>
                    <Row>
                      <Col sm="6">
                        <FormGroup>
                          <Label className="form-label" htmlFor="firstname">
                            Firstname
                          </Label>
                          <Input id="firstname" type="text" />
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <FormGroup>
                          <Label className="form-label" htmlFor="lastname">
                            Lastname
                          </Label>
                          <Input id="lastname" type="text" />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        <FormGroup>
                          <Label className="form-label" htmlFor="company">
                            Company
                          </Label>
                          <Input id="company" type="text" />
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <FormGroup>
                          <Label className="form-label" htmlFor="street">
                            Street
                          </Label>
                          <Input id="street" type="text" />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col sm="6" md="3">
                        <FormGroup>
                          <Label className="form-label" htmlFor="city">
                            Company
                          </Label>
                          <Input id="city" type="text" />
                        </FormGroup>
                      </Col>
                      <Col sm="6" md="3">
                        <FormGroup>
                          <Label className="form-label" htmlFor="zip">
                            ZIP
                          </Label>
                          <Input id="zip" type="text" />
                        </FormGroup>
                      </Col>
                      <Col sm="6" md="3">
                        <FormGroup>
                          <Label className="form-label" htmlFor="state">
                            State
                          </Label>
                          <select className="form-control" id="state" />
                        </FormGroup>
                      </Col>
                      <Col sm="6" md="3">
                        <FormGroup>
                          <Label className="form-label" htmlFor="country">
                            Country
                          </Label>
                          <select className="form-control" id="country" />
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <FormGroup>
                          <Label className="form-label" htmlFor="phone">
                            Telephone
                          </Label>
                          <Input id="phone" type="text" />
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <FormGroup>
                          <Label className="form-label" htmlFor="email">
                            Email
                          </Label>
                          <Input id="email" type="text" />
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="text-center mt-4">
                      <button className="btn btn-outline-dark" type="submit">
                        <i className="far fa-save mr-2" />
                        Save changes
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
            </Col>

            <CustomerSidebar />
          </Row>
        </Container>
      </section>
    </>
  );
}

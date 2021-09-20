import React from "react";
import Breadcrumbs from "./Breadcrumbs";

import { Container, Row, Col } from "reactstrap";
import { Parallax } from "react-parallax";

const HeroParallax = (props) => {
  return (
    <>
      <Parallax
        bgImage="/img/photo/erii-gutierrez-487083-unsplash.jpg"
        strength={500}
        className="position-relative dark-overlay py-3 py-lg-7 overflow-hidden"
      >
        <Container className="overlay-content hero hero-page text-white">
          <div className="hero-content pb-5 text-center">
            {props.breadcrumbs && (
              <Breadcrumbs
                className="text-white justify-content-center no-border mb-0"
                links={props.breadcrumbs}
                linkClass="text-white"
                spanClass="text-white"
              />
            )}
            <h1 className="mb-5">{props.title && props.title}</h1>
            {props.content && (
              <Row>
                <Col xl="8" className="mx-auto">
                  <p className="lead mb-0">{props.content}</p>
                </Col>
              </Row>
            )}
          </div>
        </Container>
      </Parallax>
    </>
  );
};

export default HeroParallax;

import React from "react";
import { Row, Col } from "reactstrap";

const Icons = () => {
  return (
    <div id="icons" className="docs-item element">
      <h5 className="text-uppercase mb-4">Icons</h5>
      <div className="docs-desc">
        <p className="lead">
          This theme comes with two icon packs and includes icon component for
          simple icon management.
        </p>
      </div>

      <div className="docs-desc mt-5">
        <p className="lead">
          <strong>70+ Premium E-commerce SVG icons</strong>
        </p>
        <p className="text-muted text-large">
          For a complete icon reference, see{" "}
          <a href="https://demo.bootstrapious.com/varkala/1-2/icons/demo.html">
            here
          </a>
          .
        </p>
      </div>
      <div className="mt-5">
        <Row>
          {iconsEcommerce.map((iconItem) => (
            <Col
              key={iconItem}
              xs="3"
              md="2"
              className="d-flex justify-content-center"
            >
              <svg className="svg-icon w-3rem h-3rem mb-5 svg-icon-light text-dark">
                <use xlinkHref={`/icons/orion-svg-sprite.svg#${iconItem}`} />
              </svg>
            </Col>
          ))}
        </Row>
      </div>
      <div className="docs-desc mt-5">
        <p className="lead">
          <strong>
            Vector icons and social logos on your website with Font Awesome, the
            web’s most popular icon set and toolkit.
          </strong>
        </p>
        <p className="text-muted text-large">
          These icons are mostly used in buttons or for social network links.
          For a complete icon reference, see{" "}
          <a href="https://fontawesome.com/icons?d=gallery">here</a>.
        </p>
      </div>
      <div className="mt-5">
        <ul className="list-unstyled">
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-address-book" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="far fa-address-book" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-address-card" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="far fa-address-card" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-adjust" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-align-center" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-align-justify" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-align-left" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-align-right" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-allergies" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-ambulance" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-american-sign-language-interpreting" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-anchor" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-angle-double-down" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-angle-double-left" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-angle-double-right" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-angle-double-up" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-angle-down" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-angle-left" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-angle-right" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-angle-up" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-archive" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="fas fa-arrow-alt-circle-down" />
          </li>
          <li className="list-inline-item h5 mr-3">
            <i className="far fa-arrow-alt-circle-down"> </i>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Icons;

const iconsEcommerce = [
  "checkout-cart-1",
  "basket-1",
  "paper-bag-1",
  "map-marker-1",
  "smartphone-1",
  "dollar-sign-1",
  "open-box-1",
  "on-sale-sticker-1",
  "pay-1",
  "giftbox-1",
  "store-1",
  "pay-by-card-1",
];

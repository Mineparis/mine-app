import React from "react";

import Product from "../../Product";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
import products from "../../../data/products.json";
import { Row, Col } from "reactstrap";
const ProductDocs = () => {
  return (
    <div id="product" className="docs-item element">
      <h5 className="text-uppercase mb-4">Product</h5>
      <div className="docs-desc">
        <p className="lead">
          Product component used in the product listing. Contains animated
          buttons appearing after hovering above the component.
        </p>
        <div className="mt-5">
          <Row>
            {products.slice(0, 3).map((value, index) => (
              <Col sm="6" lg="4" xl="4" key={index}>
                <Product data={value} showQuickView />
              </Col>
            ))}
          </Row>
        </div>
      </div>
      <div className="mt-5">
        <SyntaxHighlighter
          language="javascript"
          style={tomorrow}
          className="rounded shadow p-4"
        >
          {highlightCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default ProductDocs;

const highlightCode = `import Product from "./Product";
import { Row, Col } from "reactstrap";

const Component = () => {
    return(
      <Row>
        {products.map((value, index) => (
          <Col sm="6" lg="4" xl="4" key={index}>
            <Product data={value} showQuickView />
          </Col>
        ))}
      </Row>
    )
}

export default Component`;

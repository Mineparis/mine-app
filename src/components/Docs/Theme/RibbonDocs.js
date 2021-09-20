import React from "react";
import { Card } from "reactstrap";

const RibbonDocs = () => {
  return (
    <div id="ribbon" className="docs-item element">
      <h5 className="text-uppercase mb-4">Ribbon</h5>
      <div className="docs-desc">
        <p className="lead">
          Product component used in the product listing. Contains animated
          buttons appearing after hovering above the component.
        </p>
        <div className="mt-5">
          <Card className="bg-gray-100 w-50 w-lg-25 position-relative py-6 border-0">
            <div className="ribbon ribbon-primary">Primary</div>
            <div className="ribbon ribbon-dark">Dark</div>
            <div className="ribbon ribbon-info">Info</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RibbonDocs;

import React from "react";
import { Card, CardBody } from "reactstrap";
import Breadcrumbs from "../../Breadcrumbs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
const BreadcrumbsDocs = () => {
  return (
    <div id="breadcrumbs" className="docs-item element">
      <h5 className="text-uppercase mb-4">Breadcrumbs</h5>
      <div className="docs-desc">
        <p className="lead">
          Theme's <code>Breadcrumbs</code> component
        </p>
        <div className="mt-5">
          <Card className="mb-3">
            <CardBody>
              <Breadcrumbs
                links={[
                  {
                    name: "Home",
                    link: "/",
                  },
                  {
                    name: "Documentation",
                    link: "/docs/introduction",
                  },
                  {
                    name: "Next.js",
                    active: true,
                  },
                ]}
                className="justify-content-center"
              />
            </CardBody>
          </Card>
        </div>
      </div>
      <div className="mt-4">
        <SyntaxHighlighter
          language="javascript"
          style={tomorrow}
          className="rounded shadow p-4"
        >
          {breadcrumbsCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default BreadcrumbsDocs;

const breadcrumbsCode = `import Breadcrumbs from './components/Breadcrumbs'

    const Component = () => {
    return (
        <Breadcrumbs
            links={[
              {
                name: "Home",
                link: "/",
              },
              {
                name: "Documentation",
                link: "/docs/introduction",
              },
              {
                name: "Next.js",
                active: true,
              },
            ]}
            className="justify-content-center"
        />
    )
}

export default Component
`;

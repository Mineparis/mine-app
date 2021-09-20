import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { Alert } from "reactstrap";

const Alerts = () => {
  const alerts = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "light",
    "dark",
  ];
  return (
    <div id="alerts" className="docs-item element">
      <h5 className="text-uppercase mb-4">Alert</h5>
      <div className="docs-desc">
        <p className="lead">
          Provide contextual feedback messages for typical user actions with the
          handful of available and flexible alert messages. See the{" "}
          <a href="https://reactstrap.github.io/components/alerts/">
            ReactStrap documentation
          </a>{" "}
          for more details.{" "}
        </p>
      </div>
      <div className="mt-5">
        <div className="docs-example">
          {alerts.map((alertColor) => (
            <Alert key={alertColor} color={alertColor}>
              This is a {alertColor} alert—check it out!{" "}
            </Alert>
          ))}
        </div>
      </div>
      <div className="mt-4">
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

export default Alerts;

const highlightCode = `import { Alert } from 'reactstrap'

const Component = () => {
    return (
        <Alert color="primary">This is a primary alert—check it out!</Alert>
    )
}

export default Component
`;

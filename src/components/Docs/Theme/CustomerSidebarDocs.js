import React from "react";

import CustomerSidebar from "../../CustomerSidebar";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

const CustomerSidebarDocs = () => {
  return (
    <div id="customersidebar" className="docs-item element">
      <h5 className="text-uppercase mb-4">Customer Sidebar</h5>
      <div className="docs-desc">
        <p className="lead">
          A custom navigation component used in the customer zone based on the
          Bootstrap's listgroup.
        </p>
        <p className="text-muted small">
          Use <code>xl</code> & <code>lg</code> prop to set large & extra large
          column sizes.
        </p>
        <div className="mt-5">
          <CustomerSidebar xl="4" />
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

export default CustomerSidebarDocs;

const highlightCode = `import CustomerSidebar from "./CustomerSidebar";

const Component = () => {
    return(
        <CustomerSidebar lg="5" xl="4"/>
    )
}

export default Component`;

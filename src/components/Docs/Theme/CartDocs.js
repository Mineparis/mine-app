import React from "react";

import Cart from "../../Cart";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

const CartDocs = () => {
  return (
    <div id="cart" className="docs-item element">
      <h5 className="text-uppercase mb-4">Cart</h5>
      <div className="docs-desc">
        <p className="lead">
          A responsive cart component used in cart overview or final order
          review. On smaller displays, items reposition for a mobile-friendly
          view.
        </p>
      </div>
      <div className="mt-5">
        <Cart />
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

export default CartDocs;

const highlightCode = `import Cart from "./Cart";

const Component = () => {
    return(
        <Cart />
    )
}

export default Component`;

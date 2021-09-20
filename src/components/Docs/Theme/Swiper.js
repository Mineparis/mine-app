import React from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

import SwiperBrands from "../../SwiperBrands";
import data from "../../../data/index-3.json";
const Swiper = () => {
  return (
    <div id="swiper" className="docs-item element">
      <h5 className="text-uppercase mb-4">React ID Swiper</h5>
      <div className="docs-desc">
        <p className="lead">
          Touch enabled React plugin that lets you create a beautiful responsive
          carousel sliders.
        </p>
        <p>
          Used for the homepage carousel and for the brands carousels. You can
          use Swiper templates included in this template or import and customize
          on your own using docs for this plugin.
        </p>
        <p>
          <a
            href="https://github.com/kidjp85/react-id-swiper#readme"
            className="btn btn-outline-dark btn-sm"
          >
            Visit plugin website
          </a>
        </p>
      </div>
      <div className="mt-5">
        <h6>Brands Swiper</h6>
        <SwiperBrands brands={data.brands} className="mt-3" />
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

export default Swiper;

const highlightCode = `import ReactIdSwiper from 'react-id-swiper'
import brandsLogos from '/brands-logos.json'

const Component = () => {

    const params = {
        containerClass: 'swiper-container brands-slider pb-5',
        slidesPerView: 4,
        spaceBetween: 15,
        loop: true,
        roundLengths: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        breakpoints: {
            1200: {
                slidesPerView: 5
            }
        }
    }
    
    return (
        <ReactIdSwiper {...params}>
            {brandsLogos.map((brand, index) =>
                <div key={index} className="h-auto d-flex align-items-center justify-content-center">
                    <img
                        src={brand.img}
                        alt={brand.title}
                        className="img-fluid w-6rem opacity-7"
                    />
                </div>
            )}
        </ReactIdSwiper>
    )
}

export default Component
`;

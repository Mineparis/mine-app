import { Button, Card, CardImgOverlay, CardImg } from "reactstrap";

import Link from "next/link";

const CardLookbook = ({ data, cardType = "big" }) => {
  let headingClass =
    cardType == "big" ? "display-3 font-weight-bold mb-4" : "display-4 mb-4";
  if (data.textColor) {
    headingClass += " " + data.textColor;
  }

  return (
    <Card className="border-0 text-white text-center">
      <CardImg src={data.image} alt={data.title} />
      <CardImgOverlay className="d-flex align-items-center">
        <div className="w-100 py-3">
          <h2 className={headingClass}>{data.title}</h2>

          <Link href="/category">
            {cardType === "big" ? (
              <Button color="light">Shop now</Button>
            ) : (
              <Button
                color="link"
                className={data.textColor ? data.textColor : "text-white"}
              >
                Shop now <i className="fa-arrow-right fa ml-2" />
              </Button>
            )}
          </Link>
        </div>
      </CardImgOverlay>
    </Card>
  );
};

export default CardLookbook;

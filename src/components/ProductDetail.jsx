import AddToCart from "./AddToCart";
import Stars from "./Stars";

const ProductDetail = ({ shopifyProduct, averageRating, comments }) => {
	const { brand, name, price, availableForSale, variantId } = shopifyProduct;
	const nbComments = comments?.length ?? 0;

	return (
		<>
			<h1 className="h5 mb-4 text-uppercase font-weight-light">{brand}</h1>
			<h1 className="h3 mb-4 font-weight-normal">{name}</h1>
			{averageRating ? (
				<div className="d-flex mb-4">
					<Stars
						stars={averageRating}
						secondColor="gray-300"
						starClass="mr-1"
						className="mr-2"
					/>
					<p>({nbComments})</p>
				</div>
			) : null}
			<div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between mb-4">
				<ul className="list-inline mb-2 mb-sm-0">
					<li className="list-inline-item h4 font-weight-light mb-0">
						{price} €
					</li>
				</ul>
			</div>

			<AddToCart shopifyVariantId={variantId} availableForSale={availableForSale} />
		</>
	);
};

export default ProductDetail;
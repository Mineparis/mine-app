import Image from "next/image";
import Link from "next/link";

const CartOverviewItem = (props) => {
	const item = props.item;

	return (
		<div className="navbar-cart-product">
			<div className="d-flex align-items-center">
				<Link href={item.link}>
					<a>
						<Image
							layout="fill"
							className="img-fluid navbar-cart-product-image"
							src={item.img}
							alt="..."
						/>
					</a>
				</Link>
				<div className="w-100">
					<a className="close text-sm mr-2" href="#">
						<i className="fa fa-times"> </i>
					</a>
					<div className="pl-3">
						<Link href={item.link}>
							<a
								className="navbar-cart-product-link"
								onClick={() => props.hideCart()}
							>
								{item.name}
							</a>
						</Link>
						<small className="d-block text-muted">Quantity: {item.items}</small>
						<strong className="d-block text-sm">
							${item.total.toFixed(2)}
						</strong>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartOverviewItem;

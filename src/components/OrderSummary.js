import React from "react";

const OrderSummary = () => {
	return (
		<div className="block mb-5">
			<div className="block-header">
				<h6 className="text-uppercase mb-0">Order Summary</h6>
			</div>
			<div className="block-body bg-light pt-1">
				<p className="text-sm">
					Shipping and additional costs are calculated based on values you have
					entered.
				</p>
				<ul className="order-summary mb-0 list-unstyled">
					<li className="order-summary-item">
						<span>Order Subtotal </span>
						<span>$390.00</span>
					</li>
					<li className="order-summary-item">
						<span>Shipping and handling</span>
						<span>$10.00</span>
					</li>
					<li className="order-summary-item">
						<span>Tax</span>
						<span>$0.00</span>
					</li>
					<li className="order-summary-item border-0">
						<span>Total</span>
						<strong className="order-summary-total">$400.00</strong>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default OrderSummary;

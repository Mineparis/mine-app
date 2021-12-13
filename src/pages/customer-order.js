import { Container, Row, Col } from "reactstrap";

import CustomerSidebar from "../components/CustomerSidebar";
// import Cart from "../components/Cart";
import Hero from "../components/Hero";

import data from "../data/customer-order.json";

export async function getStaticProps() {
	return {
		props: {
			nav: {
				light: true,
			},
			title: "Customer - Order Detail",
			loggedUser: true,
		},
	};
}

export default function CustomerOrder() {
	return (
		<>
			<Hero
				title={data.title}
				breadcrumbs={data.breadcrumbs}
				content={data.excerpt}
			/>

			<Container>
				<Row>
					<Col lg="8" xl="9">
						{/* <Cart review /> */}

						<Row className="my-5">
							<Col md="6">
								<div className="block mb-5">
									<div className="block-header">
										<h6 className="text-uppercase mb-0">Order Summary</h6>
									</div>
									<div className="block-body bg-light pt-1">
										<p className="text-sm">
											Shipping and additional costs are calculated based on
											values you have entered.
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
							</Col>
							<Col md="6">
								<div className="block-header">
									<h6 className="text-uppercase mb-0">Invoice address</h6>
								</div>
								<div className="block-body bg-light pt-1">
									<p>
										John Brown
										<br />
										13/25 New Avenue
										<br />
										New Heaven
										<br />
										45Y 73J
										<br />
										England
										<br />
										<strong>Great Britain</strong>
									</p>
								</div>
								<div className="block-header">
									<h6 className="text-uppercase mb-0">Shipping address</h6>
								</div>
								<div className="block-body bg-light pt-1">
									<p>
										John Brown
										<br />
										13/25 New Avenue
										<br />
										New Heaven
										<br />
										45Y 73J
										<br />
										England
										<br />
										<strong>Great Britain</strong>
									</p>
								</div>
							</Col>
						</Row>
					</Col>

					<CustomerSidebar />
				</Row>
			</Container>
		</>
	);
}

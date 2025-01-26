import { Container, Row, Col, Button, Badge, Table } from "reactstrap";

import CustomerSidebar from "../components/CustomerSidebar";
import Hero from "../components/Hero";

import data from "../data/customer-orders.json";
import Link from "next/link";

export async function getStaticProps() {
	return {
		props: {
			nav: {
				light: true,
			},
			title: "Customer - Orders",
			loggedUser: true,
		},
	};
}

export default function CustomerOrders() {
	return (<>
		<Hero
			title={data.subtitle}
			breadcrumbs={data.breadcrumbs}
			content={data.content}
		/>
		<Container>
			<Row>
				<Col lg="8" xl="9">
					<Table responsive borderless hover className="table-responsive-md">
						<thead className="bg-light">
							<tr>
								<th className="py-4 text-uppercase text-sm">Order #</th>
								<th className="py-4 text-uppercase text-sm">Date</th>
								<th className="py-4 text-uppercase text-sm">Total</th>
								<th className="py-4 text-uppercase text-sm">Status</th>
								<th className="py-4 text-uppercase text-sm">Action</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th className="py-4 align-middle"># 1735</th>
								<td className="py-4 align-middle">22/6/2017</td>
								<td className="py-4 align-middle">$150.00</td>
								<td className="py-4 align-middle">
									<Badge color="info" className="p-2 text-uppercase">
										Being prepared
									</Badge>
								</td>
								<td className="py-4 align-middle">
									<Link href="/customer-order" className="btn btn-outline-dark btn-sm">
										View
									</Link>
								</td>
							</tr>
							<tr>
								<th className="py-4 align-middle"># 1734</th>
								<td className="py-4 align-middle">7/5/2017</td>
								<td className="py-4 align-middle">$150.00</td>
								<td className="py-4 align-middle">
									<Badge color="warning" className="p-2 text-uppercase">
										Action needed
									</Badge>
								</td>
								<td className="py-4 align-middle">
									<Link href="/customer-order" className="btn btn-outline-dark btn-sm">
										View
									</Link>
								</td>
							</tr>
							<tr>
								<th className="py-4 align-middle"># 1730</th>
								<td className="py-4 align-middle">30/9/2016</td>
								<td className="py-4 align-middle">$150.00</td>
								<td className="py-4 align-middle">
									<Badge color="success" className="p-2 text-uppercase">
										Received
									</Badge>
								</td>
								<td className="py-4 align-middle">
									<Link href="/customer-order" className="btn btn-outline-dark btn-sm">
										View
									</Link>
								</td>
							</tr>
							<tr>
								<th className="py-4 align-middle"># 1705</th>
								<td className="py-4 align-middle">22/6/2016</td>
								<td className="py-4 align-middle">$150.00</td>
								<td className="py-4 align-middle">
									<Badge color="danger" className="p-2 text-uppercase">
										Cancelled
									</Badge>
								</td>
								<td className="py-4 align-middle">
									<Link href="/customer-order" className="btn btn-outline-dark btn-sm">
										View
									</Link>
								</td>
							</tr>
						</tbody>
					</Table>
				</Col>
				<CustomerSidebar />
			</Row>
		</Container>
	</>);
}

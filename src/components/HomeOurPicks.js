import { Container, Row, Col, Card } from "reactstrap";
import Link from "next/link";

const HomeOurPicks = () => {
	return (
		<>
			<Container className="py-6">
				<Row>
					<Col xl="8" className="mx-auto text-center mb-5">
						<h2 className="text-uppercase">Our picks for Winter 2020</h2>
						<p className="lead text-muted">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
					</Col>
				</Row>
				<Row className="align-items-md-stretch">
					<Col lg="4" className="d-flex align-items-lg-stretch">
						<div
							className="d-flex align-items-center text-white border-0 w-100 py-6 py-lg-4 text-center mb-30px mb-lg-0"
							style={{
								background:
									"center center url(img/photo/rahul-anil-214671-unsplash.jpg) no-repeat",
								backgroundSize: "cover",
							}}
						>
							<Link href="/category">
								<a className="tile-link" />
							</Link>
							<div className="w-100">
								<h1 className="text-uppercase">Men</h1>
								<p className="lead">
									Consectetur adipisicing elit sed do eiusmod tempor.
                </p>
							</div>
						</div>
					</Col>
					<Col lg="8">
						<div className="card light-overlay text-dark border-0 mb-30px">
							<img
								className="card-img"
								src="https://source.unsplash.com/featured/?black,models,fashion"
								alt="Card image"
							/>
							<Link href="/category-full">
								<a className="tile-link" />
							</Link>
							<div className="card-img-overlay d-flex align-items-center">
								<div className="text-center w-100 overlay-content">
									<h1 className="text-uppercase">Ladies</h1>
									<p className="lead">
										Consectetur adipisicing elit sed do eiusmod tempor.
                  </p>
								</div>
							</div>
						</div>
						<Row>
							<Col lg="4">
								<Card className="text-white border-0 mb-lg-0 mb-30px">
									<img
										className="card-img"
										src="img/photo/haley-phelps-62815-unsplash.jpg"
										alt="Card image"
									/>
									<Link href="/category">
										<a className="tile-link" />
									</Link>
									<div className="card-img-overlay d-flex align-items-center">
										<div className="text-center w-100">
											<h2 className="text-uppercase mb-0">Denim</h2>
										</div>
									</div>
								</Card>
							</Col>
							<Col lg="4">
								<Card className="dark-overlay text-white border-0 mb-lg-0 mb-30px">
									<img
										className="card-img"
										src="img/photo/matese-fields-233175-unsplash.jpg"
										alt="Card image"
									/>
									<Link href="/category-banner">
										<a className="tile-link" />
									</Link>
									<div className="card-img-overlay d-flex align-items-center">
										<div className="text-center w-100 overlay-content">
											<h4 className="text-uppercase mb-0">Accessories</h4>
										</div>
									</div>
								</Card>
							</Col>
							<Col lg="4">
								<Card className="text-white border-0">
									<img
										className="card-img"
										src="img/photo/brooke-cagle-195856-unsplash.jpg"
										alt="Card image"
									/>
									<Link href="/category-full">
										<a className="tile-link" />
									</Link>
									<div className="card-img-overlay d-flex align-items-center">
										<div className="text-center w-100">
											<h2 className="text-uppercase mb-0">Sales</h2>
										</div>
									</div>
								</Card>
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default HomeOurPicks;

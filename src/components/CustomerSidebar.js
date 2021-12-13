import ActiveLink from "./ActiveLink";
import { Col } from "reactstrap";
import Image from "next/image";

const CustomerSidebar = (props) => {
	return (
		<Col
			xl={props.xl ? props.xl : "3"}
			lg={props.lg ? props.lg : "4"}
			className="mb-5"
		>
			<div className="customer-sidebar card border-0">
				<div className="customer-profile">
					<a className="d-inline-block" href="#">
						<Image
							layout="fill"
							className="img-fluid rounded-circle customer-image"
							src="/img/photo/kyle-loftus-589739-unsplash-avatar.jpg"
							alt="Customer Profile Image"
						/>
					</a>
					<h5>Julie Lescaut</h5>
					<p className="text-muted text-sm mb-0">Ostrava, Czech Republic</p>
				</div>
				<nav className="list-group customer-nav">
					<ActiveLink activeClassName="active" href="/customer-orders">
						<a className="list-group-item d-flex justify-content-between align-items-center">
							<span>
								<svg className="svg-icon svg-icon-heavy mr-2">
									<use xlinkHref="/icons/orion-svg-sprite.svg#paper-bag-1">
										{" "}
									</use>
								</svg>
								Orders
							</span>
							<div className="badge badge-pill badge-dark font-weight-normal px-3">
								5
							</div>
						</a>
					</ActiveLink>
					<ActiveLink activeClassName="active" href="/customer-account">
						<a className="list-group-item d-flex justify-content-between align-items-center">
							<span>
								<svg className="svg-icon svg-icon-heavy mr-2">
									<use xlinkHref="/icons/orion-svg-sprite.svg#male-user-1">
										{" "}
									</use>
								</svg>
								Profile
							</span>
						</a>
					</ActiveLink>
					<ActiveLink activeClassName="active" href="/customer-addresses">
						<a className="list-group-item d-flex justify-content-between align-items-center">
							<span>
								<svg className="svg-icon svg-icon-heavy mr-2">
									<use xlinkHref="/icons/orion-svg-sprite.svg#navigation-map-1"></use>
								</svg>
								Addresses
							</span>
						</a>
					</ActiveLink>
					<ActiveLink activeClassName="active" href="/customer-login">
						<a className="list-group-item d-flex justify-content-between align-items-center">
							<span>
								<svg className="svg-icon svg-icon-heavy mr-2">
									<use xlinkHref="/icons/orion-svg-sprite.svg#exit-1"> </use>
								</svg>
								Log out
							</span>
						</a>
					</ActiveLink>
				</nav>
			</div>
		</Col>
	);
};

export default CustomerSidebar;

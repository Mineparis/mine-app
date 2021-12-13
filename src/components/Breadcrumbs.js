import Link from "next/link";

import { Breadcrumb, BreadcrumbItem } from "reactstrap";

const Breadcrumbs = ({ className = 'justify-content-center no-border mb-0', ...props }) => {
	const links = props.links;

	return (
		<Breadcrumb listClassName={className}>
			{links.map((item, index) => (
				<BreadcrumbItem key={index} active={item.active ? true : null}>
					{item.link ? (
						<Link href={item.link}>
							<a className={props.linkClass ? props.linkClass : "text-capitalize"}>
								{item.name}
							</a>
						</Link>
					) : (
						<span className={props.spanClass ? props.spanClass : "text-capitalize"}>
							{item.name}
						</span>
					)}
				</BreadcrumbItem>
			))}
		</Breadcrumb>
	);
};

export default Breadcrumbs;

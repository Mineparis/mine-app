import PriceSlider from "./PriceSlider";

import {
	Col,
	Collapse,
	Nav,
	Form,
	Label,
	Input,
	FormGroup,
	CustomInput,
} from "reactstrap";
const ShopSidebar = (props) => {
	// FILTERS OBJECT IS ON THE BOTTOM OF THE PAGE

	const [filterInputs, setFilterInputs] = React.useState({
		// Remove or customize on PRODUCTION - Some brands are preselected
		"clothes-brand": ["brand0", "brand1"],
		// Remove or customize on PRODUCTION - Some sizes are preselected
		size: ["size1"],
	});

	// Collapse state
	const [collapse, setCollapse] = React.useState({});
	const toggleCollapse = (name) => {
		setCollapse({ ...collapse, [name]: !collapse[name] });
	};

	// On input change func
	const onInputChange = (e) => {
		const value = e.target.id; // Input value
		const name = e.target.name; // Input name
		filterInputs[name] // If input group exists
			? filterInputs[name].some((item) => item === value) // If item exists in array > remove
				? setFilterInputs({
					...filterInputs,
					[name]: filterInputs[name].filter((x) => x !== value),
				})
				: setFilterInputs({
					...filterInputs,
					[name]: [...filterInputs[name], value],
				}) // If item doesn't exists in array > add it to input group
			: setFilterInputs({ ...filterInputs, [name]: [value] }); // If input group doesn't exists > create input group and add value
	};

	// On input radio change func
	const onRadioChange = (e) => {
		const value = e.target.id; // Input value
		const name = e.target.name; // Input name

		// Set active radio input
		setFilterInputs({ ...filterInputs, [name]: value });
	};

	return (
		(<Col lg={{ size: 4, order: 1 }} xl="3" className="sidebar">
			{/* Loop throug filters object */}
			{filters.map((filter, index) => (
				<div className="sidebar-block px-3 px-lg-0 mr-lg-4" key={index}>
					{/* COLLAPSE TOGGLE */}
					<a
						className="d-lg-none block-toggler"
						aria-expanded={collapse[filter.name]}
						onClick={() => toggleCollapse(filter.name)}
					>
						{filter.name}
					</a>
					{/* END COLLAPSE TOGGLE */}

					{/* COLLAPSE */}
					<Collapse isOpen={collapse[filter.name]} className="expand-lg">
						{/* LOOP THROUGH FILTER WITH MENU ITEMS */}
						{filter.items && (
							<Nav pills className="flex-column mt-4 mt-lg-0" tag="div">
								{filter.items.map((item) => (
									<React.Fragment key={item.name}>
										<a
											className={`nav-link d-flex justify-content-between mb-2 ${item.active ? "active" : ""
												}`}
											href="#"
										>
											<span>{item.name}</span>
											<span className="sidebar-badge">{item.count}</span>
										</a>
										<Nav pills className="flex-column ml-3" tag="div">
											{item.items.map((subitem) => (
												<a
													className="nav-link mb-2"
													href={subitem.link}
													key={subitem.name}
												>
													{subitem.name}
												</a>
											))}
										</Nav>
									</React.Fragment>
								))}
							</Nav>
						)}
						{/* END LOOP THROUGH FILTER WITH MENU ITEMS */}

						{/* FILTER USING COMPONENT */}
						{filter.component && (
							<React.Fragment>
								<h6 className="sidebar-heading d-none d-lg-block">
									{filter.subtitle}
								</h6>
								<PriceSlider />
							</React.Fragment>
						)}
						{/* END FILTER USING COMPONENT */}

						{/* IF CHECKBOX || RADIO || COLOUR */}
						{(filter.checkboxes || filter.radios || filter.colours) && (
							<React.Fragment>
								<h6 className="sidebar-heading d-none d-lg-block">
									{filter.subtitle}
								</h6>

								{/* INPUT FORM */}
								<Form className="mt-4 mt-lg-0" action="#">
									{filter.checkboxes && // IF CHECKBOXES
										filter.checkboxes.map((
											checkbox // LOOP THROUGH INPUTS
										) => (
											<FormGroup className="mb-1" key={checkbox.id}>
												<CustomInput
													type="checkbox"
													id={checkbox.id}
													name={checkbox.name}
													label={
														<React.Fragment>
															{checkbox.label} <small>({checkbox.count})</small>
														</React.Fragment>
													}
													// CHECKED - CONTROLLED INPUT
													checked={
														filterInputs[checkbox.name]
															? filterInputs[checkbox.name].includes(
																checkbox.id
															)
															: ""
													}
													onChange={(e) => onInputChange(e)}
												/>
											</FormGroup>
										))}
									{filter.radios && // IF RADIOS
										filter.radios.map((
											radio // LOOP THROUGH INPUTS
										) => (
											<FormGroup className="mb-1" key={radio.id}>
												<CustomInput
													type="radio"
													id={radio.id}
													name={radio.name}
													label={radio.label}
													// CHECKED - CONTROLLED INPUT
													checked={
														filterInputs[radio.name]
															? filterInputs[radio.name].includes(radio.id)
															: ""
													}
													onChange={(e) => onRadioChange(e)}
												/>
											</FormGroup>
										))}
									{filter.colours && ( // IF COLOURS
										(<ul className="list-inline mb-0 colours-wrapper">
											{filter.colours.map((
												colour // LOOP THROUGH INPUTS
											) => (
												<li className="list-inline-item" key={colour.id}>
													<Label
														className={`btn-colour ${filterInputs[colour.name] &&
															filterInputs[colour.name].some(
																(item) => item === colour.id
															)
															? "active"
															: ""
															}`}
														for={colour.id}
														style={{ backgroundColor: colour.hex }}
													/>
													<Input
														className="input-invisible"
														type="checkbox"
														name={colour.name}
														id={colour.id}
														// CHECKED - CONTROLLED INPUT
														checked={
															filterInputs[colour.name]
																? filterInputs[colour.name].includes(colour.id)
																: ""
														}
														onChange={(e) => onInputChange(e)}
													/>
												</li>
											))}
										</ul>)
									)}
								</Form>
							</React.Fragment>
						)}
						{/* END IF CHECKBOX || RADIO || COLOUR */}
					</Collapse>
					{/* END COLLAPSE */}
				</div>
			))}
		</Col>)
	);
};

export default ShopSidebar;

const filters = [
	{
		name: "Product Categories",
		items: [
			{
				name: "Jackets",
				count: "120",
				items: [
					{
						name: "Lorem ipsum",
						link: "#",
					},
					{
						name: "Dolor",
						link: "#",
					},
					{
						name: "Sit amet",
						link: "#",
					},
					{
						name: "Donec vitae",
						link: "#",
					},
				],
			},
			{
				name: "Jeans & chinos",
				count: "55",
				active: true,
				items: [
					{
						name: "Lorem ipsum",
						link: "#",
					},
					{
						name: "Dolor",
						link: "#",
					},
					{
						name: "Sit amet",
						link: "#",
					},
					{
						name: "Donec vitae",
						link: "#",
					},
				],
			},
			{
				name: "Accessories",
				count: "80",
				items: [
					{
						name: "Sit amet",
						link: "#",
					},
					{
						name: "Donec vitae",
						link: "#",
					},
					{
						name: "Lorem ipsum",
						link: "#",
					},
					{
						name: "Dolor",
						link: "#",
					},
				],
			},
		],
	},
	{
		name: "Filter by price",
		subtitle: "Price",
		component: <PriceSlider />,
	},
	{
		name: "Filter by brand",
		subtitle: "Brands",
		checkboxes: [
			{
				name: "clothes-brand",
				id: "brand0",
				count: "18",
				label: "Calvin Klein",
			},
			{
				name: "clothes-brand",
				id: "brand1",
				count: "30",
				label: "Levi Strauss",
			},
			{
				name: "clothes-brand",
				id: "brand2",
				count: "120",
				label: "Hugo Boss",
			},
			{
				name: "clothes-brand",
				id: "brand3",
				count: "70",
				label: "Tomi Hilfiger",
			},
			{
				name: "clothes-brand",
				id: "brand4",
				count: "110",
				label: "Tom Ford",
			},
		],
	},
	{
		name: "Filter by size",
		subtitle: "Size",
		radios: [
			{
				name: "size",
				id: "size0",
				label: "Small",
			},
			{
				name: "size",
				id: "size1",
				label: "Medium",
			},
			{
				name: "size",
				id: "size2",
				label: "Large",
			},
			{
				name: "size",
				id: "size3",
				label: "X-large",
			},
		],
	},
	{
		name: "Filter by colour",
		subtitle: "Colour",
		colours: [
			{
				name: "colour",
				id: "colour_sidebar_Blue",
				hex: "#668cb9",
			},
			{
				name: "colour",
				id: "colour_sidebar_White",
				hex: "#fff",
			},
			{
				name: "colour",
				id: "colour_sidebar_Violet",
				hex: "#8b6ea4",
			},
			{
				name: "colour",
				id: "colour_sidebar_Red",
				hex: "#dd6265",
			},
		],
	},
];

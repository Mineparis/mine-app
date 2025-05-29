import React from 'react';
import { Collapse } from 'reactstrap';
import { RichText } from '@shopify/hydrogen-react';

const Accordeon = ({ options }) => {
	const [collapse, setCollapse] = React.useState({ 0: true });

	const toggleCollapse = (e, tab) => {
		e.preventDefault();
		setCollapse({ ...collapse, [tab]: !collapse[tab] });
	};

	return (
		<div role="tablist">
			{options.map(({ title, text, isRichText = false }, index) => {
				const isCurrentCollapseOpen = collapse[index];

				return (
					<div key={title} className="block mb-3">
						<a
							className="my-3 font-weight-light text-decoration-none"
							aria-expanded={isCurrentCollapseOpen}
							onClick={(e) => toggleCollapse(e, index)}
						>
							<div className="d-flex justify-content-between">
								<strong>{title}</strong>
								<i className="fas fa-caret-down" />
							</div>
						</a>
						<Collapse isOpen={isCurrentCollapseOpen}>
							<div className="p-3">
								{isRichText
									? <RichText data={text} />
									: <div className="mb-0 ck-content" dangerouslySetInnerHTML={{ __html: text }} />
								}
							</div>
						</Collapse>
					</div>
				);
			})}
		</div>
	);
};

export default Accordeon;
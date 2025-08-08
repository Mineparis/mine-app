import React from "react";
import Breadcrumbs from "./Breadcrumbs";

const Hero = ({
	children = null,
	className = '',
	breadcrumbs,
	title,
	content,
	centerBreadcrumbs = false,
	textCenter = true,
}) => {
	const containerClasses = textCenter ? 'text-center' : '';

	return (
		<section className="py-12 bg-white">
			<div className="max-w-7xl mx-auto px-4">
				{breadcrumbs && (
					<div className={`mb-8 ${centerBreadcrumbs ? 'flex justify-center' : ''}`}>
						<Breadcrumbs 
							className="text-sm" 
							links={breadcrumbs} 
							center={centerBreadcrumbs} 
						/>
					</div>
				)}
				
				<div className={`${containerClasses} ${className}`}>
					{title && (
						<h1 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">
							{title}
						</h1>
					)}
					
					{content && (
						<div className="max-w-2xl mx-auto">
							<p className="text-lg text-neutral-600 mb-6">
								{content}
							</p>
						</div>
					)}
					
					{children}
				</div>
			</div>
		</section>
	);
};

export default Hero;

import Image from "next/image";
import React from "react";

const BackgroundImage = ({ 
	src, 
	alt = '', 
	isFullScreen = false, 
	isDarkOverlay = false, 
	overlayOpacity = 'medium',
	size = null, 
	children,
	className = '',
	...props 
}) => {
	// Overlay opacity variants
	const overlayClasses = {
		light: 'bg-black/20',
		medium: 'bg-black/40', 
		dark: 'bg-black/60',
		darker: 'bg-black/80'
	};

	// Get overlay class based on props
	const getOverlayClass = () => {
		if (isDarkOverlay) {
			return overlayClasses.darker;
		}
		return overlayClasses[overlayOpacity] || overlayClasses.medium;
	};

	// Convert Bootstrap size classes to Tailwind
	const getSizeClasses = () => {
		if (!size) return '';
		
		const sizeMap = {
			'py-1': 'py-2',
			'py-2': 'py-4', 
			'py-3': 'py-6',
			'py-4': 'py-8',
			'py-5': 'py-10',
			'py-6': 'py-12',
		};
		return sizeMap[size] || size;
	};

	if (isFullScreen) {
		return (
			<div className={`relative h-screen w-full overflow-hidden ${className}`} {...props}>
				{/* Background Image */}
				<Image 
					className="object-cover object-center" 
					src={src} 
					alt={alt} 
					fill 
					sizes="100vw"
					priority
				/>
				
				{/* Overlay */}
				<div className={`absolute inset-0 ${getOverlayClass()}`} />
				
				{/* Content Container */}
				<div className={`relative z-10 w-full h-full flex flex-col items-center justify-center text-center ${getSizeClasses()}`}>
					{children}
				</div>
			</div>
		);
	}

	return (
		<div className={`relative overflow-hidden rounded-lg min-h-[60vh] flex items-center justify-center ${className}`} {...props}>
			{/* Background Image */}
			<Image 
				className="object-cover object-center" 
				src={src} 
				alt={alt} 
				fill 
				sizes="100vw"
			/>
			
			{/* Overlay */}
			<div className={`absolute inset-0 ${getOverlayClass()}`} />
			
			{/* Content */}
			<div className={`relative z-10 text-center ${getSizeClasses()}`}>
				{children}
			</div>
		</div>
	);
};

export default BackgroundImage;

import React from "react";
import Image from "next/image";

const CustomImage = (props) => {
	if (process.env.production_type === "static") {
		return (
			<Image
				src={props.src}
				alt={props.alt}
				width={props.width}
				height={props.height}
				className={props.className}
			/>
		);
	} else {
		return <Image objectFit="contain" {...props} />;
	}
};
export default CustomImage;

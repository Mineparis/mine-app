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
                style={{
                    maxWidth: "100%",
                    height: "auto"
                }} />
        );
	} else {
		return (
            <Image
                {...props}
                style={{
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "contain"
                }} />
        );
	}
};
export default CustomImage;

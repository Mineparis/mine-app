import React, { useState } from "react";

import { Map, Marker, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

const MapComponent = (props) => {
	const [focus, setFocus] = useState(false);

	const MarkerIcon = "/svg/marker.svg";
	const icon = L.icon({
		iconUrl: MarkerIcon,
		shadowUrl: "",
		iconRetinaUrl: MarkerIcon,
		iconSize: [25, 37.5],
		popupAnchor: [0, -18],
		tooltipAnchor: [0, 19],
	});

	return (
		<Map
			center={props.center && props.center}
			zoom={props.zoom}
			scrollWheelZoom={focus}
			className={props.className}
			dragging={props.dragging}
			tap={props.tap}
			bounds={props.geoJSON ? markers : null}
			onFocus={() => setFocus(true)}
			onBlur={() => setFocus(false)}
		>
			<TileLayer url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png" />
			{props.markerPosition && (
				<Marker position={props.markerPosition} icon={icon} />
			)}
		</Map>
	);
};

export default MapComponent;

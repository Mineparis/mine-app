import React from 'react';
import { Spinner } from 'reactstrap';

const Loading = () => (
	<Spinner color="dark" role="status">
		<span className="visually-hidden">Chargement...</span>
	</Spinner>
);

export default Loading;
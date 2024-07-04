import React, { Fragment } from 'react';
import Header from './components/Header';
import FormPage  from './components/FormPage';

const InwardSpareParts = ({ history }) => {
	return(
		<Fragment>
			<Header />
			<FormPage history={history}/>
		</Fragment>
	);
}

export default InwardSpareParts;
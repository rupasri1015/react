import React, { Fragment } from 'react';

const Header = (props) => {
	return(
		<Fragment>
			<h3>{props.toWrite}</h3><br/>
		</Fragment>
	)
}
export default Header;

import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

const DialogHeader = (props) => {
	const { title, onCloseClick } = props;

	return (
		<div className={styles.title}>
			{title}
			<span
				className="float-right"
				onClick={onCloseClick}
				style={{ position: 'absolute', cursor: 'pointer', right: 20 }}
			>
				&#10005;
			</span>
		</div>
	);
};

DialogHeader.propTypes = {
	title: PropTypes.string.isRequired,

	onCloseClick: PropTypes.func.isRequired
};

export default DialogHeader;

// Policy dialog
import React from 'react';
import PropTypes from 'prop-types';
// import { useDispatch } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import styles from './styles.module.scss';

const ReturnPolicyDialog = (props) => {
	const { isOpen, title, details, cancelText, confirmText, onCloseClick, onOkClick } = props;

	return (
		<Dialog open={isOpen} onClose={onCloseClick} maxWidth="sm" fullWidth>
			<DialogTitle>{title}</DialogTitle>
			<div className={styles.divider} />
			<DialogContent>
				<div className="flex mt-3">
					<div className={styles.heading}>Policy Name: </div>
					<div className={styles.value}>{details.name}</div>
				</div>
				<div className="mt-3">
					<div className={styles.heading}>About Policy:</div>
					<div className={styles.value}>{details.description}</div>
				</div>
				<div className="flex mt-3 mb-3">
					<div className={styles.heading}>Return Expiry: </div>
					<div className={styles.value}>{details.expiry}</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

ReturnPolicyDialog.defaultProps = {
	isOpen: false
};

ReturnPolicyDialog.propTypes = {
	details: PropTypes.object.isRequired,
	isOpen: PropTypes.bool,
	title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),

	onCloseClick: PropTypes.func,
	onOkClick: PropTypes.func
};

export default ReturnPolicyDialog;

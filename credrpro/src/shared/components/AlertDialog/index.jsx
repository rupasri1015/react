import React from 'react';
import PropTypes from 'prop-types';
// import { useDispatch } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';

const AlertDialog = (props) => {
	const { isOpen, title, cancelText, confirmText, contentText, onCancelClick, onCloseClick, onOkClick } = props;

	return (
		<Dialog open={isOpen} onClose={onCloseClick} maxWidth="sm" fullWidth>
			<DialogTitle>
				{' '}
				{title}
				<span className="float-right" onClick={onCloseClick} style={{ cursor: 'pointer' }}>
					&#10005;
				</span>
			</DialogTitle>
			<DialogContent>
				<DialogContentText style={{ fontSize: '20px' }}>{contentText}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<button className="icon-btn gray" onClick={onCloseClick}>
					{cancelText}
				</button>
				<button className="icon-btn" onClick={onOkClick}>
					{confirmText}
				</button>
			</DialogActions>
		</Dialog>
	);
};

AlertDialog.defaultProps = {
	cancelText: 'Cancel',
	confirmText: 'Ok',
	isOpen: false
};

AlertDialog.propTypes = {
	isOpen: PropTypes.bool,
	title: PropTypes.string,
	cancelText: PropTypes.string,
	confirmText: PropTypes.string,
	contentText: PropTypes.string,

	onCloseClick: PropTypes.func,
	onCancelClick: PropTypes.func,
	onOkClick: PropTypes.func
};

export default AlertDialog;

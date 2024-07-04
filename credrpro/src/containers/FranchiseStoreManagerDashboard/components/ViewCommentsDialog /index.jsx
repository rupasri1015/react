// Policy dialog
import React from 'react';
import PropTypes from 'prop-types';

import DialogHeader from '../DialogHeader';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import styles from './styles.module.scss';

const ViewCommentsDialog = (props) => {
	const { isOpen, comments, onCloseClick } = props;

	const renderComments = () => {
		return <div>{comments}</div>;
	};

	return (
		<Dialog open={isOpen} onClose={onCloseClick} maxWidth="sm" fullWidth>
			<DialogTitle>
				<DialogHeader title="Comments" onCloseClick={() => onCloseClick(false)} />
			</DialogTitle>
			<div className={styles.divider} />
			<DialogContent className={styles.dialogContent}>{renderComments()}</DialogContent>
		</Dialog>
	);
};

ViewCommentsDialog.defaultProps = {
	isOpen: false,
	comments: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
};

ViewCommentsDialog.propTypes = {
	isOpen: PropTypes.bool,
	comments: PropTypes.string,

	onCloseClick: PropTypes.func
};

export default ViewCommentsDialog;

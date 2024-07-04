// Policy dialog
import React from 'react';
import PropTypes from 'prop-types';

import DialogHeader from '../DialogHeader';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import styles from './styles.module.scss';

const ViewDocsDialog = (props) => {
	const { isOpen, documentUrls, onCloseClick } = props;

	const renderDocUrls = () => {
		if (!documentUrls.length) return <span>No Documents</span>
		return documentUrls.map((item, index) => {
			const fileName = item.split('/').pop();
			return <a target="_blank" href={item} rel="noreferrer">{`${fileName}`}</a>;
		});
	};

	return (
		<Dialog open={isOpen} onClose={onCloseClick} maxWidth="sm" fullWidth>
			<DialogTitle>
				<DialogHeader title="Documents" onCloseClick={() => onCloseClick(false)} />
			</DialogTitle>
			<div className={styles.divider} />
			<DialogContent className={styles.dialogContent}>{renderDocUrls()}</DialogContent>
			<div className={styles.divider} />
			<DialogActions className={styles.dialogActions} />
		</Dialog>
	);
};

ViewDocsDialog.defaultProps = {
	isOpen: false,
};

ViewDocsDialog.propTypes = {
	isOpen: PropTypes.bool,
	documentUrls: PropTypes.array.isRequired,

	onCloseClick: PropTypes.func
};

export default ViewDocsDialog;

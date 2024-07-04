// Policy dialog
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import pullAt from 'lodash/pullAt';
import { Button } from 'reactstrap';

// import { useDispatch } from 'react-redux';

import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import DropDown from '../../../../shared/components/form/DropDown';
import FileUploadInput from '../../../../shared/components/form/UploadImgnPdf';
import FileViewer from '../FileViewer';

import { fileSizesWithinLimit } from '../../../VendorManagement/components/utils';

import styles from './styles.module.scss';

const ReturnRequestDialog = (props) => {
	const {
		isOpen,
		title,
		cancelText,
		confirmText,
		returnReasons,
		onCloseClick,
		onSaveClick
	} = props;

	const [selectedReason, setSelectedReason] = useState(null);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [warningMsg, setWarningMessage] = useState('');
	const [comments, setComments] = useState('');

	const handleFiles = (files) => {
		setWarningMessage('');

		// Calculating fresh length before state update
		const totalLength = files.length + uploadedFiles.length;

		// Restricting to 10 files
		if (totalLength > 10) {
			return setWarningMessage('Limit of files exceeded.');
		}

		// Check uploaded files size with in 10 MB
		if (fileSizesWithinLimit([...uploadedFiles, ...files], 10)) {
			setUploadedFiles([...uploadedFiles, ...files]);
		} else {
			return setWarningMessage('Files size exceeded.');
		}
	};

	const handleRemoveFile = ({ item, index }) => {
		const currentFiles = uploadedFiles;

		pullAt(currentFiles, index);

		setUploadedFiles([...currentFiles]);
	};

	const renderFiles = () => {
		if (uploadedFiles.length > 0) {
			return <FileViewer files={uploadedFiles} onRemoveClick={handleRemoveFile} />;
		}
	};

	const _onSaveClick = () => {
		const returnDetails = {
			images: uploadedFiles,
			returnReason: selectedReason ? selectedReason.label : '',
			comments
		};
		onSaveClick(returnDetails);
		setUploadedFiles([]);
		setSelectedReason(null);
		setComments('');
	};

	const _onCloseClick = () => {
		setUploadedFiles([]);
		setSelectedReason(null);
		setComments('');
		onCloseClick();
	}

	return (
		<Dialog open={isOpen} onClose={_onCloseClick} maxWidth="sm" fullWidth>
			<DialogTitle>{title}</DialogTitle>
			<div className={styles.divider} />
			<DialogContent className={styles.dialogContent}>
				<DropDown
					options={returnReasons}
					value={selectedReason}
					placeholder="Select Reason"
					onChange={setSelectedReason}
					className={styles.dropDown}
				/>
				<textarea
					className={classname('form-control', styles.commentsArea)}
					placeholder="Write comments"
					id="return-comments"
					rows="3"
					value={comments}
					maxLength="1500"
					onChange={(e) => setComments(e.target.value)}
				></textarea>

				<div className={styles.filesContainer}>
					<div className={styles.fileInputWrapper}>
						<FileUploadInput
							multiple
							nameWithoutIcon="Browse Files"
							accept="image/*, application/pdf"
							onFileChange={handleFiles}
							buttonClass={styles.browseBtn}
						/>
						<div>{`Maximum 10 files can be selected. ${uploadedFiles.length} / 10 Selected.`}</div>
						{warningMsg.length !== '' && <div className={styles.warningText}>{warningMsg}</div>}
					</div>
				</div>
				{renderFiles()}
			</DialogContent>
			<div className={styles.divider} />
			<DialogActions className={styles.dialogActions}>
				<Button type="button" className="rounded no-margin" onClick={_onCloseClick}>
					{cancelText}
				</Button>
				<Button color="success" className="rounded no-margin" type="button" onClick={_onSaveClick}>
					{confirmText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ReturnRequestDialog.defaultProps = {
	isOpen: false,
	returnReasons: [
		{
			value: 'reason1',
			label: 'Engine issues'
		},
		{
			value: 'reason2',
			label: 'Document Issues'
		},
		{
			value: 'reason3',
			label: 'Aged Inventory'
		},
		{
			value: 'reason4',
			label: 'Movement'
		},
		{
			value: 'reason5',
			label: 'With in Policy days'
		},
		{
			value: 'reason5',
			label: 'Franchise Closure'
		},
		{
			value: 'reason5',
			label: 'Custom Reasons'
		}
	]
};

ReturnRequestDialog.propTypes = {
	isOpen: PropTypes.bool,
	title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	cancelText: PropTypes.string.isRequired,
	confirmText: PropTypes.string.isRequired,

	onCloseClick: PropTypes.func,
	onSaveClick: PropTypes.func
};

export default ReturnRequestDialog;

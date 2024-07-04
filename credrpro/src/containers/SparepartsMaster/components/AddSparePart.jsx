import { Button } from 'reactstrap';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { getUserID } from '../../../core/services/rbacServices';
import { setNotification } from '../../../redux/actions/notificationAction';
import getSPMData from '../../../redux/actions/sparePartsMasterAction';
import {
	addSparePartToSPM,
	editSparePartService
} from '../../../core/services/sparePartsMasterServices';
import { validateAddSparePart } from './Validate';
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction';

const AddSparePart = (props) => {
	const filter = useSelector(state => state.sparePartsMaster.filter);
	const searchText = useSelector(state => state.sparePartsMaster.searchText);
	const pageNum = useSelector(state => state.sparePartsMaster.pageNum);
  const dispatch = useDispatch();
	const [formError, setFormError] = useState({
		nameError: false,
		sectionError: false,
		categoryError: false
	});

	const {
		popUpState,
		closePopUp,
		openPopUp,
		sparePart,
		setCategory,
		setName,
		setSection,
		resetSelections,
		edit
	} = props;

	const addNewSparePart = (payload) => {
    dispatch(showLoader());
		addSparePartToSPM(payload)
			.then(apiResponse => {
				dispatch(getSPMData({ filter, searchText, pageNum }))
				if (apiResponse.isValid && apiResponse.message === 'success!') {
					dispatch(setNotification('success', 'Data Added Successfully', ''));
					dispatch(hideLoader());
				}
				else {
					dispatch(setNotification('danger', 'Data is not added', apiResponse.message));
					dispatch(hideLoader());
				}
			})
	}

	const editSparePart = (payload, id) => {
		payload.sparePartId = id;
    dispatch(showLoader());
		editSparePartService(payload)
			.then(apiResponse => {
				dispatch(getSPMData({ filter, searchText, pageNum: 1 }))
				if (apiResponse.isValid && apiResponse.message === 'success!') {
					dispatch(setNotification('success', 'Data Edited Successfully', ''));
					dispatch(hideLoader());
			}
				else {
					dispatch(setNotification('danger', 'Data can not be edited', apiResponse.message));
					dispatch(hideLoader());
			}
			})
	}

  const handleClose = () => {
		setFormError({ nameError: false, sectionError: false, categoryError: false })
		resetSelections();
		closePopUp(false);
	};

	const handleSubmit = () => {
		const userId = getUserID()
		const payload = { 
			sparePartName: sparePart.sparePartName,
			section: sparePart.section,
			category: sparePart.category,
			userId }
		const validationResult = validateAddSparePart(payload);
		
		if(validationResult.nameError
				|| validationResult.sectionError
				|| validationResult.categoryError
		) {
			setFormError(validationResult);
		}
		else {
			closePopUp(false);
			setFormError(validationResult);
			sparePart.id ? editSparePart(payload, sparePart.id) : addNewSparePart(payload);
			handleClose()
		}
	}

  return (
    <div>
      <Button color="success" className="rounded no-margin" onClick={openPopUp}>
        Add Spare Part
      </Button>
      <Dialog
				open={popUpState}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
				maxWidth="xs"
        fullWidth
			>
        <DialogTitle id="form-dialog-title">Enter Spare Part Name</DialogTitle>
        <DialogContent>
				<div className="col-sm-12 mt-2">
					<InputLabel>Select Section</InputLabel>
					<Select
						fullWidth={ true }
						value={sparePart.section}
						onChange={(event) => setSection(event.target.value)}
						disabled={edit}
					>
						{
							Object.keys(props.sparePartList).map((section, index) => {
								return <MenuItem key={index} value={section}>{section}</MenuItem>
							})
						}
					</Select>
					{
						formError.sectionError
						? <div style={{ color: '#c00' }}>* Please Select Section</div>
						: null
					}
				</div>
				<div className="col-sm-12 mt-2">
					<InputLabel>Select Category</InputLabel>
					<Select
						fullWidth={ true }
						value={sparePart.category}
						onChange={(event) => setCategory(event.target.value)}
						disabled={edit}
					>
						{
							sparePart.section !== ''
							? Object.keys(props.sparePartList[sparePart.section]).map((cat, index) => {
								return <MenuItem key={index} value={cat}>{cat}</MenuItem>
							})
							: props.categoryList.map((cat, index) => {
								return <MenuItem key={index} value={cat.value}>{cat.value}</MenuItem>
							})
						}
					</Select>
					{
						formError.categoryError
						? <div style={{ color: '#c00' }}>* Please Select Category</div>
						: null
					}
				</div>
				<div className="col-sm-12 mt-2">
          <TextField
						value={sparePart.sparePartName}
            autoFocus
            margin="dense"
            id="sparePartName"
            label="Spare Part Name"
						fullWidth
						onChange={(event) => setName(event.target.value)}
          />
					{
						formError.nameError
						? <div style={{ color: '#c00' }}>* Please Enter Spare Part Name</div>
						: null
					}
				</div>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" className="rounded no-margin">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="success" className="rounded no-margin">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddSparePart
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { getMMVListService, editMMV } from '../../../core/services/MMVManagementServices';
import { addToMMV } from '../../../core/services/MMVManagementServices';
import { setNotification } from '../../../redux/actions/notificationAction';
import getAllMMVs from '../../../redux/actions/MMVManagementAction';
import { validateMMV } from './Validate';
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction';

const yearArr = Array.from(Array(25).keys()).map(val => {
	if(val === 0) {
		return 'None'
	} else {
		return (val+1999).toString()
	}
});

const getMMVArray = (allMMVList, allMMVIds) => {
	let mmvArray = [];
	for (let i = 0; i < allMMVList.length; i++) {
		mmvArray.push({"mmvId": allMMVIds[i], title: allMMVList[i]})
	}
	return mmvArray;
}

const AddNewMMV = (props) => {
	const dispatch = useDispatch();
	const [allMMVData, setAllMMVData] = useState({});
  const [localOpen, setLocalOpen] = useState(false);
  const [open, setOpen] = useState(false);
	const [selectedMMV, setSelectedMMV] = useState(null);
	const [fromYear, setFromYear] = useState(yearArr[0]);
	const [toYear, setToYear] = useState(yearArr[0]);
	const [formError, setFormError] = useState({
		nameError: false,
		toError: false,
		fromError: false
	});
	const pageNum = useSelector(state => state.mmvManagement.pageNum);
	const filter = useSelector(state => state.mmvManagement.filter);
	const searchText = useSelector(state => state.mmvManagement.searchText);
	
	const allMMVList = Object.values(allMMVData);
	const allMMVIds = Object.keys(allMMVData);
	const mmvs = getMMVArray(allMMVList, allMMVIds);

	useEffect(() => {
		setFromYear( props.data ? props.data.fromYear : yearArr[0]);
		setToYear( props.data ? props.data.toYear : yearArr[0]);
		setSelectedMMV( props.data || null);
		setOpen(props.open || false);
		getMMVListService()
			.then(apiResponse => {
				if (apiResponse.isValid) {
					setAllMMVData(apiResponse.data);
				}
			})
	}, [open])

	const closePopUp = () => {
		setLocalOpen(false);
		setSelectedMMV(null);
		setFromYear('None');
		setToYear('None');
		setFormError({
			nameError: false,
			toError: false,
			fromError: false
		});
		if(props.closePopUp) {
			props.closePopUp();
		}
  }

  const openPopUp = () => {
    setLocalOpen(true);
	}

	const handleEditMMV = () => {
		const mmvId = Object.keys(allMMVData).find(key => allMMVData[key] === selectedMMV.title);
		const mmvYearsId = props.data.id;
    dispatch(showLoader());
		editMMV({ mmvId, mmvYearsId, toYear, fromYear })
			.then(apiResponse => {
				if (apiResponse.isValid) {
					dispatch(setNotification('success', 'Data Edited Successfully', ''));
					dispatch(getAllMMVs({ pageNum:1, filter, searchText }));
					dispatch(hideLoader());
				}
				else {
					dispatch(setNotification('danger', 'Data is not added', apiResponse.message));
					dispatch(hideLoader());
				}
			}
		)
	}

	const handleAddMMV = () => {
		const payload = { "mmvId": selectedMMV.mmvId, "toYear": toYear, "fromYear": fromYear };
    dispatch(showLoader());
		addToMMV(payload)
			.then(apiResponse => {
				if (apiResponse.isValid) {
					setSelectedMMV(null);
					setFromYear('None');
					setToYear('None');
					dispatch(setNotification('success', 'Data Added Successfully', ''));
					dispatch(getAllMMVs({ pageNum, filter, searchText }));
					dispatch(hideLoader());
				}
				else {
					dispatch(setNotification('danger', 'Data is not added', apiResponse.message));
					dispatch(hideLoader());
				}
			}
		)
	}
	
	const handleSubmit = () => {
		const validationResult = validateMMV(selectedMMV, fromYear, toYear);
		if(validationResult.nameError
				|| validationResult.fromError
				|| validationResult.toError
				|| validationResult.rangeError
		) {
			setFormError(validationResult);
		}
		else {
			props.shouldEdit ? handleEditMMV() : handleAddMMV();
			setFormError(validationResult);
			closePopUp();
			if(props.closePopUp) {
				props.closePopUp();
			}
		}
	}

	return(
		<div>
			{
				props.button
				?	<props.button style={{ marginBottom: '1em' }} color="success" className="rounded no-margin" onClick={openPopUp}>
						Add New MMV
					</props.button>
				: null
			}
			
      <Dialog
				open={open || localOpen}
				onClose={closePopUp}
				aria-labelledby="form-dialog-title"
				maxWidth="xs"
        fullWidth
			>
        <DialogTitle id="form-dialog-title">Enter Make Model Variant and Year Range</DialogTitle>
        <DialogContent>
					<Autocomplete
						id="mmv-selection"
						options={mmvs}
						value={selectedMMV}
						getOptionLabel={(option) => option.title}
						onChange={(event, value) => setSelectedMMV(value)}
						renderInput={(params) => 
							<TextField 
								style={{ width: '400px' }}
								{...params}
								label="Please Select MMV"
								variant="outlined"
							/>
						}
					/>
					{
						formError.nameError
						? <div style={{ color: '#c00' }}>* Please Select an MMV</div>
						: null
					}
					<br/>
					<div style={{ display: 'flex', flexDirection: 'row', padding: '0' }}>
						<div className="col-sm-6 mt-2" style={{ paddingLeft: '0' }}>
							<InputLabel>Select From Year</InputLabel>
							<Select
								fullWidth={ true }
								value={fromYear}
								onChange={(event) => setFromYear(event.target.value)}
								variant="outlined"
								placeholder="Seclect From Year"
							>
								{
									yearArr.map((year, index) => {
									return <MenuItem key={index} value={year}>{year}</MenuItem>
									})
								}
							</Select>
							{
								formError.fromError
								? <div style={{ color: '#c00' }}>* Please Select "From Year"</div>
								: null
							}
						</div>
						
						<div className="col-sm-6 mt-2" style={{ paddingRight: '0' }}>
							<InputLabel>Select To Year</InputLabel>
							<Select
								fullWidth={ true }
								value={toYear}
								onChange={(event) => setToYear(event.target.value)}
								variant="outlined"
								placeholder="Seclect To Year"
							>
								{
									yearArr.map((year, index) => {
									return <MenuItem key={index} value={year}>{year}</MenuItem>
									})
								}
							</Select>
							{
								formError.toError
								? <div style={{ color: '#c00' }}>* Please Select "To Year"</div>
								: null
							}
						</div>
					</div>
					{
						formError.rangeError
						? <div style={{ color: '#c00' }}>* "From Year" can not be greater than "To Year"</div>
						: null
					}
				</DialogContent>
				<DialogActions>
					<Button onClick={closePopUp} color="secondary" className="rounded no-margin">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="success" className="rounded no-margin">
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
export default AddNewMMV
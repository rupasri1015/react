import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody } from 'reactstrap'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { setNotification } from '../../../redux/actions/notificationAction'
import { DownloadIcon } from '../../../core/utility/iconHelper'
import { getSparePartsAssignmentData } from '../../../redux/actions/sparePartsAssignmentAction'
import { downloadData } from '../../../core/services/sparePartsAssignmentServices'

const StatusButton = () => {
	const dispatch = useDispatch();

	const [buttonStatus, setButtonStatus] = useState({
		all: true,
		pending: false,
		partial: false,
		completed: false,
		overdue: false,
	});

	const fromDate = useSelector(state => state.sparePartsAssignment.fromDate);
	const toDate = useSelector(state => state.sparePartsAssignment.toDate);
	const serviceCenterName = useSelector(state => state.sparePartsAssignment.serviceCenterName);
	const warehouseName = useSelector(state => state.sparePartsAssignment.warehouseName);
	const searchText = useSelector(state => state.sparePartsAssignment.searchText);
	const tabs = useSelector(state => state.sparePartsAssignment.tabs);

	const buttonSelected = 'btn-outline blue selected';
	const buttonNotSelected = 'btn-outline blue';

	const handleClick = (buttonName) => {
		let tempButtonstatus = JSON.parse(JSON.stringify(buttonStatus));
		Object.keys(tempButtonstatus).forEach(val => tempButtonstatus[val] = false);
		tempButtonstatus[buttonName] = true;
		setButtonStatus(tempButtonstatus);
		dispatch(getSparePartsAssignmentData({
			pageNumber: 1,
			fromDate,
			toDate,
			serviceCenterName,
			warehouseName,
			searchText,
			status: buttonName
		}));
	}

	// const handleDownload = () => {
	// 	const keys = Object.keys(buttonStatus);
	// 	const status = keys.filter(function(key) { return buttonStatus[key] });
	// 	const payload = { status: status[0], serviceCenterName, warehouseName }
	// 	dispatch(showLoader());
	// 	downloadData(payload)
    //   .then(apiResponse => {
    //     if (apiResponse.isValid) {
    //       window.location.href = apiResponse.data;
    //     } else {
    //       dispatch(setNotification('danger', 'Error', apiResponse.message))
    //     }
    //     dispatch(hideLoader())
    //   })
	// }

	return (
		<Card className="pending-inventory-header">
			<CardBody className="card-shadow square-border">
				<button
					onClick={() => handleClick('all')}
					className={buttonStatus.all ? buttonSelected: buttonNotSelected}
				>
						All ({tabs? tabs.All : null})
				</button>
				<button
					onClick={() => handleClick('pending')}
					className={buttonStatus.pending ? buttonSelected: buttonNotSelected}
				>
						Pending ({tabs? tabs.Pending : null})
				</button>
				<button
					onClick={() => handleClick('partial')}
					className={buttonStatus.partial ? buttonSelected: buttonNotSelected}
				>
						Partial ({tabs? tabs.Partial : null})
				</button>
				<button
					onClick={() => handleClick('completed')}
					className={buttonStatus.completed ? buttonSelected: buttonNotSelected}
				>
						Completed ({tabs? tabs.Completed : null})
				</button>
				<button
					onClick={() => handleClick('overdue')}
					className={buttonStatus.overdue ? buttonSelected: buttonNotSelected}
				>
						Overdue
				</button>
				{/* <button className="icon-btn float-right" onClick={handleDownload}>
          <img src={DownloadIcon} className="btn-icon" alt="Download" />
          Download Data
        </button> */}
			</CardBody>
		</Card>
	)
}

export default StatusButton;

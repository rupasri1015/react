import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody } from 'reactstrap'
import getPaymentSPMData from '../../../redux/actions/paymentSPMAction'
import { DownloadIcon } from '../../../core/utility/iconHelper'
import { downloadData } from '../../../core/services/paymentSPMServices';
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction';
import { setNotification } from '../../../redux/actions/notificationAction';

const StatusButton = () => {
	const dispatch = useDispatch();

	const [buttonStatus, setButtonStatus] = useState({
		all: true,
		pending: false,
		overdue: false,
		completed: false,
	});

	const fromDate = useSelector(state => state.paymentSPM.fromDate);
	const toDate = useSelector(state => state.paymentSPM.toDate);
	const warehouseId = useSelector(state => state.paymentSPM.warehouseId);
	const warehouseName = useSelector(state => state.paymentSPM.warehouseName);
	const searchText = useSelector(state => state.paymentSPM.searchText);
	const tabs = useSelector(state => state.paymentSPM.tabs);

	const buttonSelected = 'btn-outline blue selected';
	const buttonNotSelected = 'btn-outline blue';

	const handleClick = (buttonName) => {
		let tempButtonstatus = JSON.parse(JSON.stringify(buttonStatus));
		Object.keys(tempButtonstatus).forEach(val => tempButtonstatus[val] = false);
		tempButtonstatus[buttonName] = true;
		setButtonStatus(tempButtonstatus);
		dispatch(getPaymentSPMData({
			pageNumber: 1,
			fromDate,
			toDate,
			warehouseName,
			warehouseId,
			searchText,
			status: buttonName
		}));
	}
	
	// const handleDownload = () => {
	// 	const keys = Object.keys(buttonStatus);
	// 	const status = keys.filter(function(key) { return buttonStatus[key] });
	// 	dispatch(showLoader());
	// 	downloadData({
	// 		pageNumber: 1,
	// 		fromDate,
	// 		toDate,
	// 		warehouseName,
	// 		warehouseId,
	// 		searchText,
	// 		status: status[0]
	// 	})
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
					onClick={() => handleClick('overdue')}
					className={buttonStatus.overdue ? buttonSelected: buttonNotSelected}
				>
						Overdue ({tabs? tabs.OverDue : null})
				</button>
				<button 
					onClick={() => handleClick('completed')}
					className={buttonStatus.completed ? buttonSelected: buttonNotSelected}
				>
						Completed ({tabs? tabs.Completed : null})
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

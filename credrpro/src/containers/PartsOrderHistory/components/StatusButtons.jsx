import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody } from 'reactstrap'
import getPartsOrderHistoryData from '../../../redux/actions/partsOrderHistoryAction'

const StatusButton = () => {
	const dispatch = useDispatch();

	const [buttonStatus, setButtonStatus] = useState({
		all: true,
		new: false,
		inprogress: false,
		notbilled: false,
		fulfilled: false,
		discarded: false,
	});

	const fromDate = useSelector(state => state.partsOrderHistory.fromDate);
	const toDate = useSelector(state => state.partsOrderHistory.toDate);
	const runnerId = useSelector(state => state.partsOrderHistory.runnerId);
	const warehouseId = useSelector(state => state.partsOrderHistory.warehouseId);
	const warehouseName = useSelector(state => state.partsOrderHistory.warehouseName);
	const searchText = useSelector(state => state.partsOrderHistory.searchText);
	const tabs = useSelector(state => state.partsOrderHistory.tabs);

	const buttonSelected = 'btn-outline blue selected';
	const buttonNotSelected = 'btn-outline blue';

	const handleClick = (buttonName) => {
		let tempButtonstatus = JSON.parse(JSON.stringify(buttonStatus));
		Object.keys(tempButtonstatus).forEach(val => tempButtonstatus[val] = false);
		tempButtonstatus[buttonName] = true;
		setButtonStatus(tempButtonstatus);
		dispatch(getPartsOrderHistoryData({
			pageNumber: 1,
			fromDate,
			toDate,
			warehouseName,
			warehouseId,
			runnerId,
			searchText,
			status: buttonName
		}));
	}

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
					onClick={() => handleClick('New')}
					className={buttonStatus.New ? buttonSelected: buttonNotSelected}
				>
						New ({tabs? tabs.New : null})
				</button>
				<button 
					onClick={() => handleClick('inprogress')}
					className={buttonStatus.inprogress ? buttonSelected: buttonNotSelected}
				>
						In-Progress ({tabs? tabs.InProgress : null})
				</button>
				<button 
					onClick={() => handleClick('notbilled')}
					className={buttonStatus.notbilled ? buttonSelected: buttonNotSelected}
				>
						Fulfilled - No Bill ({tabs? tabs.NotBilled : null})
				</button>
				<button 
					onClick={() => handleClick('fulfilled')}
					className={buttonStatus.fulfilled ? buttonSelected: buttonNotSelected}
				>
						Fulfilled ({tabs? tabs.Fulfilled : null})
				</button>
				<button 
					onClick={() => handleClick('discarded')}
					className={buttonStatus.discarded ? buttonSelected: buttonNotSelected}
				>
						Discarded ({tabs? tabs.Discarded : null})
				</button>
			</CardBody>
		</Card>
	)
}

export default StatusButton;

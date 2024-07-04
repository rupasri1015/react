import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody } from 'reactstrap'
import getPartsRequirementData from '../../../redux/actions/partsRequirementAction'
import { unselectAll, setAggregateData } from '../../../redux/actions/partRequirementTableAction'
import { Button } from 'reactstrap'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction';
import { setNotification } from '../../../redux/actions/notificationAction';
import { aggregateOrder } from '../../../core/services/partsRequirementServices'
import { PERMISSIONS, getRole } from '../../../core/services/rbacServices';

const StatusButton = (props) => {
	const dispatch = useDispatch();

	const [buttonStatus, setButtonStatus] = useState({
		all: true,
		assigned: false,
		partial: false,
		closed: false,
		procuring: false,
		open: false
	});

	const fromDate = useSelector(state => state.partsRequirement.fromDate);
	const toDate = useSelector(state => state.partsRequirement.toDate);
	const warehouseId = useSelector(state => state.partsRequirement.warehouseId);
	const warehouseName = useSelector(state => state.partsRequirement.warehouseName);
	const searchText = useSelector(state => state.partsRequirement.searchText);
	const tabs = useSelector(state => state.partsRequirement.tabs);
	const selectedCheckBoxes = useSelector(state => state.tableCheckBox);

	const buttonSelected = 'btn-outline blue selected';
	const buttonNotSelected = 'btn-outline blue';

	const handleClick = (buttonName) => {
		let tempButtonstatus = JSON.parse(JSON.stringify(buttonStatus));
		Object.keys(tempButtonstatus).forEach(val => tempButtonstatus[val] = false);
		tempButtonstatus[buttonName] = true;
		setButtonStatus(tempButtonstatus);
		dispatch(unselectAll({pageNumber: 0}));
		dispatch(getPartsRequirementData({
			pageNumber: 1,
			fromDate,
			toDate,
			warehouseName,
			warehouseId,
			searchText,
			status: buttonName
		}));
	}

	const createOrderIdList = () => {
		const prArr = [];
		Object.values(selectedCheckBoxes).map(val => val.map(v => prArr.push(v)));
		return prArr;
	}

	const orderIdListLength = () => {
		const arr = createOrderIdList();
		return arr.length;
	}

	const handleCreateOrder = () => {
		const ids = createOrderIdList();
		dispatch(showLoader());
		aggregateOrder({ warehouseId, ids })
		.then(apiResponse => {
			if (apiResponse.isValid) {
				dispatch(setAggregateData({
					aggregateData: apiResponse.data.map((d) => {
						d.estimatedUnitPrice = '';
						return d;
					})
				}));
				dispatch(hideLoader());
				props.history.push('/partsRequirement/createOrder');
			}
			else {
				dispatch(setNotification('danger', 'Error in aggregation', apiResponse.message));
				dispatch(hideLoader());
			}
		})
	}

	const dummyClick = () => {}

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
					onClick={() => handleClick('open')}
					className={buttonStatus.open ? buttonSelected: buttonNotSelected}
				>
						Open ({tabs? tabs.Open : null})
				</button>
				<button 
					onClick={() => handleClick('assigned')}
					className={buttonStatus.assigned ? buttonSelected: buttonNotSelected}
				>
						Assigned ({tabs? tabs.Assigned : null})
				</button>
				<button 
					onClick={() => handleClick('procuring')}
					className={buttonStatus.procuring ? buttonSelected: buttonNotSelected}
				>
						Procuring ({tabs? tabs.Procuring : null})
				</button>
				<button 
					onClick={() => handleClick('partial')}
					className={buttonStatus.partial ? buttonSelected: buttonNotSelected}
				>
						Partial ({tabs? tabs.Partial : null})
				</button>
				<button 
					onClick={() => handleClick('closed')}
					className={buttonStatus.closed ? buttonSelected: buttonNotSelected}
				>
						Closed ({tabs? tabs.Closed : null})
				</button>
				{
					PERMISSIONS.PARTS_REQUIREMENT.includes(getRole())
					?
					<Button
						className="rounded no-margin"
						type="button"
						style={{ float: 'right'}}
						color={orderIdListLength() === 0 ? 'secondary' : 'success'}
						onClick={ orderIdListLength() === 0 ? dummyClick : handleCreateOrder}
					>
						Create Order and Assign to Runner
					</Button>
					: null
				}
				
			</CardBody>
		</Card>
	)
}

export default StatusButton;

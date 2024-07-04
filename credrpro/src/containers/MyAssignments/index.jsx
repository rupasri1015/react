import React, {  Fragment, useEffect, useState  } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'reactstrap'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { showLoader, hideLoader } from '../../redux/actions/loaderAction';
import Select from 'react-select';
import { getUserID, getRole, getUserName } from '../../core/services/rbacServices';
import Header from './components/Header'
import { setNotification } from '../../redux/actions/notificationAction';
import { getRunnerList } from '../../core/services/partsRequirementServices';
import { parseForDropDown } from '../LiveInventoryUnit/components/forms/utils';
import { getRepairRequestId } from '../SparePartsAssignment/components/form/utils'
import {
	getAllAssignmentForRunner,
	startRun,
	cancelRun
} from '../../core/services/myAssignmentsServices';
import {
	getOrderDetails,
	updatePartsOrder
} from '../../core/services/partsOrderHistoryServices';
import MyAssignmentTable from './components/MyAssignmentTable';
import { isPositiveInt } from '../LiveInventoryUnit/components/forms/utils';
import { getAllWarehouses } from '../../core/services/liveInventoryUnitServices'
import { getWarehouseID, getWarehouseName } from '../../core/services/rbacServices';

const paymentOptionDropdown = [
	{value: 'Cash', label: 'Cash'},
	{value: 'Credit', label: 'Credit'}
]

const MyAssignments = (props) => {
	const dispatch = useDispatch();
	const [warehouseList, setWarehouseList] = useState([]);
	const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [runnerList, setRunnerList] = useState([]);
	const [runner, setRunner] = useState('');
	const [idVendorStatus, setIdVendorStatus] = useState('');
	const [idVendorStatusList, setIdVendorStatusList] = useState([]);
	const [paymentOption, setPaymentOption] = useState('');
	const [tableData, setTableData] = useState({});
	const [shouldUpdate, setShouldUpdate] = useState(true);
  const [popUpOpen, setPopUpOpen] = useState(false);
	const [orderIdAvailable, setOrderIdAvailable] = useState(false);

	useEffect(() => {
		dispatch(showLoader());
		
		const orderId = getRepairRequestId(window.location.href);
		if(!props.match.isExact) {
			dispatch(showLoader());
			getOrderDetails(orderId)
			.then(apiResponse => {
				if(apiResponse.isValid) {
					dispatch(hideLoader());
					const tempTableData = setEstimatedPrices(apiResponse.data);
					setTableData(tempTableData);
					setShouldUpdate(true);
					tempTableData.paymentMethod === 'none' || tempTableData.paymentMethod === 'Credit'
					? setPaymentOption({value: 'Credit', label: 'Credit'})
					: setPaymentOption({value: 'Cash', label: 'Cash'})
					setOrderIdAvailable(true)
				}
				else {
					dispatch(setNotification('danger', 'Order details not loaded', apiResponse.message));
					dispatch(hideLoader());
				}
			})
		} else {
			const userWarehouseId = getWarehouseID();
			if(userWarehouseId === 0){
				setSelectedWarehouse({value: 0, label: 'Select Warehouses'});
				getAllWarehouses()
				.then(apiResponse => {
					if (apiResponse.isValid) {
					dispatch(hideLoader());
					setWarehouseList(parseForDropDown(apiResponse.data));
					}
				})
			} else {
					dispatch(hideLoader());
					handleSelectWarehouse({value: userWarehouseId, label: getWarehouseName()});
					if(getRole() === 'SPARE_PARTS_RUNNER') {
						handleSelectRunner({ value: getUserID(), label: getUserName() });
					}

				}
		}
	}, []);

	const getIdVendorStatusList = (allOrders) => {
		return allOrders.map((order) => {
			return(
				{
					label: order.orderId + ' - ' + order.vendorName + ' - ' + order.status,
					value: order.orderId
				}
			)
		});
	}

	const handleSelectWarehouse = (val) => {
		dispatch(showLoader());
		getRunnerList(val.value)
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setRunnerList( getRole() !== 'SPARE_PARTS_RUNNER'
					? parseForDropDown(apiResponse.runners)
					: []
				);
				dispatch(hideLoader());
			} else {
				dispatch(setNotification('danger', 'runner list not loaded', apiResponse.message));
				dispatch(hideLoader());
			}
		});
		setSelectedWarehouse(val);
		setRunner('');
		setIdVendorStatus('');
		setTableData({});
	}

	const handleSelectRunner = (val) => {
    dispatch(showLoader());
		getAllAssignmentForRunner(val.value)
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setRunner(val);
				dispatch(hideLoader());
				setIdVendorStatusList(getIdVendorStatusList(apiResponse.data || []));
				setShouldUpdate(true);
				setIdVendorStatus('');
				setTableData({});
			} else {
				dispatch(setNotification('danger', 'Assignments not loaded', apiResponse.message));
				dispatch(hideLoader());
			}
		})
	}

	const setEstimatedPrices = (data) => {
		const tempTableData = JSON.parse(JSON.stringify(data));
		const priceArr = tempTableData.items.map((item, index) => {
			const price = item.estimatedUnitPrice * item.requestedQuantity
			tempTableData.items[index]['estimatedTotalPrice'] = price;
			return price;
		})
		if(tempTableData.paymentMethod === 'none') {
			tempTableData['paymentMethod'] = 'Credit';
			tempTableData['givenAmount'] = priceArr.reduce((a, b) => a + b);
		}
		tempTableData['estimatedAmount'] = priceArr.reduce((a, b) => a + b);
		return tempTableData;
	}

	const handleIdVendorStatus = (val) =>{
		setIdVendorStatus(val)
		dispatch(showLoader());
		getOrderDetails(val.value)
		.then(apiResponse => {
			if(apiResponse.isValid) {
				dispatch(hideLoader());
				const tempTableData = setEstimatedPrices(apiResponse.data);
				setTableData(tempTableData);
				setShouldUpdate(true);
				tempTableData.paymentMethod === 'none' || tempTableData.paymentMethod === 'Credit'
				? setPaymentOption({value: 'Credit', label: 'Credit'})
				: setPaymentOption({value: 'Cash', label: 'Cash'})
			}
			else {
				dispatch(setNotification('danger', 'Order details not loaded', apiResponse.message));
				dispatch(hideLoader());
			}
		})
	}

	const handleSetGivenAmount = (val) => {
    let tempTableData = JSON.parse(JSON.stringify(tableData));
    if(isPositiveInt(val) || val === '') {
			tempTableData.givenAmount = val;
			setShouldUpdate(true);
			setTableData(tempTableData);
		}
	}
	
	const handlePaymentOption = (val) => {
    let tempTableData = JSON.parse(JSON.stringify(tableData));
		tempTableData['paymentMethod'] = val.value;
		setTableData(tempTableData);
		setPaymentOption(val);
		setShouldUpdate(true);
	}

	const handleUpdateOrder = () => {
		const userId = getUserID();
		const {
			givenAmount,
			orderId,
			paymentMethod,
			runnerId,
			runnerName,
			runnerMobile,
			vendorId,
			vendorName
		} = tableData;
		let payload = {
			givenAmount: paymentMethod === 'Credit' ? 0 : givenAmount,
			orderId,
			paymentMethod,
			runnerId,
			runnerMobile,
			runnerName,
			userId,
			vendorId,
			vendorName		
		};
		
		dispatch(showLoader());
    updatePartsOrder(payload)
		.then(apiResponse => {
			if (apiResponse.isValid) {
        dispatch(hideLoader());
				dispatch(setNotification('success', 'Order Updated Successfully', ''));
        setShouldUpdate(false);
			} else {
				dispatch(hideLoader());
				dispatch(setNotification('danger', 'Order not updated', apiResponse.message));
			}
		})
	}

	const isAllFilled = () => {
		return(
			Boolean((tableData.vendorId
				&& tableData.vendorId
				&& tableData.paymentMethod
				&& tableData.givenAmount
				&& tableData.givenAmount !== 0
				&& tableData.givenAmount !== '0'
				&& tableData.givenAmount !== '')
				|| tableData.paymentMethod === 'Credit'
			)
		)
	}

	const handleStartRun = () => {
		const {
			orderId,
			runnerId,
			runnerMobile,
			runnerName,
		} = tableData;
		const payload = { orderId, runnerId, runnerMobile, runnerName };

		dispatch(showLoader());
    startRun(payload)
		.then(apiResponse => {
			if (apiResponse.isValid) {
        dispatch(hideLoader());
				dispatch(setNotification('success', 'Run Started Successfully', ''));
				window.location.reload();
			} else {
				dispatch(hideLoader());
				dispatch(setNotification('danger', 'Run Not Started', apiResponse.message));
			}
		})
	}

	const handlePopUpOpen = () => {
    setPopUpOpen(true);
  }

  const handlePopUpClose = () => {
    setPopUpOpen(false);
	}
	
	const handleCancelRun = () => {
    setPopUpOpen(false);
    dispatch(showLoader());
    cancelRun(tableData.orderId)
		.then(apiResponse => {
			if (apiResponse.isValid) {
        dispatch(hideLoader());
				dispatch(setNotification('success', 'Run Cancelled Successfully', ''));
				window.location.reload();
			} else {
				dispatch(hideLoader());
				dispatch(setNotification('danger', 'Order Not Cancelled', apiResponse.message));
			}
		})
	}

	const dummyClick = () => {};

	return(
		<Fragment>
			<Dialog
        open={popUpOpen}
        onClose={handlePopUpClose}
        aria-labelledby="form-dialog-title"
        maxWidth="xs"
        fullWidth
			>
        <DialogTitle id="form-dialog-title">
          Are you sure that you want to cancel the run ?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handlePopUpClose} color="secondary" className="rounded no-margin">
            No
          </Button>
          <Button onClick={handleCancelRun} color="danger" className="rounded no-margin">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
			<Header toWrite='My Assignments'/>
			<div style={{ display: 'flex', flexDirection: 'row', marginBottom: '1em' }}> 
				<div style={{ width: '20%', marginRight: '0.5em'}}>
					{
						orderIdAvailable
						?
						<div
							style={{ border: '1px solid gray', fontWeight: 'bold', padding: '0.5em' }}
						>
							Warehouse: {tableData.warehouseName}
						</div>
						:
						<Select
							options={warehouseList}
							classNamePrefix="city-dropdown"
							placeholder="Select warehouse"
							onChange={(val) => handleSelectWarehouse(val)}
							value={selectedWarehouse}
						/>
					}
				</div>
				<div style={{ width: '20%', marginRight: '0.5em'}}>
					{
						orderIdAvailable
						?
						<div
							style={{ border: '1px solid gray', fontWeight: 'bold', padding: '0.5em' }}
						>
							Runner: {tableData.runnerName}
						</div>
						:
						<Select
							options={runnerList}
							classNamePrefix="city-dropdown"
							placeholder="Select Runner Name"
							onChange={(val) => handleSelectRunner(val)}
							value={runner}
						/>
					}
				</div>
				<div style={{ width: '40%', marginRight: '0.5em'}}>
					{
						orderIdAvailable
						?
						<div
							style={{ border: '1px solid gray', fontWeight: 'bold', padding: '0.5em' }}
						>
							{tableData.orderId + ' - ' + tableData.vendorName + ' - ' + tableData.status}
						</div>
						:
						<Select
							options={idVendorStatusList}
							classNamePrefix="city-dropdown"
							placeholder="Order Id - Vendor - Status"
							onChange={(val) => handleIdVendorStatus(val)}
							value={idVendorStatus}
						/>
					}
					
				</div>
				<div style={{ width: '19%'}}>
					<Select
						options={ tableData.status !== 'New' ? [] : paymentOptionDropdown}
						classNamePrefix="city-dropdown"
						placeholder="Payment Method"
						onChange={val => handlePaymentOption(val)}
						value={paymentOption}
					/>
				</div>
			</div>
			<h5>Order Date: {tableData.orderDate}</h5>
			<br/>
			<MyAssignmentTable tableData={tableData}/>
			<br/>
			{
				tableData.items && tableData.items.length > 0
				?
				<Fragment>
					<h4>
						Estimated amount to procure items (calculated): Rs. {tableData.estimatedAmount}.00
						<br/><br/>
						{
							tableData.paymentMethod === 'Cash'
							?
							<>
								<span> Cash Given: </span>
								<input
									type='text'
									value={tableData.givenAmount}
									disabled={
										paymentOption.value === 'Credit'
										|| tableData.status !== 'New'
									}
									onChange={(event) => handleSetGivenAmount(event.target.value)}
								/>
							</>
							: null
						}
					</h4>
					

				</Fragment>
				: null
			}
			<br/>
			{
				tableData.status && tableData.status !== 'New'
				?
				<Button
					onClick={handlePopUpOpen}
					color='danger'
					className="rounded no-margin"
				>
					Cancel Run
				</Button>
				:
				shouldUpdate
				?
				<Button
					onClick={isAllFilled() ? handleUpdateOrder : dummyClick}
					color={isAllFilled() ? 'success' : 'secondary'}
					className="rounded no-margin"
				>
					Update Order
				</Button>
				:
				<Button
					onClick={handleStartRun}
					color="success"
					className="rounded no-margin"
				>
					Start Run
				</Button>
			}
		</Fragment>
	)
}

export default MyAssignments;
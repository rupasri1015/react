import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select'
import Header from './components/Header'
import { parseForDropDown } from '../LiveInventoryUnit/components/forms/utils';
import { getAllWarehouses } from '../../core/services/liveInventoryUnitServices'
import PartsOrderHistoryFilter from './components/PartsOrderHistoryFilter';
import PartsOrderHistoryTable from './components/PartsOrderHistoryTable';
import StatusButton from './components/StatusButtons';
import getPartsOrderHistoryData from '../../redux/actions/partsOrderHistoryAction'
import { getRunnerList } from '../../core/services/partsRequirementServices';
import { getWarehouseID, getWarehouseName } from '../../core/services/rbacServices';

const PartsOrderHistory = ({ history }) => {
	const dispatch = useDispatch();
	const [allWarehouses, setAllWarehouses] = useState([]);
	const [warehouseNum, setWarehouseNum] = useState({value: 0, label: 'All'});
	const [runnerList, setRunnerList] = useState([]);
	const [runner, setRunner] = useState('');
	const fromDate = useSelector(state => state.partsOrderHistory.fromDate);
	const toDate = useSelector(state => state.partsOrderHistory.toDate);
	const searchText = useSelector(state => state.partsOrderHistory.searchText);
	const filter = useSelector(state => state.partsOrderHistory.filter);
	const status = useSelector(state => state.partsOrderHistory.status);

	useEffect(() => {
		const userWarehouseId = getWarehouseID();
		if(userWarehouseId === 0){
			setWarehouseNum({value: 0, label: 'Select Warehouses'});
			getAllWarehouses()
			.then(apiResponse => {
				if (apiResponse.isValid) {
					setAllWarehouses(parseForDropDown(apiResponse.data));
				}
			})
		} else {
			setWarehouseNum({value: userWarehouseId, label: getWarehouseName()});
		}

		getRunnerList(userWarehouseId)
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setRunnerList(parseForDropDown(apiResponse.runners));
			}
		})
	}, [])

	const handleChangeWarehouse = (warehouse) => {
		getRunnerList(warehouse.value)
		.then(apiResponse => {
			if (apiResponse.isValid) {
				setRunnerList(parseForDropDown(apiResponse.runners));
			}
		})
		setWarehouseNum(warehouse);
		setRunner('');
		dispatch(getPartsOrderHistoryData({
			pageNumber: 1,
			fromDate,
			toDate,
			filter,
			searchText,
			warehouseId: warehouse.value,
			warehouseName: warehouse.label,
			status
		}));
	}

	const handleChangeRunner = (runnerValue) => {
		setRunner(runnerValue);
		dispatch(getPartsOrderHistoryData({
			pageNumber: 1,
			fromDate,
			toDate,
			filter,
			searchText,
			warehouseId: warehouseNum.value,
			warehouseName: warehouseNum.label,
			runnerId: runnerValue.value,
			status
		}));
	}

	return(
		<Fragment>
			<Header toWrite='Spare Parts Order Management'/>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div style={{ width: '300px', marginBottom: '1em', marginRight: '1em'}}>
					<Select
						options={allWarehouses}
						classNamePrefix="city-dropdown"
						placeholder="Select Warehouse"
						onChange={warehouse => handleChangeWarehouse(warehouse)}
						value={warehouseNum}
					/>
				</div>
				<div style={{ width: '300px', marginBottom: '1em'}}>
					<Select
						options={runnerList}
						classNamePrefix="city-dropdown"
						placeholder="Select Runner Name"
						onChange={(val) => handleChangeRunner(val)}
						value={runner}
					/>
				</div>
			</div>
				
			<PartsOrderHistoryFilter />
			<StatusButton />
			<PartsOrderHistoryTable history={history}/>
		</Fragment>
	)
}

export default PartsOrderHistory;
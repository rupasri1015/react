import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select'
import Header from './components/Header';
import getPaymentSPMData from '../../redux/actions/paymentSPMAction'
import { getAllWarehouses } from '../../core/services/liveInventoryUnitServices';
import { parseForDropDown } from '../LiveInventoryUnit/components/forms/utils';
import PaymentSPMFilter from './components/PaymentSPMFilter';
import PaymentSPMTable from './components/PaymentSPMTable';
import StatusButton from './components/StatusButtons';
import { getWarehouseID, getWarehouseName } from '../../core/services/rbacServices';

const PaymentSPM = () => {
	const dispatch = useDispatch();
	const [allWarehouses, setAllWarehouses] = useState([]);
	const [warehouseNum, setWarehouseNum] = useState({value: 0, label: 'All'});
	const fromDate = useSelector(state => state.paymentSPM.fromDate);
	const toDate = useSelector(state => state.paymentSPM.toDate);
	const searchText = useSelector(state => state.paymentSPM.searchText);
	const filter = useSelector(state => state.paymentSPM.filter);
	const status = useSelector(state => state.paymentSPM.status);

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
		
	}, [])

	const handleChangeWarehouse = (warehouse) => {
		setWarehouseNum(warehouse);
		dispatch(getPaymentSPMData({
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

	return(
		<>
			<Header toWrite='Manage Payments'/>
			<div style={{ width: '300px'}}>
				<Select
					options={allWarehouses}
					classNamePrefix="city-dropdown"
					placeholder="Select Warehouse"
					onChange={warehouse => handleChangeWarehouse(warehouse)}
					value={warehouseNum}
				/>
			</div>
			<PaymentSPMFilter />
			<StatusButton />
			<PaymentSPMTable />
		</>
	);
}

export default PaymentSPM;
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select'
import Header from './components/Header';
import { parseForDropDown } from '../LiveInventoryUnit/components/forms/utils';
import { getAllWarehouses } from '../../core/services/liveInventoryUnitServices'
import RequisitionAggregateTable from './components/RequisitionAggregateTable';
import RequisitionAggregateFilter from './components/requisitionAggregateFilter';
import getRequisitionAggregateData from '../../redux/actions/requisitionAggregateAction'
import { getWarehouseID, getWarehouseName } from '../../core/services/rbacServices';

const RequisitionAggregate = () => {
	const dispatch = useDispatch();
	const [allWarehouses, setAllWarehouses] = useState([]);
	const [warehouseNum, setWarehouseNum] = useState({value: 0, label: 'All'});
	const searchText = useSelector(state => state.requisitionAggregate.searchText);
	const filter = useSelector(state => state.requisitionAggregate.filter);

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
		dispatch(getRequisitionAggregateData({
			pageNumber: 1,
			filter,
			searchText,
			warehouseId: warehouse.value,
		}));
	}

	return(
		<Fragment>
			<Header/>
			<div style={{ display: 'flow-root', flexDirection: 'row' }}>
				<div style={{ width: '300px', marginBottom: '1em' }}>
					<Select
						float='right'
						options={allWarehouses}
						classNamePrefix="city-dropdown"
						placeholder="Select Warehouse"
						onChange={warehouse => handleChangeWarehouse(warehouse)}
						value={warehouseNum}
					/>
				</div>
			</div>
			<RequisitionAggregateFilter />
			<RequisitionAggregateTable />
		</Fragment>
	)
}

export default RequisitionAggregate;
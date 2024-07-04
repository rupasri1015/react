import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import Header from './components/Header'
import Checkbox from '@material-ui/core/Checkbox'
import InventoryAggregateTable from './components/InventoryAggregateTable'
import InventoryAggregateFilter from './components/InventoryAggregateFilter'
import Select from 'react-select'
import { getAllWarehouses } from '../../core/services/liveInventoryUnitServices'
import getInventoryAggregateData from '../../redux/actions/inventoryAggregateAction'
import { getWarehouseID, getWarehouseName } from '../../core/services/rbacServices';
import { parseForDropDown } from '../LiveInventoryUnit/components/forms/utils';

const InventoryAggregate = () => {
	const dispatch = useDispatch();
	const [allWarehouses, setAllWarehouses] = useState([]);
	const [warehouseId, setWarehouseId] = useState({value: 0, label: 'All'});
	const [showUnavailable, setShowUnavailable] = useState(false);
	useEffect(() => {
		const userWarehouseId = getWarehouseID();
		if(userWarehouseId === 0){
			setWarehouseId({value: 0, label: 'Select Warehouses'});
			getAllWarehouses()
			.then(apiResponse => {
				if (apiResponse.isValid) {
					setAllWarehouses(parseForDropDown(apiResponse.data));
				}
			})
		} else {
			setWarehouseId({value: userWarehouseId, label: getWarehouseName()});
		}
	}, [])

	const handleChangeWarehouse = (warehouse) => {
		setWarehouseId(warehouse);
		dispatch(getInventoryAggregateData({
			pageNum: 1,
			filter: '',
			searchText: '',
			warehouseId: warehouse.value,
			showUnavailable
		}));
	}

	const handleShowUnavailable = (checked) => {
		setShowUnavailable(checked);
		dispatch(getInventoryAggregateData({
			pageNum:1,
			filter: '',
			searchText: '',
			warehouseId: warehouseId.value,
			showUnavailable: checked
		}));
	}

	return(
		<Fragment>
			<Header toWrite='Spare Parts Inventory - Aggregate'/>
			<div style={{ display: 'flow-root', flexDirection: 'row' }}>
				<Checkbox
					color="primary"
					checked={showUnavailable}
					onChange={(event) => handleShowUnavailable(event.target.checked)}
				/>
				<span style={{ fontWeight: 'bold' }}>Show Unavailable Parts Only</span>
				
				<div style={{ width: '300px', float: 'right' }}>
					<Select
						options={allWarehouses}
						classNamePrefix="city-dropdown"
						placeholder="Select Warehouse"
						onChange={warehouse => handleChangeWarehouse(warehouse)}
						value={warehouseId}
					/>
				</div>
			</div>
			
			<InventoryAggregateFilter
				warehouseId={warehouseId.value}
				showUnavailable={showUnavailable}
			/>
			<InventoryAggregateTable
				warehouseId={warehouseId}
				showUnavailable={showUnavailable}
			/>
		</Fragment>
	)
}

export default InventoryAggregate;
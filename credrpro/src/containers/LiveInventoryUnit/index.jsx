import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import Header from './components/Header'
import LIUnitTable from './components/LIUnitTable'
import LIUnitFilter from './components/LIUnitFilter'
import Select from 'react-select'
import { getAllWarehouses } from '../../core/services/liveInventoryUnitServices'
import getLiveInventoryUnitData from '../../redux/actions/liveInventoryUnitAction'
import { parseForDropDown } from '../LiveInventoryUnit/components/forms/utils';
import { getWarehouseID, getWarehouseName } from '../../core/services/rbacServices';

const LiveInventoryUnit = () => {
	const dispatch = useDispatch();
	const [allWarehouses, setAllWarehouses] = useState([]);
	const [warehouseNum, setWarehouseNum] = useState({value: 0, label: 'All'});
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
		dispatch(getLiveInventoryUnitData({
			pageNum: 1,
			filter: '',
			searchText: '',
			warehouseNum: warehouse.value
		}));
	}

	return(
		<Fragment>
			<Header toWrite='Spare Parts Inventory - Fulfilled'/>
			<div style={{ display: 'flow-root', flexDirection: 'row' }}>
				<div style={{ width: '300px' }}>
					<Select
						options={allWarehouses}
						classNamePrefix="city-dropdown"
						placeholder="Select Warehouse"
						onChange={warehouse => handleChangeWarehouse(warehouse)}
						value={warehouseNum}
					/>
				</div>
			</div>
			
			<LIUnitFilter warehouseNum={warehouseNum.value}/>
			<LIUnitTable warehouseNum={warehouseNum}/>
		</Fragment>
	)
}

export default LiveInventoryUnit;
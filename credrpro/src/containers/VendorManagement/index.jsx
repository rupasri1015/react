import React, { Fragment, useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select'
import { Link } from 'react-router-dom'
import Header from './components/Header'
import VendorManagementTable from './components/VendorManagementTable'
import VendorManagementFilter from './components/VendorManagementFilter'
import { getWarehouseID, getWarehouseName } from '../../core/services/rbacServices';
import { parseForDropDown } from '../LiveInventoryUnit/components/forms/utils';
import { getAllWarehouses } from '../../core/services/liveInventoryUnitServices'
import getVendorManagementData from '../../redux/actions/vendorManagementAction'
import { PERMISSIONS, getRole } from '../../core/services/rbacServices';

const VendorManagement = () => {
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
		dispatch(getVendorManagementData({
			pageNumber: 1,
			filter,
			searchText,
			warehouseId: warehouse.value,
		}));
	}

	return(
		<Fragment>
			<Header toWrite='Vendor Management'/>
			
			<div style={{ display: 'flow-root', flexDirection: 'row' }}>
				{
					PERMISSIONS.VENDOR_MANAGEMENT.includes(getRole())
					?
					<Link className="btn btn-success rounded no-margin" to="/vendorManagement/add">
						Add New Vendor
					</Link>
					: null
				}
				
				<div style={{ width: '300px', float: 'right' }}>
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
			<VendorManagementFilter />
			<VendorManagementTable />
		</Fragment>
	)
}

export default VendorManagement;
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import getVendorManagementData from '../../../redux/actions/vendorManagementAction'
import Pagination from 'rc-pagination'
import NoResultFound from '../../../shared/components/NoResultFound'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import { Link } from 'react-router-dom'
import edit from '../../../shared/img/icons/edit-icon.svg';
import { PERMISSIONS, getRole } from '../../../core/services/rbacServices';

const columns = [
	{label: 'Vendor Name', value:'vendorName'},
	{label: 'Phone Number', value:'phoneNumber'},
	{label: 'City', value:'city'},
	{label: 'PIN Code', value:'pincode'},
	{label: 'Warehouse', value:'warehouseName'},
	{label: 'Payment Method', value:'paymentMethod'},
	{label: 'Payment TAT', value:'paymentTAT'},
	{label: 'Action', value:'edit'},
];

const VendorManagementTable = () => {
	const dispatch = useDispatch();
	useEffect(() => {dispatch(getVendorManagementData())}, []);
	const vendorManagementData = useSelector(state => state.vendorManagement.data);
	const pageNumber = useSelector(state => state.vendorManagement.pageNumber);
	const totalPages = useSelector(state => state.vendorManagement.totalPages);
	const searchText = useSelector(state => state.vendorManagement.searchText);
	const filter = useSelector(state => state.vendorManagement.filter);
	const warehouseId = useSelector(state => state.vendorManagement.warehouseId);

	const handlePageChange = (selectedPage) => {
		const payload = {
      pageNumber: selectedPage,
			searchText,
			filter,
			warehouseId
    };
		dispatch(getVendorManagementData(payload))
	}	

	return(
		<div className="table-wraper">
			<Table size="small">
			 	<TableHead>
	 				<TableRow>
	 					{
							columns.map((row, index) => (
								<TableCell
									key={index}
								>
									{row.label}
								</TableCell>
							))
						}
					</TableRow>
				</TableHead>
				<TableBody>
				{
					vendorManagementData.map((rowData, index) => {
						return(
							<TableRow hover tabIndex={-1}  key={ index }>
								{
									columns.map((col, index) => {
										return(
											col.value === 'paymentTAT'
											?
												<TableCell key={index}>
													{rowData[col.value].concat(' Days')}
												</TableCell>
											: col.value === 'edit'
											? 
												<TableCell key={index}>
													{
														PERMISSIONS.VENDOR_MANAGEMENT.includes(getRole())
														?
														<Link
															to={"/vendorManagement/edit/".concat(rowData.vendorId)}
														>
															<img
																src={edit}
																alt="Edit Valuator"
																role="button"
																className="action-icon"
															/>
														</Link>
														: null

													}
													
												</TableCell>
											:
												<TableCell key={index}>
													{rowData[col.value]}
												</TableCell>
										)		
									})
								}
							</TableRow>
						)
					})
				}
				</TableBody>
			</Table>
			<div className="table-paginator">
				{
					Boolean(vendorManagementData.length)
					?
						<Pagination
							className='float-right'
							showSizeChanger={false}
							total={10 * totalPages}
							pageSize={10}
							current={pageNumber}
							locale={localeInfo}
							onChange={handlePageChange}
						/>
					:
						<NoResultFound />
				}
			</div>
		</div>
	)
}

export default VendorManagementTable;
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import { getSparePartsAssignmentData } from '../../../redux/actions/sparePartsAssignmentAction'
import { getWarehouseName, getWarehouseID } from '../../../core/services/rbacServices';

import Pagination from 'rc-pagination'
import NoResultFound from '../../../shared/components/NoResultFound'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import { Link } from 'react-router-dom'

const columns = [
	{label: 'Repair Request ID', value:'repairRequestId'},
	{label: 'Request Date', value:'requestDate'},
	{label: 'Bike Reg No.', value:'registrationNumber'},
	{label: 'MMV - Year', value:'mmv'},
	{label: 'Service Center', value:'serviceCenterName'},
	{label: 'Warehouse', value:'warehouseName'},
	{label: 'Deadline', value:'deadline'},
	{label: 'Completed Date', value:'completedDate'},
	{label: 'Status', value:'assignStatus'},
];

const SparePartsAssignmentTable = () => {
	const dispatch = useDispatch();
	useEffect(() => {dispatch(getSparePartsAssignmentData())}, []);
	const sparePartsAssignmentData = useSelector(state => state.sparePartsAssignment.data);
	const pageNumber = useSelector(state => state.sparePartsAssignment.pageNumber);
	const totalPages = useSelector(state => state.sparePartsAssignment.totalPages);
	const fromDate = useSelector(state => state.sparePartsAssignment.fromDate);
	const toDate = useSelector(state => state.sparePartsAssignment.toDate);
	const serviceCenterName = useSelector(state => state.sparePartsAssignment.serviceCenterName);
	const warehouseName = useSelector(state => state.sparePartsAssignment.warehouseName);
	const warehouseId = useSelector(state => state.sparePartsAssignment.warehouseId);
	const searchText = useSelector(state => state.sparePartsAssignment.searchText);
	const status = useSelector(state => state.sparePartsAssignment.status);

	const handlePageChange = (selectedPage) => {
		const payload = {
      pageNumber: selectedPage,
      fromDate,
			toDate,
			warehouseName,
			warehouseId: getWarehouseName() === 'All' ? (warehouseId || 0) : getWarehouseID(),
			serviceCenterName,
			searchText,
			status
    };
		dispatch(getSparePartsAssignmentData(payload))
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
					sparePartsAssignmentData.map((rowData, index) => {
						return(
							<TableRow hover tabIndex={-1}  key={ index }>
								{
									columns.map((col, index) => {
										return(
											col.value === 'mmv'
											?
												<TableCell key={index}>
													{
														rowData['mmv'].concat(' ')
														.concat(rowData['manufacturedYear'])
													}
												</TableCell>
											: col.value === 'assignStatus'
											? <TableCell key={index}>
													{
														<Link
															className={
																rowData[col.value] === 'Pending'
																? "btn btn-danger rounded no-margin"
																: rowData[col.value] === 'Partial'
																? "btn btn-warning rounded no-margin"
																: "btn btn-success rounded no-margin"
															}
															to={
																'/sparePartsAssignment/bikeRepairRequest/'.concat(rowData.repairRequestId)
															}
														>
															{rowData[col.value]}
														</Link>
													}
												</TableCell>
											: col.value === 'deadline'
											? <TableCell key={index}>
													{
														new Date(rowData[col.value]) < new Date()
														? <span style={{ color: 'red' }}>{rowData[col.value]}</span>
														: rowData[col.value]
													}
												</TableCell>
											:	<TableCell key={index}>
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
					Boolean(sparePartsAssignmentData.length)
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

export default SparePartsAssignmentTable;

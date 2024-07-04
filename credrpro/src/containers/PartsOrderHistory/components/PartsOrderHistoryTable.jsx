import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import getPartsOrderHistoryData from '../../../redux/actions/partsOrderHistoryAction'
import Pagination from 'rc-pagination'
import NoResultFound from '../../../shared/components/NoResultFound'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import { Link } from 'react-router-dom'
import { PERMISSIONS, getRole } from '../../../core/services/rbacServices';

//not billed -> Fulfilled - No Bill -> "Input Bill"

const columns = [
	{label: 'Order ID', value:'orderId'},
	{label: 'Order Date', value:'orderDate'},
	{label: 'Warehouse', value:'warehouseName'},
	{label: 'Vendor Name', value:'vendorName'},
	{label: 'Assigned To', value:'runnerName'},
	{label: 'Status', value:'status'},
	{label: 'Action', value:'action'},
];

const PartsOrderHistoryTable = (props) => {
	const dispatch = useDispatch();
	useEffect(() => {dispatch(getPartsOrderHistoryData())}, []);
	const partsOrderHistoryData = useSelector(state => state.partsOrderHistory.data);
	const pageNumber = useSelector(state => state.partsOrderHistory.pageNumber);
	const totalPages = useSelector(state => state.partsOrderHistory.totalPages);
	const fromDate = useSelector(state => state.partsOrderHistory.fromDate);
	const toDate = useSelector(state => state.partsOrderHistory.toDate);
	const warehouseId = useSelector(state => state.partsOrderHistory.warehouseId);
	const warehouseName = useSelector(state => state.partsOrderHistory.warehouseName);
	const searchText = useSelector(state => state.partsOrderHistory.searchText);
	const filter = useSelector(state => state.partsOrderHistory.filter);
	const status = useSelector(state => state.partsOrderHistory.status);
	
	const handlePageChange = (selectedPage) => {
		const payload = {
      pageNumber: selectedPage,
      fromDate,
			toDate,
			warehouseName,
			warehouseId,
			searchText,
			filter,
			status
    };
		dispatch(getPartsOrderHistoryData(payload))
	}

	const handleClick = (rowData) => {
		props.history.push('/partsOrderHistory/details/'.concat(rowData.orderId));
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
					partsOrderHistoryData.map((rowData, index) => {
						return(
							<TableRow hover tabIndex={-1}  key={ index }>
								{
									columns.map((col, index1) => {
										return(
											col.value === 'status'
											?
											<TableCell key={index1}>
												{
													<Button
														color={
															rowData.status === 'New'
															? 'success'
															: rowData.status === 'Discarded'
															? 'danger'
															: rowData.status === 'InProgress'
															? 'warning'
															: 'primary'
														}
														type="button"
														className="rounded no-margin"
														outline
														style={{ width: '8em' }}
														onClick={() => handleClick(rowData)}
													>
														{rowData[col.value] === 'NotBilled' ? 'Fulfilled - No Bill' : rowData[col.value]}
													</Button>
												}
												
											</TableCell>
											: col.value === 'action'
												&& (rowData.status === 'New'
												|| rowData.status === 'InProgress' || rowData.status === 'NotBilled')
											?
											<TableCell key={index1}>
												{
													PERMISSIONS.PARTS_ORDER_HISTORY.includes(getRole())
													?
														<Link
															className={
																rowData.status === 'InProgress' || rowData.status === 'NotBilled'
																? "btn btn-warning rounded no-margin"
																: "btn btn-success rounded no-margin"
															}
															to={
																rowData.status === 'InProgress' || rowData.status === 'NotBilled'
																? '/inwardSpareParts/'.concat(rowData.orderId)
																: '/myAssignments/'.concat(rowData.orderId)
															}
														>
															{
																rowData.status === 'InProgress'
																? 'Fulfill Order'
																: rowData.status === 'NotBilled'
																? 'Input Bill'
																: 'Initiate Run'
															}
														</Link>
													:
														<Button
															className="rounded no-margin"
															type="button"
														>
															{
																rowData.status === 'InProgress'
																? 'Fulfill Order'
																: 'Initiate Run'
															}
														</Button>
												}
											</TableCell>
											:
											<TableCell key={index1}>
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
					Boolean(partsOrderHistoryData.length)
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

export default PartsOrderHistoryTable;
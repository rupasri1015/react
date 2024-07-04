import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import getPaymentSPMData from '../../../redux/actions/paymentSPMAction'
import Pagination from 'rc-pagination'
import NoResultFound from '../../../shared/components/NoResultFound'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import { Link } from 'react-router-dom'

const columns = [
	{label: 'Order Id', value:'orderId'},
	{label: 'Order Item Ids', value:'orderItemIds'},
	{label: 'Fulfilled Date', value:'fulfilledDate'},
	{label: 'Deadline Date', value:'deadlineDate'},
	{label: 'Warehouse', value:'warehouseName'},
	{label: 'Vendor', value:'vendor'},
	{label: 'Payment Method', value:'paymentMethod'},
	{label: 'Payment TAT (days)', value:'paymentTAT'},
	{label: 'Amount', value:'amount'},
	{label: 'Status', value:'status'},
	{label: 'View Invoice', value:'billNumber'},
];

const PartsRequirementTable = () => {
	const dispatch = useDispatch();
	useEffect(() => {dispatch(getPaymentSPMData())}, []);
	const paymentSPMData = useSelector(state => state.paymentSPM.data);
	const pageNumber = useSelector(state => state.paymentSPM.pageNumber);
	const totalPages = useSelector(state => state.paymentSPM.totalPages);
	const fromDate = useSelector(state => state.paymentSPM.inDate);
	const toDate = useSelector(state => state.paymentSPM.inDate);
	const warehouseId = useSelector(state => state.paymentSPM.warehouseId);
	const warehouseName = useSelector(state => state.paymentSPM.warehouseName);
	const searchText = useSelector(state => state.paymentSPM.searchText);
	const filter = useSelector(state => state.paymentSPM.filter);
	const status = useSelector(state => state.paymentSPM.status);
	const [expandedRow, setExpandedRow] = useState(-1);
	
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
		dispatch(getPaymentSPMData(payload))
	}

	const handleExpandMMV = (rowId) => {
		expandedRow === rowId ? setExpandedRow(-1) : setExpandedRow(rowId);
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
					paymentSPMData && paymentSPMData.map((rowData, index) => {
						return(
							<TableRow hover tabIndex={-1}  key={ index }>
								{
									columns.map((col, index1) => {
										return(
											<TableCell key={index1}>
												{
													col.value === 'orderItemIds'
													?
														rowData[col.value].length === 1
														? rowData[col.value][0]
														: 
															expandedRow === index
															?
																<div
																	onClick={ () => handleExpandMMV(index) }
																	style={{ cursor: 'pointer', color: 'teal', height: '5.5em', overflow: 'scroll' }}
																>
																	{ rowData[col.value].map((id, index) => <div key={index}>{id}</div>) }
																</div>
															:
																<div>
																	{ rowData[col.value][0]}
																	<span
																		onClick={ () => handleExpandMMV(index) }
																		style={{ cursor: 'pointer', color: 'blue' }}
																	>
																		{' +('.concat(rowData[col.value].length - 1).concat(')') }
																	</span>
																	</div>
																 
													:
													col.value === 'billNumber'
													? 
													<a
														href={rowData.invoiceURL}
														target="_blank"
														rel="noopener noreferrer"
													>
														{rowData.billNumber}
													</a>
													: col.value === 'orderId'
													? 
													<Link
														to={'/partsOrderHistory/details/'.concat(rowData.orderId)}
													>
														{rowData.orderId}
													</Link>
													: rowData[col.value]
												}
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
					Boolean(paymentSPMData.length)
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

export default PartsRequirementTable;
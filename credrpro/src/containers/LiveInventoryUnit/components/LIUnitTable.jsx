import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import getLiveInventoryUnitData from '../../../redux/actions/liveInventoryUnitAction'
import Pagination from 'rc-pagination'
import NoResultFound from '../../../shared/components/NoResultFound'
import localeInfo from 'rc-pagination/lib/locale/en_US'

const columns = [
	{label: 'In DateTime', value: 'inwardTime' },
	{label: 'Order Id', value: 'orderId' },
	{label: 'Order Item Id', value: 'orderItemId' },
	{label: 'Part Name', value: 'sparePartName' },
	{label: 'Section', value: 'section' },
	{label: 'Category', value: 'category' },
	{label: 'Applicable MMVs Year Range', value: 'mmvYears' },
	{label: 'In Qty', value: 'inwardQuantity' },
	{label: 'Provisional Unit Price', value: 'estimatedUnitPrice' },
	{label: 'Actual Unit Price', value: 'actualUnitPrice' },
	{label: 'Source Type', value: 'sourceType' },
	{label: 'Model No.', value: 'modelNumber' },
	{label: 'Vendor', value: 'vendorName' },
	{label: 'Warehouse', value: 'warehouseName' }
	];

const AddLIUnitTable = (props) => {
	const dispatch = useDispatch();
	useEffect(() => {dispatch(getLiveInventoryUnitData())}, []);
	const liUnitData = useSelector(state => state.liveInventoryUnit.data);
	const pageNum = useSelector(state => state.liveInventoryUnit.pageNum);
	const totalPages = useSelector(state => state.liveInventoryUnit.totalPages);
	const filter = useSelector(state => state.liveInventoryUnit.filter);
	const searchText = useSelector(state => state.liveInventoryUnit.searchText);
	const [expandedRow, setExpandedRow] = useState(-1);

	const handlePageChange = (selectedPage) => {
		const payload = {
			pageNum: selectedPage,
			filter,
			searchText,
			warehouseNum: props.warehouseNum.value
		};
		dispatch(getLiveInventoryUnitData(payload))
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
					liUnitData.map((rowData, index) => {
						return(
							<TableRow hover tabIndex={-1}  key={ index }>
								{
									columns.map((col, index1) => {
										return(
											col.value === 'mmvYears'
											?
												<TableCell key={index1}>
													{rowData.mmvYears && rowData.mmvYears.length !== 0
														? rowData.mmvYears.length === 1
															? rowData.mmvYears[0].mmv
															: expandedRow === index
															? <div
																	onClick={ () => handleExpandMMV(index) }
																	style={{ cursor: 'pointer', color: 'teal', height: '9.3em', overflow: 'scroll' }}
																>
																	{
																		rowData.mmvYears.map((mmvYear, mmvIndex) => {
																			return(
																				<div
																					key={ mmvIndex }
																					style={{
																						border: '1px solid gray',
																						borderRadius: '3px',
																						marginBottom: '0.1em'
																					}}
																				>
																					{ 
																						mmvYear.mmv
																						? <div>
																									{ mmvYear.mmv.slice(0, mmvYear.mmv.length - 9) }
																									<br/>
																									{ mmvYear.mmv.slice(mmvYear.mmv.length - 9, mmvYear.mmv.length) }
																							</div>
																						: 'null'
																					}
																				</div>
																			)
																		})
																	}
																</div>
															:	<div>
																	{ rowData.mmvYears[0].mmv } {' '}
																	<span 
																		onClick={ () => handleExpandMMV(index) }
																		style={{ cursor: 'pointer', color: 'blue' }}
																	>
																		+({rowData.mmvYears.length-1})
																	</span> 
																</div>
														: null
													}
												</TableCell>
											// : col.value === 'unitPrice'
											// ? 
											// 	<TableCell key={index1}>
											// 		{rowData.actualUnitPrice === 0 ? rowData.estimatedUnitPrice : rowData.actualUnitPrice}
											// 	</TableCell>
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
					Boolean(liUnitData.length) ?
						<Pagination
							className='float-right'
							showSizeChanger={false}
							total={10 * totalPages}
							pageSize={10}
							current={pageNum}
							locale={localeInfo}
							onChange={handlePageChange}
						/> :
						<NoResultFound />
				}
			</div>
		</div>
	)
}

export default AddLIUnitTable;
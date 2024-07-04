import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import getRequisitionAggregateData from '../../../redux/actions/requisitionAggregateAction'
import Pagination from 'rc-pagination'
import NoResultFound from '../../../shared/components/NoResultFound'
import localeInfo from 'rc-pagination/lib/locale/en_US'

const columns = [
	{label: 'Part Req IDs', value:'requestIds'},
	{label: 'Warehouse', value:'warehouseName'},
	{label: 'Section', value: 'section'},
	{label: 'Category', value: 'category'},
	{label: 'Part Name', value: 'sparePartName'},
	{label: 'MMV - Year', value:'mmvYearRanges'},
	{label: 'Rqst Qty', value:'requestedQuantity'},
	{label: 'Fulfilled Qty', value:'fulfilledQuantity'},
	{label: 'Pending Qty', value:'pendingQuantity'},
];

const PartsRequirementTable = () => {
	const dispatch = useDispatch();
	useEffect(() => {dispatch(getRequisitionAggregateData())}, []);
	const requisitionAggregateData = useSelector(state => state.requisitionAggregate.data);
	const pageNumber = useSelector(state => state.requisitionAggregate.pageNumber);
	const totalPages = useSelector(state => state.requisitionAggregate.totalPages);
	const warehouseId = useSelector(state => state.requisitionAggregate.warehouseId);
	const searchText = useSelector(state => state.requisitionAggregate.searchText);
	const filter = useSelector(state => state.requisitionAggregate.filter);
	const [expandedRow, setExpandedRow] = useState(-1);
	
	const handlePageChange = (selectedPage) => {
		const payload = {
      pageNumber: selectedPage,
			warehouseId,
			searchText,
			filter,
    };
		dispatch(getRequisitionAggregateData(payload))
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
					requisitionAggregateData.map((rowData, index) => {
						return(
							<TableRow hover tabIndex={-1}  key={ index }>
								{
									columns.map((col, index1) => {
										return(
											col.value === 'mmvYearRanges'
											?
											<TableCell key={index1}>
												{rowData.mmvYearRanges && rowData.mmvYearRanges.length !== 0
													? rowData.mmvYearRanges.length === 1
														? rowData.mmvYearRanges[0]
														: expandedRow === index
														? <div
																onClick={ () => handleExpandMMV(index) }
																style={{ cursor: 'pointer', color: 'teal', height: '9.3em', overflow: 'scroll' }}
															>
																{
																	rowData.mmvYearRanges.map((mmvYear, mmvIndex) => {
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
																					mmvYear
																					? <div>
																								{ mmvYear.slice(0, mmvYear.length - 9) }
																								<br/>
																								{ mmvYear.slice(mmvYear.length - 9, mmvYear.length) }
																						</div>
																					: null
																				}
																			</div>
																		)
																	})
																}
															</div>
														:	<div>
																{ rowData.mmvYearRanges[0].slice(0, rowData.mmvYearRanges[0].length - 9) }
																<br/>
																{ rowData.mmvYearRanges[0]
																		.slice(rowData.mmvYearRanges[0].length -9, rowData.mmvYearRanges[0].length)
																} { ' ' }
																<span 
																	onClick={ () => handleExpandMMV(index) }
																	style={{ cursor: 'pointer', color: 'blue' }}
																>
																	+({rowData.mmvYearRanges.length-1})
																</span> 
															</div>
													: null
												}
											</TableCell>
											: col.value === 'requestIds'
											? 
											<TableCell key={index1}>
												{
													rowData[col.value].length === 1
													? rowData[col.value][0]
													: expandedRow === index
													?
														<div
															onClick={ () => handleExpandMMV(index) }
															style={ rowData.mmvYearRanges && rowData.mmvYearRanges.length === 1
																?
																	{ 
																		cursor: 'pointer',
																		color: 'teal',
																		height: '4em',
																		overflow: 'scroll'
																	}
																:
																	{
																		cursor: 'pointer',
																		color: 'teal',
																		height: '9.3em',
																		overflow: 'scroll'
																	}
															}
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
					Boolean(requisitionAggregateData.length)
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
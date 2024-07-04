import React, { useState } from 'react';
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'

const columns = [
	{label: 'Part Req ID', value:'requestIds'},
	{label: 'Order Item ID', value:'orderItemId'},
	{label: 'Part Name', value:'sparePartName'},
	{label: 'MMV - Year', value:'mmvYearRanges'},
	{label: 'Requested Qty', value:'requestedQuantity'},
	{label: 'Estimated Unit Price', value:'estimatedUnitPrice'},
	{label: 'Estimated Total Price', value:'estimatedTotalPrice'},
];

const MyAssignmentTable = (props) => {
	const { tableData } = props;
	const [expandedRow, setExpandedRow] = useState(-1);
	
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
				{
					tableData.items
					?
					<TableBody>
					{
						tableData.items.map((rowData, index) => {
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
					: 
						<TableBody>
							<TableRow>
								<TableCell>
									Please Select "Runner Name" and "OrderId - Vendor - Status"
								</TableCell>
							</TableRow>
						</TableBody>
				}
			</Table>
		</div>
	);
}

export default MyAssignmentTable;
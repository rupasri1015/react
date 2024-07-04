import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'

const columns = [
	{label: 'Part Name', value:'sparePartName'},
	{label: 'Assigned Quantity', value:'assignedQuantity'},
	{label: 'Assigned Date', value:'assignedDate'},
];

const AssignmentHistoryTable = (props) => {
	const { data } = props;
	
	return(
		Boolean(data.length)
		?
		<Table size="small">
			<TableHead>
				<TableRow>
					{
						columns.map((row, index) => (
							<TableCell key={index}>
								{row.label}
							</TableCell>
						))
					}
				</TableRow>
			</TableHead>
			<TableBody>
				{
					data.map((rowData, index) => {
						return(
							<TableRow hover tabIndex={-1}  key={ index }>
								{
									columns.map((col, index1) => {
										return(
											<TableCell key={ index1 }>
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
		:
		<div>No Assignment history found...</div>
	)
}

export default AssignmentHistoryTable;
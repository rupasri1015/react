import React, { useRef, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiTableCell from '@material-ui/core/TableCell';

const TableCell = withStyles((theme) => ({
	root: {
		borderBottom: 'none',
		color: theme.palette.helpText,
		verticalAlign: 'text-top'
	}
}))(MuiTableCell);

const TableHeadCell = (props) => {
	const { id, key, classes, className, style, children, saveTableHeadCellPositionValues } = props;
	const tableCellRef = useRef();

	useEffect(() => {
		const { left, right } = tableCellRef.current.getBoundingClientRect();
		saveTableHeadCellPositionValues({
			id,
			values: {
				left,
				right
			}
		});
		// eslint-disable-next-line
	}, []);

	return (
		<TableCell ref={tableCellRef} key={key} className={className} classes={classes} style={style}>
			{children}
		</TableCell>
	);
};

export default TableHeadCell;

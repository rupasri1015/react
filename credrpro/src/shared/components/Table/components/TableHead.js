import React from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const EnhancedTableHead = (props) => {
	const {
		currentSort,
		tableHeadCellConfig,
		actionButtons,
		actionMenuItems,
		sortData
	} = props;

	const callSortData = (headCell) => {
		if (headCell.key === currentSort.key) {
			if (currentSort.order === 'desc') {
				sortData(headCell.key, 'asc');
			} else {
				sortData(headCell.key, 'desc');
			}
		} else {
			sortData(headCell.key, currentSort.order);
		}
	};

	const renderSortIcon = (headCell) => {
		if (sortData && currentSort && headCell.allowSort) {
			return (
				<TableSortLabel
					active={true}
					direction={currentSort.orderType === 'desc' ? 'desc' : 'asc'}
					onClick={(e) => {
						callSortData(headCell);
					}}
				/>
			);
		}

		return null;
	};

	const renderTableHeadItemCells = () => {
		return tableHeadCellConfig.map((headCell, index) => {
			return (
				<TableCell
					key={index}
					id={headCell.key}
				>
					{headCell.label}
					{renderSortIcon(headCell)}
				</TableCell>
			);
		});
	};

	const renderActions = () => {
		if ((!actionButtons || actionButtons.length === 0) && (!actionMenuItems || actionMenuItems.length === 0))
			return null;

		return (
			<TableCell id="action">
				Action
			</TableCell>
		);
	};

	const renderTableHeadItems = () => {
		return (
			<>
				{renderTableHeadItemCells()}
				{renderActions()}
			</>
		);
	};

	return (
		<TableHead>
			<TableRow>{renderTableHeadItems()}</TableRow>
		</TableHead>
	);
};

EnhancedTableHead.propTypes = {
	tableHeadCellConfig: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			key: PropTypes.string.isRequired,
			type: PropTypes.oneOf(['string', 'image', 'node', 'custom', 'date', 'amount']),
			allowSort: PropTypes.bool,
			renderItem: PropTypes.func
		})
	).isRequired,
	sortData: PropTypes.func,
	currentSort: PropTypes.shape({
		key: PropTypes.string,
		order: PropTypes.string
	}),
	actionButtons: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			component: PropTypes.node,
			onClickHandler: PropTypes.func
		})
	),
};

export default EnhancedTableHead;

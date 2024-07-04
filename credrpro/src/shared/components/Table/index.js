import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import Pagination from 'rc-pagination';
import localeInfo from 'rc-pagination/lib/locale/en_US';

import TableHead from './components/TableHead';
import TableBody from './components/TableBody';
import NoResultFound from '../../../shared/components/NoResultFound';

const EnhancedTable = (props) => {
	const {
		role,
		tableHeadCellConfig,
		items,
		currentSort,
		actionButtons,
		actionMenuItems,
		rowsPerPage,
		stickyColumns,
		classNames,
		renderEmpty,
		sortData,
		totalItemsCount,
		pageNum,
		onPageChange,
		muiCellClass
	} = props;
	const keys = tableHeadCellConfig.map((headCell, index) => {
		return {
			key: headCell.key,
			type: headCell.type,
			renderItem: headCell.renderItem
		};
	});

	const [paginationData, setPaginationData] = useState({
		rowsPerPage:15,
		page: 1
	});

	let finalPage = Math.ceil(items.length / paginationData.rowsPerPage);

	if (finalPage === 0) {
		finalPage = 1;
	}

	if (paginationData.page > finalPage) {
		setPaginationData({
			...paginationData,
			page: finalPage
		});
	}

	const renderTable = () => {
		if (items.length === 0) {
			if (typeof renderEmpty === 'function') {
				return renderEmpty();
			}
		}

		let configuredTableHeadCellsConfig = tableHeadCellConfig;
		const configuredItems = items;
		let configuredKeys = keys;

		return (
			<>
				<h4 className="countHeader"> {`${`Total Records: ${totalItemsCount}`}`} </h4>
				
				<div className="table-wraper">
					<Table size="small">
						<TableHead
							tableHeadCellConfig={configuredTableHeadCellsConfig}
							sortData={sortData}
							currentSort={currentSort}
							actionButtons={actionButtons}
							actionMenuItems={actionMenuItems}
						/>
						
						<TableBody
						  	role={role}
							paginationData={paginationData}
							items={configuredItems}
							keys={configuredKeys}
							actionButtons={actionButtons}
							actionMenuItems={actionMenuItems}
							classNames={classNames}
							muiCellClass={muiCellClass}
							stickyColumns={stickyColumns}
						/>
					</Table>
					<div className="table-paginator">
						{Boolean(items.length) ? (
							<Pagination
								className="float-right"
								locale={localeInfo}
								current={pageNum}
								total={totalItemsCount}
								pageSize={rowsPerPage}
								onChange={onPageChange}
							/>
						) : (
							<NoResultFound />
						)}
					</div>
				</div>
			</>
		);
	};

	return renderTable();
};

EnhancedTable.defaultProps = {
	rowsPerPage: 10,
	hideFooter: false,
	stickyColumns: {
		left: 0,
		right: 0
	}
};

EnhancedTable.propTypes = {
	role: PropTypes.string,
	tableHeadCellConfig: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			key: PropTypes.string.isRequired,
			// valuType: PropTypes.string.isRequired,
			type: PropTypes.oneOf(['string', 'image', 'custom', 'dateTime', 'date', 'amount']),
			allowSort: PropTypes.bool,
			renderItem: PropTypes.func
		})
	).isRequired,
	items: PropTypes.arrayOf(PropTypes.object).isRequired,
	actionButtons: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			component: PropTypes.node,
			onClickHandler: PropTypes.func
		})
	),
	actionMenuItems: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string,
			icon: PropTypes.node,
			onClickHandler: PropTypes.func
		})
	),
	orderType: PropTypes.string,
	rowsPerPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	stickyColumns: PropTypes.shape({
		left: PropTypes.left,
		right: PropTypes.right
	}),
	sortData: PropTypes.func,
	currentSort: PropTypes.shape({
		key: PropTypes.string,
		order: PropTypes.string
	}),
	renderEmpty: PropTypes.func,
	onPageChange: PropTypes.func,
	/*
	NOTE- Pass this if you use footer for table
	*/
	totalItemsCount: PropTypes.number,
	pageNum: PropTypes.number
};

export default EnhancedTable;

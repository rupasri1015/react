import React from 'react';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import '../../../../containers/Logistics/style.scss'
import { RBAC_LINK } from '../../../../core/services/rbacServices';
import { getDate, getMmvYear, getOnlyDate, getAmount, getYear, renderString } from '../../../../core/utility';

const EnhancedTableBody = (props) => {
	const { role, paginationData, items, keys, actionButtons, actionMenuItems } = props;
	const { page, rowsPerPage } = paginationData;
console.log(paginationData,'paginationData2')
	const renderTableCells = (item, rowIndex) => {
		return keys.map(({ key, type, renderItem, styles }, index) => {
			if (item[key] === undefined && item[key] === null) return '';
			let cellValue;
			
			switch (type) {
				case 'string': {
					return (
						<TableCell
							key={index}
							title={(item[key] !== undefined && item[key] !== null && item[key].toString()) || ''}
						>
							<span>{(item[key] !== undefined && item[key] !== null && item[key].toString()) || '-'}</span>
						</TableCell>
					);
				}
				case 'dateTime': {
					return (
						<TableCell
							key={index}
						// title={(item[key] !== undefined && item[key] !== null && item[key].toString()) || ''}
						>
							{getDate(item[key])}
						</TableCell>
					);
				}
				case 'date': {
					return <TableCell key={index}>{getOnlyDate(item[key])}</TableCell>;
				}
				case 'regNumber': {
					return <TableCell key={index}>{item[key]}
					<p>{renderString(item.bikeProfile.registrationNumber)}</p>
							<small className='leadLabel'>{item.leadId}</small>
					</TableCell>;
				}
				case 'amount': {
					return <TableCell key={index}>{getAmount(item[key])}</TableCell>;
				}
				case 'mmvY': {
					return (
						<TableCell
							key={index}
						// title={(item[key] !== undefined && item[key] !== null && item[key].toString()) || ''}
						>
							{getMmvYear(item[key])}
						</TableCell>
					);
				}
				case 'year': {
					return (
						<TableCell
							key={index}
						// title={(item[key] !== undefined && item[key] !== null && item[key].toString()) || ''}
						>
							{getYear(item[key])}
						</TableCell>
					);
				}
				case 'image': {
					return (
						<TableCell key={index}>
							<img src={item[key]} alt={item[key]} width="60px" height="60px" />
						</TableCell>
					);
				}
				case 'custom': {
					return (
						<TableCell key={index}>
							{/* sending row index in renderItem will be useful to show the row number in the table */}
							{typeof renderItem === 'function' && renderItem(item, rowIndex)}
						</TableCell>
					);
				}

				default: {
					return (
						<TableCell
							key={index}
							title={(item[key] !== undefined && item[key] !== null && item[key].toString()) || ''}
						>
							{cellValue}
						</TableCell>
					);
				}
			}
		});
	};

	const callActionClickHandler = (e, actionIndex, index) => {
		const { onClickHandler } = actionButtons[actionIndex];

		if (typeof onClickHandler !== 'function') return null;

		return onClickHandler({ e, index, item: items[index] });
	};

	const renderActionButtons = (item, index) => {
		if (!actionButtons || actionButtons.length === 0) return null;
		// Render Action Buttons
		return actionButtons.map(({ component }, actionIndex) => {
			const disable = RBAC_LINK.franchiseRoutes.includes(role)
				? item.returnSubStatus !== 'PENDING REVIEW' || item.returnStatus === 'CANCELLED'
				: false;

			return (
				<div
					style={disable ? { pointerEvents: "none", opacity: "0.4" } : {}}
					key={actionIndex}
					onClick={(e) => {
						callActionClickHandler(e, actionIndex, index);
					}}
				>
					{component(item, index)}
				</div>
			);
		});
	};

	const renderActions = (item, index) => {
		// Render Nothing if Neither Action Buttons nor Menu Items Present
		if ((!actionButtons || actionButtons.length === 0) && (!actionMenuItems || actionMenuItems.length === 0))
			return null;

		return (
			<TableCell>
				<div className="flex justify-center">
					{renderActionButtons(item, index)}
					{/* {renderActionMenu(index)} */}
				</div>
			</TableCell>
		);
	};

	const renderTableBody = () => {
		console.log(page, 'page', rowsPerPage, 'rwosperpage')
		const initialIndex = (page - 1) * rowsPerPage;
		console.log(initialIndex, 'initialIndex')
		let finalIndex = page * rowsPerPage - 1;
		console.log(finalIndex, 'finalIndex')
		if (finalIndex >= items.length) {
			finalIndex = items.length - 1;
		}

		const tableRowList = [];

		for (let i = initialIndex; i <= finalIndex; i += 1) {
			tableRowList.push(
				<TableRow key={i} >
					{renderTableCells(items[i], i)}
					{renderActions(items[i], i)}
				</TableRow>
			);
		}

		return tableRowList;
	};
	console.log(renderTableBody().length, 'check length')
	return <TableBody>{renderTableBody()} </TableBody>;
};

EnhancedTableBody.propTypes = {
	role: PropTypes.string,
	paginationData: PropTypes.object,
	items: PropTypes.arrayOf(PropTypes.object),
	actionButtons: PropTypes.array
};

export default EnhancedTableBody;

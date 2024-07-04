import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Pagination from 'rc-pagination'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'

import getInventoryAggregateData from '../../../redux/actions/inventoryAggregateAction'
import NoResultFound from '../../../shared/components/NoResultFound'
import MMVDialog from './MMVQuantityDialog';

import localeInfo from 'rc-pagination/lib/locale/en_US'

const columns = [
	{label: 'Section', value:'section'},
	{label: 'Category', value: 'category'},
	{label: 'Part Name', value: 'sparePartName'},
	{label: 'Available Quantity', value: 'quantity'},
	{label: 'Warehouse', value: 'warehouseName'}
	];

const InventoryAggregateTable = (props) => {
	const dispatch = useDispatch();
	useEffect(() => {dispatch(getInventoryAggregateData())}, []);
	const liUnitData = useSelector(state => state.inventoryAggregate.data);
	const pageNum = useSelector(state => state.inventoryAggregate.pageNum);
	const totalPages = useSelector(state => state.inventoryAggregate.totalPages);
	const filter = useSelector(state => state.inventoryAggregate.filter);
	const searchText = useSelector(state => state.inventoryAggregate.searchText);

	const [isMMVDialogVisible, setDialogVisible] = useState(false);
	const [mmvDialogData, setData] = useState({});


	const handlePageChange = (selectedPage) => {
		const payload = {
      pageNum: selectedPage,
      filter,
      searchText,
      warehouseId: props.warehouseId.value,
      showUnavailable: props.showUnavailable
    };
		dispatch(getInventoryAggregateData(payload))
	}

	const mmvHandler = ({ data, isVisible }) => {
		return () => {
			// alert('MMV Clickedd');
			setDialogVisible(isVisible);
			setData(data);
		}
	}

	return(
		<div className="table-wraper">
			<MMVDialog isOpen={isMMVDialogVisible} data={mmvDialogData} onClose={mmvHandler({ data: [], isVisible: false })}/>
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
									columns.map((col, index) => {
										if (col.value === 'quantity') {
											return (
												<TableCell key={index}>
													<div
														onClick={mmvHandler({ data: rowData, isVisible: true })}
														style={{ fontWeight: '600', textDecoration: 'underline', cursor: 'pointer', color: '#70bbfd' }}
													>
														{rowData[col.value]}
													</div>
												</TableCell>
											);
										}

										return(
											<TableCell key={index}>
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
					Boolean(liUnitData.length)
					?
						<Pagination
							className='float-right'
							showSizeChanger={false}
							total={10 * totalPages}
							pageSize={10}
							current={pageNum}
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

export default InventoryAggregateTable;

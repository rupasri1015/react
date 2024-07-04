import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import getAllMMVs from '../../../redux/actions/MMVManagementAction'
import Pagination from 'rc-pagination'
import NoResultFound from '../../../shared/components/NoResultFound'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import AddNewMMV from './AddNewMMV'
import edit from '../../../shared/img/icons/edit-icon.svg'
import { PERMISSIONS, getRole } from '../../../core/services/rbacServices';

const columns = ['ID', 'Make Model Variant', 'From Year', 'To Year', ""];

const AddMMVTable = () => {
	const dispatch = useDispatch();
	useEffect(() => {dispatch(getAllMMVs())}, []);
	const allMMVData = useSelector(state => state.mmvManagement.data);
	const pageNum = useSelector(state => state.mmvManagement.pageNum);
	const totalPages = useSelector(state => state.mmvManagement.totalPages);
	const filter = useSelector(state => state.mmvManagement.filter);
	const searchText = useSelector(state => state.mmvManagement.searchText);
	const [openPopUp, setOpenPopUp] = useState(false);
	const [dataToEdit, setDataToEdit] = useState(null);

	const handlePageChange = (selectedPage) => {
		const payload = { pageNum: selectedPage, filter, searchText };
		dispatch(getAllMMVs(payload))
		
	}

	const handleEdit = (rowData) => {
		const title = rowData.manufacturer
			.concat(' ')
			.concat(rowData.model)
			.concat(' ')
			.concat(rowData.variant)
		rowData.title = title;
		setDataToEdit(rowData);
		setOpenPopUp(true);
	}

	const closePopUp = () => {
		setOpenPopUp(false);
	}
	
	return(
		<div className="table-wraper">
			{
				openPopUp
				? 
					<AddNewMMV
						hideButton
						open={openPopUp}
						closePopUp={closePopUp}
						data={dataToEdit}
						shouldEdit
					/>
				: null
			}
			
			<Table size="small">
			 	<TableHead>
	 				<TableRow>
	 					{
							columns.map((row, index) => (
								<TableCell
									key={index}
								>
									{row}
								</TableCell>
							))
						}
					</TableRow>
				</TableHead>
				<TableBody>
				{
					allMMVData.map((rowData, index) => {
						const mmvString = rowData.manufacturer
						? rowData.manufacturer
							.concat(' ')
							.concat(rowData.model)
							.concat(' ')
							.concat(rowData.variant)
						: ''
						return(
							<TableRow hover tabIndex={-1}  key={ index }>
								<TableCell>
									{rowData.id}
								</TableCell>
								<TableCell>
									{mmvString}
								</TableCell>
								<TableCell>
									{rowData.fromYear}
								</TableCell>
								<TableCell>
									{rowData.toYear}
								</TableCell>
								<TableCell>
								{
									PERMISSIONS.MMV_MANAGEMENT.includes(getRole())
									?
									<img
										src={edit}
										alt="Edit MMV"
										role="button"
										className="action-icon"
										onClick={() => handleEdit(rowData)}
									/>
									: null
								}
									
								</TableCell>
							</TableRow>
							)
					})
				}
				</TableBody>
			</Table>
			<div className="table-paginator">
				{
					Boolean(allMMVData.length) ?
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

export default AddMMVTable;
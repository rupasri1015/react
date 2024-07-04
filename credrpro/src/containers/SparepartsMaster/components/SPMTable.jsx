import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Pagination from 'rc-pagination';
import NoResultFound from '../../../shared/components/NoResultFound';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import edit from '../../../shared/img/icons/edit-icon.svg';
import getSPMData from '../../../redux/actions/sparePartsMasterAction';
import { PERMISSIONS, getRole } from '../../../core/services/rbacServices';

const columns = [
	{ id: 'id', label: 'Spare Part ID', },
	{ id: 'sparePartName', label: 'Spare Part Name' },
	{ id: 'section', label: 'Section', },
	{ id: 'category', label: 'Category', },
	{ id: 'hsn', label: 'HSN', },
	{ id: 'actions', label: '' }
];

class SPMTable extends Component {

  componentDidMount() {
    this.refreshData()
  }

  refreshData = () => {
    const { dispatch } = this.props;
    dispatch(getSPMData());
  }

  handlePageChange = (page) => {
    const { dispatch, filter, searchText } = this.props;
    dispatch(getSPMData({ pageNum: page, filter, searchText }))
  }

	render() {
    const { sparePartsMasterData, pageNum, totalPages, handleEdit } = this.props;
    return (
      <div className="table-wraper">
        <Table size="small">
          <TableHead>
            <TableRow>
              {
                columns.map(row => (
                  <TableCell
                    key={row.id}
                  >
                    {row.label}
                  </TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              Boolean(sparePartsMasterData.length) &&
              sparePartsMasterData.map((spmData, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={ index }>
                      {
												columns.map((column, index) => {
													return (
														column.id === 'actions'
														?
															<TableCell key={ index }>
                                {
                                  PERMISSIONS.SPAREPARTS_MASTER.includes(getRole())
                                  ?
                                    <img
                                      src={edit}
                                      alt="Edit Valuator"
                                      role="button"
                                      className="action-icon"
                                      onClick={() => handleEdit(spmData)}
                                    />
                                  : null
                                }
															</TableCell>
                            : column.id === 'sparePartFamilies'
                            ?
                              <TableCell key={ index }>
                                {
                                  spmData[column.id].length === 0
                                  ? 'No applicable families'
                                  : spmData[column.id].length === 1
                                  ? spmData[column.id][0].name
                                  : spmData[column.id][0].name
                                    .toString()
                                    .concat((spmData[column.id].length-1).toString())
                                }
                              </TableCell>
														:
															<TableCell key={ index }>
                                {spmData[column.id]}
															</TableCell>
													)
												})
											}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <div className="table-paginator">
          {
            Boolean(sparePartsMasterData.length) ?
              <Pagination
                className='float-right'
                showSizeChanger={false}
                total={10 * totalPages}
                pageSize={10}
                current={pageNum}
                locale={localeInfo}
                showQuickJumper
                onChange={this.handlePageChange}
              /> :
              <NoResultFound />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sparePartsMasterData: state.sparePartsMaster.data,
  message: state.sparePartsMaster.message,
  pageNum: state.sparePartsMaster.pageNum,
  filter: state.sparePartsMaster.filter,
  searchText: state.sparePartsMaster.searchText,
  totalPages: state.sparePartsMaster.totalPages
})

export default connect(mapStateToProps)(SPMTable)

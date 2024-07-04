import React, { Component } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import { connect } from 'react-redux'

const rows = [
    { id: 'City', label: 'City' },
    { id: 'Valuator', label: 'Valuator' },
    { id: 'assigned', label: 'Assigned', },
    { id: 'pending', label: 'Pending' },
    { id: 'inspected', label: 'Inspected' },
    { id: 'yettocall', label: 'Yet To Call' },
];

class ShowListTable extends Component {

    // componentDidMount() {
    //     const { dispatch, status } = this.props
    //     dispatch(getInventoryByStatusShd({ page: 1, status, isShdBike: true }))
    //   }

    //   componentWillUnmount() {
    //     const { dispatch } = this.props
    //     dispatch(resetInventoryByStatusShd())
    //   }

    //   componentDidUpdate(prevProps) {
    //     const { inventory, setStatus, isRegistrationSearch } = this.props
    //     if (!isEqual(inventory, prevProps.inventory)) {
    //       if (isRegistrationSearch && inventory && inventory.length === 1) {
    //         setStatus(inventory[0].status)
    //       }
    //     }
    //   }

    pageChange = (pageNumber) => {
        const { page, onPageChange } = this.props
        if (page !== pageNumber) {
            onPageChange(pageNumber)
        }
    }

    render() {
        return (
            <>
                <div className="table-wraper">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {
                                    rows.map(row => (
                                        <TableCell
                                            key={row.id}
                                        >
                                            {row.label}
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                    </Table>
                    <div className="table-paginator">
                        {
                            // Boolean(biddingListParameters.length) ?
                            <Pagination
                                className='float-right'
                                showSizeChanger={false}
                                //total={this.getCount()}
                                pageSize={10}
                                //current={pageNum}
                                locale={localeInfo}
                                onChange={this.handlePageChange}
                            />
                            //   :
                            //   <NoResultFound />
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default ShowListTable
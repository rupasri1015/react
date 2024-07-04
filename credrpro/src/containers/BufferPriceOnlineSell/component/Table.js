import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getBufferPriceOnline, resetBufferPriceOnline } from '../../../redux/actions/bufferPriceSellAction'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import ActionIcon from '../../../shared/img/icons/action-icon.svg'
import NoResultFound from '../../../shared/components/NoResultFound'
import { getDate, getAmount, getBikeName, getStatus, getMapedStatus, getFmEditPrice } from '../../../core/utility'
import BufferDataDialog from '../component/bufferDialog'
import viewEye from '../../../shared/img/icons/viewEye.svg'
import ImageDrawer from '../component/ImageDrawer'
import './dialog.scss'

const rows = [
  { id: 'requestedDate', label: 'Requested Date' },
  { id: 'leadId', label: 'LeadID' },
  { id: 'cityName', label: 'City' },
  { id: 'registrationNumber', label: 'Registration No.' },
  { id: 'mmvy', label: 'MMVY' },
  { id: 'cppPrice', label: 'CredR Proposed Price' },
  { id: 'refurbCost', label: 'Refurb Cost' },
  { id: 'cutomerExpectedPrice', label: 'Customer Expected Price' },
  { id: 'fmPrice', label: 'FM Price' },
  { id: 'leadStatus', label: 'Status' },
  { id: '', label: 'Vehicle Image' },
  { id: '', label: 'Actions' }
];

class BufferOnlineTable extends Component {

  state = {
    status: '',
    isOpen: false,
    rowData: {},
    drawerClass: 'table-drawer disable',
    drawerData: {}
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getBufferPriceOnline({ pageNumber: '1' }))
  }

  componentDidUpdate() {
    const { data, onStatusChange, isRegistrationSearch } = this.props
    if (isRegistrationSearch && data && data.length === 1) {
      onStatusChange(getMapedStatus(data[0].status))
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetBufferPriceOnline())
  }


  handlePageChange = (page) => {
    const { onPageChange } = this.props
    if (onPageChange) {
      this.setState({
        drawerClass: 'table-drawer disable'
      })
      onPageChange(page)
    }
  }

  viewSummary = data => {
    this.setState({
      isOpen: true,
      rowData: data
    })
  }

  onClose = () => {
    this.setState({
      isOpen: false
    })
  }

  handleDrawer = (bufferData) => {
    const { drawerClass } = this.state
    this.setState({
      drawerData: bufferData
    })
    if (drawerClass === 'table-drawer disable') {
      this.setState({
        drawerClass: 'table-drawer open'
      })
    }
    else {
      this.setState({
        drawerClass: 'table-drawer disable'
      })
    }
  }

  onCloseDrawer = () => {
    this.setState({
      drawerClass: 'table-drawer disable'
    })
  }

  render() {
    const { data, page, onEditPrice, onUpdateBuffer, count, open, leadStatus, onRefreshPage } = this.props
    const { isOpen, rowData, drawerClass, drawerData } = this.state
    return (
      <div className="table-container-buffer">
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
            <TableBody>
              {
                Boolean(data.length) &&
                data.map((bufferData, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={`${bufferData.auctionTransactionId}${index}`}>
                      <TableCell>
                        {getDate(bufferData.requestedDate)}
                      </TableCell>
                      <TableCell>
                        {bufferData.leadId}
                      </TableCell>
                      <TableCell>
                        {bufferData.cityName}
                      </TableCell>
                      <TableCell>
                        {bufferData.registrationNumber}
                      </TableCell>
                      <TableCell>
                        {bufferData.mmvy}
                      </TableCell>
                      <TableCell>
                        <p>{getAmount(bufferData.cppPrice)}</p>
                      </TableCell>
                      <TableCell>
                        {getAmount(bufferData.refurbCost)}
                      </TableCell>
                      <TableCell>
                        {getAmount(bufferData.cutomerExpectedPrice)}
                      </TableCell>
                      <TableCell>
                        {getFmEditPrice(bufferData.fmPrice)}
                        {/* {
                        Boolean(bufferData.fmPrice) &&
                        <img src={edit} alt="Edit FM Price" id={bufferData.leadId} role="button" className="action-icon ml-3" onClick={() => onUpdateBuffer(bufferData)} />
                      } */}
                      </TableCell>
                      <TableCell>
                        {bufferData.leadStatus}
                      </TableCell>
                      <TableCell>
                        <img src={viewEye} alt='viewIcon' style={{ width: '20px', cursor: 'pointer' }} onClick={() => this.handleDrawer(bufferData)} />
                      </TableCell>
                      <TableCell>
                        <button
                          className="btn-outline--small blue"
                          onClick={() => this.viewSummary(bufferData)}
                        >
                          View&nbsp;More
                    </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <div className="table-paginator">
            {
              Boolean(data.length) ?
                <Pagination
                  className='float-right'
                  // showSizeChanger={false}
                  total={count}
                  pageSize={10}
                  //current={page}
                  showQuickJumper
                  locale={localeInfo}
                  onChange={this.handlePageChange}
                />
                :
                <NoResultFound />
            }
          </div>
        </div>
        {
          <ImageDrawer
            drawer={Boolean(data.length) ? drawerClass : 'table-drawer disable'}
            drawerData={drawerData}
            onCloseDrawer={this.onCloseDrawer}
          />
        }
        {
          isOpen &&
          <BufferDataDialog
            open={isOpen}
            onClose={this.onClose}
            rowData={rowData}
            onRefreshPage={onRefreshPage}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  page: state.bufferPriceData.pageNumber,
  count: state.bufferPriceData.count,
  data: state.bufferPriceData.data,
  leadStatus: state.bufferPriceData.leadStatus
})

export default connect(mapStateToProps)(BufferOnlineTable)


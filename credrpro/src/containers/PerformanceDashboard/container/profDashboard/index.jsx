import React, { Component, Fragment } from 'react'
import ProfDashboardDataTable from '../../components/ProfDashboardDataTable'
import ProfDashboardFunnel from '../../components/ProfDashboardFunnel'
import { connect } from 'react-redux'
import ProfDashboardHeader from '../../components/ProfDashboardHeader'
import ModalBox from '../../components/Modal'
import Filters from '../../components/Filter'
import { conversionalData } from '../../../../redux/actions/conversionalFunnelAction'

const convertionalFunnelTable = [
  { id: 'leadCreatedAt', label: 'Lead Created Date', type: "date" },
  { id: 'exchangeCreatedAt', label: 'Exchange Date', type: "date" },
  { id: 'regNumber', label: 'Reg No' },
  { id: 'cityName', label: 'City', },
  { id: 'outletName', label: 'Outlet' },
  { id: 'valuatoreName', label: 'Valuator' },
  { id: 'leadStatus', label: 'Lead Status' },
  { id: 'vehicleStatus', label: 'Bike Status' },
  { id: 'voucherPrice', label: 'Voucher Price', type: "price" },
  { id: 'viewModal', label: 'Life Cycle', type: "viewModal" }
]

class ProfDashboard extends Component {

  state = {
    filter: {},
    status: 'conversionFunnel',
    open: false,
    setOpen: false,
    setClose: false,
    data:[]
  }

  handleApplyFilter = filter => {
    const { dispatch } = this.props
    this.setState({ filter }, () => {
      dispatch(conversionalData({ ...filter, pageNumber: 1 }))
    })
  }

  searchHandler = searchKeyWord => {
    const { dispatch } = this.props
    let payload = { pageNumber: 1 }
    if (searchKeyWord) {
      this.setState({ isClearFilter: true, filter: {} }, () => {
        window.scrollTo(0, 0)
        dispatch(conversionalData({ searchKeyWord, ...payload }))
      })
    }
  }

  handlePageChange = (pageNumber) => {
    const { dispatch } = this.props
    const { filter, status } = this.state
    let payload = { status, pageNumber }
    if (Object.keys(filter).length) {
      payload = { ...payload, ...filter }
    }
    window.scrollTo(0, 0)
    dispatch(conversionalData(payload))
  }

  

  handleClearFilter = () => {
    const { dispatch } = this.props
    this.setState({ filter: {} }, () => {
      dispatch(conversionalData())
    })
  }

  handleStatus = (status) => {
    this.setState({ status: status })
  };

  handleClose = () => {
    this.setState({setOpen: false})
  }

  handleClickOpen = (list) => {
    this.setState({ setOpen: true, data:list  })
  }

  render() {
    const { pageNumber } = this.props
    const { status } = this.state
    return (
      <Fragment>
        <h3>Conversion Funnel</h3>
        <ProfDashboardFunnel/>
        <ProfDashboardHeader
          status={status}
          onChangeStatus={this.handleStatus}
        />
        <Filters
          onApplyFilter={this.handleApplyFilter}
          onClearFilter={this.handleClearFilter}
          onSearch={this.searchHandler}
        />
        <ProfDashboardDataTable
          onStatusChange={this.changeStatus}
          status={status}
          columns={convertionalFunnelTable}
          pageNumber={pageNumber}
          onPageChange={this.handlePageChange}
          onOpen={this.handleClickOpen}
        />
        <ModalBox
          open={this.state.setOpen}
          onClose={this.handleClose}
          data={this.state.data}
        />
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  performanceDashboardList: state.conversionalFunnnel.fhdPerformanceResponse
})
export default connect(mapStateToProps)(ProfDashboard)
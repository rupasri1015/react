import React, { Component, Fragment } from 'react'
import ProfDashboardDataTable from '../../components/ProfDashboardDataTable'
import { connect } from 'react-redux'
import ProfDashboardHeader from '../../components/ProfDashboardHeader'
import ProfDashboardCircular from '../../components/circularStatus'
import Filters from '../../components/Filter'
import ModalBox from '../../components/Modal'
import { getComaSeparated } from '../../../../core/utility'
import { conversionalData } from '../../../../redux/actions/conversionalFunnelAction'

const tatTable = [
  { id: 'leadCreatedAt', label: 'Lead\u00a0Date', type:"date" },
  { id: 'exchangeCreatedAt', label: 'Exchange\u00a0Date', type:"date" },
  { id: 'regNumber', label: 'Reg No' },
  { id: 'pickUpDate', label: 'Pickup\u00a0Date', type:"date" },
  { id: 'warehouseDeliveryAt', label: 'Warehouse\u00a0Delivery\u00a0Date', type:"date" },
  { id: 'paymentDate', label: 'Payment\u00a0Date', type:"date" },
  { id: 'cityName', label: 'City' },
  { id: 'outletName', label: 'Outlet' },
  { id: 'valuatoreName', label: 'Valuator' },
  { id: 'leadStatus', label: 'Lead\u00a0Status' },
  { id: 'vehicleStatus', label: 'Bike\u00a0Location' },
  { id: 'voucherPrice', label: 'Voucher\u00a0Price', type:"price" },
  { id: 'viewModal', label: 'Life\u00a0Cycle', type:"viewModal" }
]

class TATDashboard extends Component {
state = {
    filter: {},
    status: 'TAT',
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

handleClearFilter = () => {
  const { dispatch } = this.props
  this.setState({ filter: {} }, () => {
      dispatch(conversionalData())
  })
}

handleClose = () => {
  this.setState({setOpen: false})
};

handleClickOpen = (list) => {
  this.setState({ setOpen: true, data:list  })
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
  

  render() {
    const {status} = this.state
    const {pageNumber, dataCount} = this.props    

    const TAT = [
      {value: `${dataCount.count ? getComaSeparated(dataCount.count): '0' }`, id:"1", fill: 'linear-gradient(to bottom, #43d6ab, #31c5a7 92%)', label: "Leads", type: "" },
      {value: `${dataCount.preApproveLeadCount ? getComaSeparated(dataCount.preApproveLeadCount) : '0'}`, id:"2", fill: 'linear-gradient(to bottom, #237ac7 0%, #1063ac 92%)', label: "Pre-Approvals", type: "" },
      {value: `${dataCount.totalExchangeCount ? getComaSeparated(dataCount.totalExchangeCount) : '0'}`, id:"3", fill: 'linear-gradient(to bottom, #d4b12e 0%, #ccab29 92%)', label: "Exchanges", type: "" },
      {value: `${dataCount.totalWharehouseDeliveredCount ? getComaSeparated(dataCount.totalWharehouseDeliveredCount) : '0'}`, id:"4", fill: 'linear-gradient(to bottom, #5f68cb 0%, #5f68cb 74%)', label: "Warehouse\u00a0Delivery", type: "" },
      {value: `${dataCount.totalRejectedCount ? getComaSeparated(dataCount.totalRejectedCount) : '0'}`, id:"5", fill: 'linear-gradient(to bottom, #f32b32 0%, #cc252b 74%)', label: "Rejected", type: "" }
    ]            

    return (
      <Fragment>
        <h3> TAT</h3>
        <ProfDashboardHeader
          status={status}
          onChangeStatus={this.handleStatus}
        />
        <Filters
          onApplyFilter={this.handleApplyFilter}
          onClearFilter={this.handleClearFilter}
          onSearch={this.searchHandler}
        />
        <ProfDashboardCircular
        data = {TAT}
        status = {status}
        />
        <ProfDashboardDataTable
          onStatusChange={this.changeStatus}
          status={status}
          columns={tatTable}
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
  dataCount: state.conversionalFunnnel.performanceDashoboardCount
})
export default connect(mapStateToProps)(TATDashboard)
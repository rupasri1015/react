import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import ProfDashboardHeader from '../../components/ProfDashboardHeader'
import ProfDashboardCircular from '../../components/circularStatus'
import ValuatorWiseTable from '../../components/valuatorWiseTable'
import Filters from '../../components/Filter'
import ModalBox from '../../components/Modal'
import { getAmount, getComaSeparated} from '../../../../core/utility'
import { valuatorProf } from '../../../../redux/actions/valuatorProfAction'

const valuatortable = [
  { id: 'leadCreatedAt', label: 'Lead\u00a0Date', type: "date" },
  { id: 'exchangeCreatedAt', label: 'Exchange\u00a0Date', type: "date" },
  { id: 'cityName', label: 'City' },
  { id: 'tm', label: 'TM' },
  { id: 'valuatoreName', label: 'Valuator' },
  { id: 'outletName', label: 'Outlet' },
  { id: 'mmv', label: 'MMV' },
  { id: 'mfgYear', label: 'Year' },
  { id: 'registrationNumber', label: 'Reg\u00a0No' },
  { id: 'voucherPrice', label: 'Voucher\u00a0Price', type: "price" },
  { id: 'vehicleStatus', label: 'Bike\u00a0Status' },
  { id: 'paymentStatus', label: 'Payment\u00a0Status' },
  { id: 'viewModal', label: 'Life\u00a0Cycle', type: "viewModal" }
]

class ValuatorWisePerformance extends Component {

  state = {
    filter: {},
    status: 'ValuatorPerformance',
    open: false,
    setOpen: false,
    setClose: false,
    data:[]
  }

  handleStatus = (status) => {

    this.setState({ status: status })
  };

  handleClose = () => {
    this.setState({
      setOpen: false
    });
  };
  handleClickOpen = (list) => {
    this.setState({ setOpen: true, data:list })
  }

  searchHandler = searchKeyWord => {
    const { dispatch } = this.props
    let payload = { pageNumber: 1 }
    if (searchKeyWord) {
      this.setState({ isClearFilter: true, filter: {} }, () => {
        window.scrollTo(0, 0)
        dispatch(valuatorProf({ searchKeyWord, ...payload }))
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
    dispatch(valuatorProf(payload))
  }

  handleApplyFilter = filter => {
    const { dispatch } = this.props
    this.setState({ filter }, () => {
        dispatch(valuatorProf({ ...filter, pageNumber: 1 }))
    })
}
handleClearFilter = () => {
    const { dispatch } = this.props
    this.setState({ filter: {} }, () => {
        dispatch(valuatorProf())
    })
}


  render() {
    const { status } = this.state
    const { pageNumber, dataCount } = this.props

    const valuatorWisePer = [
      {value: `${dataCount.count ? getComaSeparated(dataCount.count) : '0'}`, id:"1", fill: 'linear-gradient(to bottom, #43d6ab, #31c5a7 92%)', label: "Leads", type: "" },
      {value: `${dataCount.totalRejectedLeads ? getComaSeparated(dataCount.totalRejectedLeads) : '0'}`, id:"1", fill: 'linear-gradient(to bottom, #237ac7 0%, #1063ac 92%)', label: "Rejected Leads", type: "" },
      {value: `${dataCount.totalExchangesGenerated ? dataCount.totalExchangesGenerated : '0'}`, id:"1", fill: 'linear-gradient(to bottom, #d4b12e 0%, #ccab29 92%)', label: "Exchanges", type: "" },
      {value: `${dataCount.totalExchangesValue ? getAmount(dataCount.totalExchangesValue) : `\u20B90`}`, id:"1", fill: 'linear-gradient(to bottom, #5f68cb 0%, #5f68cb 74%)', label: "Exchange Value", type: "price" },
      {value: `${dataCount.totalLeewayValue ? getAmount(dataCount.totalLeewayValue) : `\u20B90`}`, id:"1", fill: 'linear-gradient(to bottom, #f32b32 0%, #cc252b 74%)', label: "Leeway Value", type: "price" },
      {value: `${dataCount.totalIncentive ? getAmount(dataCount.totalIncentive) : `\u20B90`}`, id:"1", fill: 'linear-gradient(to bottom, #4dbd74 0%, #169944 74%)', label: "Inecentive", type: "price" }
    ]

    return (
      <Fragment>
        <h3 className="mb-2">Valuator Wise Performance</h3>

        <ProfDashboardHeader
          status={status}
          onChangeStatus={this.handleStatus}
        />
        <Filters
          onApplyFilter={this.handleApplyFilter}
          onClearFilter={this.handleClearFilter}
          onSearch={this.searchHandler}
        ></Filters>
        
        <ProfDashboardCircular
          data={valuatorWisePer}
          status={status}
        ></ProfDashboardCircular>

        <ValuatorWiseTable
          onStatusChange={this.changeStatus}
          status={status}
          columns={valuatortable}
          pageNumber={pageNumber}
          onPageChange={this.handlePageChange}
          onOpen={this.handleClickOpen}
        />
        <ModalBox
          open={this.state.setOpen}
          onClose={this.handleClose}
          data={this.state.data}
        ></ModalBox>
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  dataCount: state.valuatorProfList.valuatorCount
})
export default connect(mapStateToProps)(ValuatorWisePerformance)
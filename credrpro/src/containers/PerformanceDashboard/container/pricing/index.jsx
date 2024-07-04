import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import ProfDashboardHeader from '../../components/ProfDashboardHeader'
import PricingTable from '../../components/pricingTable'
import Filters from '../../components/Filter'
import ModalBox from '../../components/Modal'
import PricingFilter from '../../components/PricingFilter'
import { pricingData } from '../../../../redux/actions/pdPricingAction'
import { getComaSeparated } from '../../../../core/utility'

const pricingTableData = [
  { id: 'leadCreatedAt', label: 'Lead\u00A0Date', type: "date" },
  { id: 'exchangeCreatedAt', label: 'Exchange\u00A0Date', type: "date" },
  { id: 'regNo', label: 'Reg No' },
  { id: 'mfgYear', label: 'MMV Year' },
  { id: 'voucherPrice', label: 'Voucher Price', type: "price" },
  { id: 'highestBid', label: 'Highest Bid', type: "price" },
  { id: 'cppMin', label: 'CPP\u00A0Min', type: "price" },
  { id: 'cppMax', label: 'CPP\u00A0Max', type: "price" },
  { id: 'pricingSaving', label: 'Pricing\u00A0Saving', type: "price" },
  { id: 'credrCommision', label: 'CredR\u00A0Commission', type: "price" },
  { id: 'fhdIncentive', label: 'FHD\u00A0Incentive', type: "price" },
  { id: 'valuatorIncentive', label: 'Valuator\u00A0Incentive', type: "price" },
  { id: 'totalLeeway', label: 'Total\u00A0Leeway', type: "price" },
  { id: 'cityName', label: 'City' },
  { id: 'outletName', label: 'Outlet' },
  { id: 'valuatorName', label: 'Valuator' },
  { id: 'vehicleStatus', label: 'Lead\u00a0status' },
  { id: 'viewModal', label: 'Life\u00a0Cycle', type: "viewModal" }
]

class PricingDashboard extends Component {

  state = {
    filter: {},
    status: 'pricing',
    open: false,
    setOpen: false,
    setClose: false,
    priceStatus: null,
    data:[],
    rangePrice: null,
    appliedRange: ''
  } 

  handleStatus = (status) => {
    this.setState({ status: status })
  }

  handlePricing = (status) => {  
    const { dispatch } = this.props
    const { filter } = this.state
    let payload = {}
    let priceStatus = {}
    if(status){
      if(status === '1000 +')
      priceStatus = status.substr(0,4)
      else
      priceStatus = status
    }
    let isValid = true
    this.setState({rangePrice: priceStatus})
    if(Object.keys(filter).length){
      payload = { ...filter, priceRange: priceStatus, pageNumber: 1 }
    }
    else
    payload = { priceRange: priceStatus, pageNumber: 1 }
    if (isValid) { 
      this.setState({appliedRange: status})
      dispatch(pricingData({ ...payload }))
    }
  }

  handleClose = () => {
    this.setState({ setOpen: false })
  }

  searchHandler = searchKeyWord => {
    const { dispatch } = this.props
    let payload = { pageNumber: 1 }
    if (searchKeyWord) {
      this.setState({ isClearFilter: true, filter: {} }, () => {
        window.scrollTo(0, 0)
        dispatch(pricingData({ searchKeyWord, ...payload }))
      })
    }
  }

  handleClickOpen = (list) => {
    this.setState({ setOpen: true, data:list })
  }

  handleApplyFilter = filter => {
    const { dispatch } = this.props
    this.setState({ filter }, () => {
        dispatch(pricingData({ ...filter, pageNumber: 1 }))
    })
  }

  handleClearFilter = () => {
    const { dispatch } = this.props
    this.setState({ filter: {}, appliedRange: '' }, () => {
        dispatch(pricingData({ pageNumber: 1 }))
    })
  }

  handlePageChange = (pageNumber) => {
    const { dispatch } = this.props
    const { filter, status, rangePrice } = this.state
    let payload = {}
    if(rangePrice){
      if (Object.keys(filter).length) {
        payload = { ...filter, priceRange: rangePrice, pageNumber  }
      }
      else{
        payload = { priceRange: rangePrice, pageNumber }
      }
    }
    else{
      if (Object.keys(filter).length) {
        payload = { status, ...filter, pageNumber }
      }
      else
      payload = { status, pageNumber }
    }
    window.scrollTo(0, 0)
    dispatch(pricingData(payload))
  }

  render() {

    const { status, priceStatus, appliedRange } = this.state
    const { pageNumber, lessThanZeroCount, zeroTo500Count, fiveHundredTO1000Count, above1K, otherCount } = this.props

    const pricing = [
      {value: `${lessThanZeroCount ? getComaSeparated(lessThanZeroCount) : '0' }`, id:"1", fill: 'linear-gradient(to bottom, #43d6ab, #31c5a7 92%)', label:"Below 0", type: "price"},
      {value: `${zeroTo500Count ? getComaSeparated(zeroTo500Count) : '0'}`, id:"2", fill: 'linear-gradient(to bottom, #237ac7 0%, #1063ac 92%)', label: "0 to 500", type: "price" },
      {value: `${fiveHundredTO1000Count ? getComaSeparated(fiveHundredTO1000Count) : '0'}`, id:"3", fill: 'linear-gradient(to bottom, #d4b12e 0%, #ccab29 92%)', label: "500 to 1000", type: "price"},
      {value: `${above1K ? getComaSeparated(above1K) : '0'}`, id:"4", fill: 'linear-gradient(to bottom, #5f68cb 0%, #5f68cb 74%)', label: "1000 +", type: "price" },
      {value: `${otherCount ? getComaSeparated(otherCount) : '0'}`, id:"5", fill: 'linear-gradient(to bottom, #12791F 0%, #12791F 74%)', label: "Not in CPP", type: "price" }
    ]            

    return (
      <Fragment>
        <h3 className="mb-2"> Pricing</h3>
        <ProfDashboardHeader
          status={status}
          onChangeStatus={this.handleStatus}
        />
        <Filters
          onApplyFilter={this.handleApplyFilter}
          onClearFilter={this.handleClearFilter}
          onSearch={this.searchHandler}
        />
        <h3> Pricing Filter</h3>
          <PricingFilter
          data = {pricing}
          onPricingChange={this.handlePricing}
          pricingStatus={priceStatus != null ? priceStatus : ""}
        />
        <PricingTable
          onStatusChange={this.changeStatus}
          status={status}
          columns={pricingTableData}
          pageNumber={pageNumber}
          onPageChange={this.handlePageChange}
          onOpen={this.handleClickOpen}
          appliedRange={appliedRange}
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
  vehicleData: state.vehicle.vehicleStatus,
  lessThanZeroCount: state.pdPricingResult.allCounts.lessThanZero,
  zeroTo500Count: state.pdPricingResult.allCounts.zero_to_500,
  fiveHundredTO1000Count: state.pdPricingResult.allCounts.five_to_1000,
  above1K: state.pdPricingResult.allCounts.moreThan1k,
  otherCount: state.pdPricingResult.allCounts.otherCount
})
export default connect(mapStateToProps)(PricingDashboard)
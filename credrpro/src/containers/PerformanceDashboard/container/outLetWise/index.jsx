import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import ProfDashboardHeader from '../../components/ProfDashboardHeader'
import ProfDashboardCircular from '../../components/circularStatus'
import OutletWiseTable from '../../components/outletWiseTable'
import Filters from '../../components/Filter'
import ModalBox from '../../components/Modal'
import { getAmount, getComaSeparated} from '../../../../core/utility'
import { outletProf } from '../../../../redux/actions/outletProfAction'

const outletTable = [
  { id: 'leadCreatedAt', label: 'Lead\u00a0Date', type:"date" },
  { id: 'exchangeCreatedAt', label: 'Exchange\u00a0Date', type:"date" },
  { id: 'cityName', label: 'City' },
  { id: 'outletName', label: 'Outlet' },
  { id: 'mmv', label: 'MMV' },
  { id: 'mfgYear', label: 'Year' },
  { id: 'regNo', label: 'Reg\u00a0No' },
  { id: 'voucherPrice', label: 'Voucher\u00a0Price', type:"price" },
  { id: 'valuatorName', label: 'Valuator' },
  { id: 'vehicleStatus', label: 'Bike\u00a0Status' },
  { id: 'paymentStatus', label: 'Payment\u00a0Status' },
  { id: 'viewModal', label: 'Life\u00a0Cycle', type:"viewModal" }
]

class OutletWisePerformance extends Component {

  state = {
    filter: {},
    status: 'OutletWisePerformance',
    open: false,
    setOpen: false,
    setClose: false,
    data:[]
  }

  searchHandler = searchKeyWord => {
    const { dispatch } = this.props
    let payload = { pageNumber: 1 }
    if (searchKeyWord) {
      this.setState({ isClearFilter: true, filter: {} }, () => {
        window.scrollTo(0, 0)
        dispatch(outletProf({ searchKeyWord, ...payload }))
      })
    }
  }

  handleApplyFilter = filter => {
    const { dispatch } = this.props
    this.setState({ filter }, () => {
        dispatch(outletProf({ ...filter, pageNumber: 1 }))
    })
  }

  handleClearFilter = () => {
    const { dispatch } = this.props
    this.setState({ filter: {},  }, () => {
      window.scrollTo(0, 0)
        dispatch(outletProf({ pageNumber: 1 }))
    })
  }

  handleStatus = (status) => {
    this.setState({ status: status})
}

  handleClose = () => {
  this.setState({
      setOpen: false
  });
}

  handleClickOpen = (list) => {
      this.setState({ setOpen: true, data:list})
  }

  handlePageChange = (pageNumber) => {
    const { dispatch } = this.props
    const { filter, status } = this.state
    let payload = { status, pageNumber }
    if (Object.keys(filter).length) {
      payload = { ...payload, ...filter }
    }
    window.scrollTo(0, 0)
    dispatch(outletProf(payload))
  }

  render() {
    const { status } = this.state
    const { pageNumber, dataCount} = this.props

    const outletWisePer = [
      {value: `${dataCount.count ? getComaSeparated(dataCount.count): '0' }`, id:"1", fill: 'linear-gradient(to bottom, #43d6ab, #31c5a7 92%)', label: "Leads", type: "" },
      {value: `${dataCount.totalFhdIncentive ? getAmount(dataCount.totalFhdIncentive) : `\u20B90`}`, id:"2", fill: 'linear-gradient(to bottom, #237ac7 0%, #1063ac 92%)', label: "Fhd Commission", type: "price" },
      {value: `${dataCount.totalExchanges ? getComaSeparated(dataCount.totalExchanges) : '0'}`, id:"3", fill: 'linear-gradient(to bottom, #d4b12e 0%, #ccab29 92%)', label: "Exchanges", type: "price" },
      {value: `${dataCount.totalExchangesValue ? getAmount(dataCount.totalExchangesValue) : `\u20B90`}`, id:"4", fill: 'linear-gradient(to bottom, #5f68cb 0%, #5f68cb 74%)', label: "Exchange Value", type: "price" },
      {value: `${dataCount.totalRevenueToCredr ? getAmount(dataCount.totalRevenueToCredr) : `\u20B90`}`, id:"5", fill: 'linear-gradient(to bottom, #f32b32 0%, #cc252b 74%)', label: "Revenue", type: "price" }
    ]
  
    return (
      <Fragment>
        <h3 className="mb-2"> Outlet Wise Performance</h3>
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
        data = {outletWisePer}
        status = {status}
        />
        <OutletWiseTable
          onStatusChange={this.changeStatus}
          status={status}
          columns={outletTable}
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
  dataCount: state.outlProfList.outletProfCount
})
export default connect(mapStateToProps)(OutletWisePerformance)
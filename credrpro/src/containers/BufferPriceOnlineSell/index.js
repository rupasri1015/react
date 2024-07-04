import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { showLoader, hideLoader } from '../../redux/actions/loaderAction'
import { setNotification } from '../../redux/actions/notificationAction'
import BufferOnlineFilters from './component/Filter'
import BufferOnlineTable from './component/Table'
import isEqual from 'lodash/isEqual'
import { getBufferPriceOnline } from '../../redux/actions/bufferPriceSellAction'
import { saveFMPrice } from '../../core/services/bufferSellServices'
import Checkbox from '@material-ui/core/Checkbox'
import { Card, CardBody } from 'reactstrap'
import SearchField from '../../shared/components/form/Search'
import { isRegistrationNumber, getDate, getAmount } from '../../core/utility'
import BufferDataTable from './component/bufferDataTable'

class BufferPriceOnlineSell extends Component {

  state = {
    filters: {},
    isModalOpen: false,
    data: {},
    inventoryId: null,
    enhancedImages: [],
    isRegistrationSearch: false,
    openReject: false,
    searchText: '',
    isClearFilter: false,
    formOpen: false,
    title: null,
    description: null,
    universalCheck: false,
    bufferPrice: null,
    priceData: {},
    isOpen: false,
    columns: [],
    leadStatus: 'EXCHANGE',
  }

  componentDidMount() {
    const { leadStatus } = this.props
    let statusLists = leadStatus.map(status => {
      return {
        value: status,
        label: status
      }
    })
    this.setState({
      statusList: statusLists
    })
  }

  applyFilter = (filters) => {
    const { filters: prevFilters, leadStatus } = this.state
    const { dispatch } = this.props
    if (!isEqual(prevFilters, filters)) {
      this.setState({ filters, searchText: '' }, () => {
        window.scrollTo(0, 0)
        dispatch(getBufferPriceOnline({ ...filters, pageNumber: '1' }))
      })
    }
  }

  handlePageChange = (page) => {
    const { dispatch } = this.props
    const { filters, leadStatus } = this.state
    let payload = {}
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters, pageNumber: `${page}` }
    } else {
      payload = { ...payload, pageNumber: `${page}` }
    }
    window.scrollTo(0, 0)
    dispatch(getBufferPriceOnline(payload))
  }

  clearFilters = () => {
    const { filters: prevFilters } = this.state
    const { dispatch } = this.props
    if (Object.keys(prevFilters).length) {
      this.setState({ filters: {} }, () => {
        window.scrollTo(0, 0)
        dispatch(getBufferPriceOnline({ pageNumber: '1' }))
      })
    }
  }

  handleClearFilter = () => {
    this.setState({ searchText: '', universalCheck: false })
    if (this.state.filters.regNum) {
      this.clearFilters()
    }
  }

  handleSearch = () => {
    if (this.state.searchText) {
      this.applySearch({ regNum: this.state.searchText })
    }
  }

  applySearch = (filters) => {
    const { universalCheck } = this.state
    const { dispatch } = this.props
    const state = { filters }
    if (filters.regNum && isRegistrationNumber(filters.regNum.toUpperCase())) {
      state.isRegistrationSearch = true
    }
    this.setState(state, () => {
      window.scrollTo(0, 0)
      if (universalCheck === true) {
        if (filters.regNum.length >= 6) {
          dispatch(getBufferPriceOnline({ ...filters, pageNumber: '1', isUniversalSearch: true }))
        }
        else {
          dispatch(setNotification('danger', 'Please Enter Correct Registration Number'))
        }
      }
      else {
        dispatch(getBufferPriceOnline({ ...filters, pageNumber: '1' }))
      }
    })
  }

  refreshData = () => {
    const { filters, leadStatus } = this.state
    const { pageNumber, dispatch } = this.props
    dispatch(getBufferPriceOnline({ ...filters, leadStatus, pageNumber }))
  }

  searchHandler = regNum => {
    const { dispatch } = this.props
    if (regNum) {
      this.setState({ isRegistrationSearch: true, isClearFilter: true, filters: {} }, () => {
        dispatch(getBufferPriceOnline({ pageNumber: '1', regNum }))
      })
    }
  }

  onSearchTypeHandler = searchText => {
    this.setState({ searchText })
  }


  clearRegistrationInput = () => {
    const { leadStatus } = this.state
    this.props.dispatch(getBufferPriceOnline({ pageNumber: '1', leadStatus }))
    this.setState({ searchText: '' })
  }

  handleFmPrice = bufferPrice => {
    const { dispatch } = this.props
    const { isOpen } = this.state
    dispatch(showLoader())
    saveFMPrice(bufferPrice)
      .then(apiResaponse => {
        if (apiResaponse.isValid) {
          this.setState({
            isOpen: false,
            title: 'Edit Price',
            description: `Re-enter the price for `,
            bufferPrice
          })
          dispatch(hideLoader())
        }
      })

  }

  closeForm = () => {
    this.setState({
      formOpen: false,
    })
  }

  handleChange = (e) => {
    this.setState({
      universalCheck: e.target.checked
    })
  }

  showSummary = (bufferData) => {
    const summaryData = {
      ...bufferData,
      cutomerExpectedPrice: getAmount(bufferData.cutomerExpectedPrice),
      //refurbDeductions: getAmount(bufferData.refurbDeductions),
      cppPrice: getAmount(bufferData.cppPrice),
      cfpPrice: getAmount(bufferData.cfpPrice),
      fmPrice: getAmount(bufferData.fmPrice)
    }
    const columns = [
      { id: 'mmvy', label: 'MMVY' },
      { id: 'cppPrice', label: 'CredR Proposed Price' },
      { id: 'refurbDeductions', label: 'Refurb Deductions' },
      { id: 'cfpPrice', label: 'CFP' },
      { id: 'comments', label: 'Comments' },
      { id: 'cutomerExpectedPrice', label: 'Customer Expected Price' },
      { id: 'fmPrice', label: 'FM Price', },
    ]
    this.setState({
      data: summaryData,
      columns,
      priceData: bufferData,
      title: 'Summary',
      isOpen: true,
    })
  }

  handleBufferForm = (formData) => {
    this.setState({ formOpen: true, priceData: formData })
  }

  closeDialog = () => {
    this.setState({
      isOpen: false,
      columns: [],
      data: null
    })
  }

  changeBufferStatus = status => {
    const { leadStatus } = this.setState
    if (leadStatus === 'ALL')
      this.setState({
        leadStatus: leadStatus
      })
    else
      this.setState({
        leadStatus: status
      })
    //setIsRegistrationSearch(false)
  }

  onRefreshPage = () => {
    this.props.dispatch(getBufferPriceOnline({ pageNumber: '1' }))
  }

  render() {
    const {
      data,
      isRegistrationSearch,
      open,
      searchText,
      filters,
      isClearFilter,
      status,
      formOpen,
      title,
      description,
      universalCheck,
      bufferPrice,
      priceData,
      isOpen,
      columns,
      leadStatus,
    } = this.state
    let statusLists = this.props.leadStatus.map(status => {
      return {
        value: status,
        label: status
      }
    })
    return (
      <>
        <h3> Buffer Online Sell </h3>
        <BufferOnlineFilters
          status={leadStatus}
          onApplyFilter={this.applyFilter}
          onClearFilters={this.clearFilters}
          isRegistrationSearch={isRegistrationSearch}
          filters={filters}
          isClearFilter={isClearFilter}
          setClearFilter={() => this.setState({ isClearFilter: false })}
          statusLists={statusLists}
        />
        <BufferOnlineTable
          leadStatus={leadStatus}
          onSetStatus={this.changeBufferStatus}
          onPageChange={this.handlePageChange}
          onViewSummary={this.showSummary}
          onUpdateBuffer={this.handleBufferForm}
          onRefreshPage={this.onRefreshPage}
        />
        {/* {
          formOpen && <FMprice
            priceData={priceData}
            open={formOpen}
            onClose={this.closeForm}
            bufferPrice={bufferPrice}
            onSubmitForm={this.handleFmPrice}
          />
        } */}
        {
          isOpen && <BufferDataTable
            priceData={priceData}
            bufferPrice={bufferPrice}
            isOpen={isOpen}
            columns={columns}
            data={data}
            onUpdateBuffer={this.handleBufferForm}
            onClose={this.closeDialog}
            onSubmitForm={this.handleFmPrice}
          />
        }
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  page: state.bufferPriceData.pageNumber,
  leadStatus: state.bufferPriceData.leadStatus
})

export default connect(mapStateToProps)(BufferPriceOnlineSell)

// export default connect(state => ({ pageNumber: state.bufferPriceData.pageNumber }))(BufferPriceOnlineSell)
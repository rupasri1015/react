import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import InventoryFilters from './components/Filters'
import InventoryDataTable from './components/DataTable'
import isEqual from 'lodash/isEqual'
import { getInventoryByStatusShd } from '../../../redux/actions/listinventoryShdAction'
import { getInventoryImages, getEnhancedImages, uplpoadEnhancedImages, getInventoryImagesZip, deleteBikeImage } from '../../../core/services/inventoryServices'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { setNotification } from '../../../redux/actions/notificationAction'
import AcceptDialog from './components/Dialogs/AcceptDialog'
import RejectDialog from './components/Dialogs/RejectDialog'
import VehicleDetails from './components/Dialogs/VehicleDetails'
import { saveAs } from 'file-saver'
import { publishShdBike } from '../../../core/services/inventoryServices'


class AcceptRejectInvetory extends Component {

  state = {
    filters: {},
    isModalOpen: false,
    data: {},
    inventoryId: null,
    enhancedImages: [],
    isRegistrationSearch: false,
    open: false,
    inventoryData: null,
    status: 'PENDING_APPROVAL',
    openReject: false,
    searchText: '',
    isClearFilter: false,
    shdData: {},
    pageNumber: ''
  }

  applyFilter = (filters) => {
    const { filters: prevFilters, status } = this.state
    this.setState({ filters })
    const { dispatch } = this.props
    if (!isEqual(prevFilters, filters)) {
      this.setState({ filters, searchText: '' }, () => {
        window.scrollTo(0, 0)
        dispatch(getInventoryByStatusShd({ ...filters, page: 1, status, isShdBike: true }))
      })
    }
  }

  handlePageChange = (page) => {
    this.setState({ pageNumber: page })
    const { dispatch } = this.props
    const { filters, status } = this.state
    let payload = { status }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters, page, isShdBike: true }
    } else {
      payload = { ...payload, page, isShdBike: true }
    }
    window.scrollTo(0, 0)
    dispatch(getInventoryByStatusShd(payload))
  }

  clearFilters = () => {
    const { filters: prevFilters, status } = this.state
    const { dispatch } = this.props
    if (Object.keys(prevFilters).length) {
      this.setState({ filters: {} }, () => {
        window.scrollTo(0, 0)
        dispatch(getInventoryByStatusShd({ status, page: 1, isShdBike: true }))
      })
    }
  }

  refreshData = () => {
    const { filters, status, pageNumber } = this.state
    const { page, dispatch } = this.props
    dispatch(getInventoryByStatusShd({ ...filters, status, page: pageNumber, isShdBike: true }))
  }

  showDetails = async list => {
    this.setState({ shdData: list })
    const { dispatch } = this.props
    dispatch(showLoader())
    this.setState({ inventoryId: list.id })
    const inventoryImages = await getInventoryImages(list.id)
    if (inventoryImages.isValid) {
      this.setState({ data: inventoryImages.vehicalImagesAndDocumentsRes })
    } else {
      this.setState({ data: {} })
      const { message } = inventoryImages
      dispatch(setNotification('danger', 'No Records', message))
    }
    const enhancedImages = await getEnhancedImages(list.id)
    if (enhancedImages.isValid) {
      this.setState({ enhancedImages: enhancedImages.bikeUrls })
    } else {
      this.setState({ enhancedImages: [] })
    }
    dispatch(hideLoader())
    this.toggleModal()
  }

  handleStatusChange = status => {
    if(status === 'ACCEPTED'){
      status = 'PUBLISHED'
    }
    this.setState({ pageNumber: 1 })
    const { filters, searchText } = this.state
    const { dispatch } = this.props
    let payload = { status, page: 1, isShdBike: true }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    if (searchText) {
      let payload = { status, page: 1, isShdBike: true, regNum: searchText }
      this.setState({ status }, () => {
        window.scrollTo(0, 0)
        dispatch(getInventoryByStatusShd(payload))
      })
    }
    else {
      let payload = { status, page: 1, isShdBike: true , ...filters}
      this.setState({ status, searchText: '' }, () => {
        window.scrollTo(0, 0)
        dispatch(getInventoryByStatusShd(payload))
      })
    }
  }

  toggleModal = () => {
    const { isModalOpen } = this.state
    this.setState({ isModalOpen: !isModalOpen })
  }

  searchHandler = regNum => {
    const { status } = this.state
    const { dispatch } = this.props
    const searchREgex = /^[a-z0-9]+$/i
    // if ( searchREgex.test(regNum) && (regNum.length === 12 || regNum.length === 10)) {
      this.setState({ isRegistrationSearch: true, isClearFilter: true, filters: {} }, () => {
        dispatch(getInventoryByStatusShd({ page: 1, regNum, isShdBike: true, status }))
      })
    // }
    // else {
    //   dispatch(setNotification('danger', 'Error', 'Please Enter Valid Registration Number'))
    // }
  }

  acceptInventory = acceptData => {
    this.setState({
      inventoryData: acceptData,
      open: true
    })
  }

  rejectInventory = rejectData => {
    this.setState({
      inventoryData: rejectData,
      openReject: true
    })
  }

  closeAcceptDialog = () => {
    this.setState({
      open: false,
      inventoryData: null
    })
  }

  closeRejectDialog = () => {
    this.setState({
      openReject: false,
      inventoryData: null
    })
  }

  setStatus = status => {
    this.setState({ status, isRegistrationSearch: false })
  }

  onSearchTypeHandler = searchText => {
    this.setState({ searchText })
  }


  clearRegistrationInput = () => {
    const { status } = this.state
    this.props.dispatch(getInventoryByStatusShd({ page: 1, status, isShdBike: true }))
    this.setState({ searchText: '' })
  }

  handleImageUpload = async files => {
    const { dispatch } = this.props
    const { inventoryId } = this.state
    dispatch(showLoader())
    const formData = new FormData()
    files.forEach(file => {
      formData.append('file', file)
    })
    const uploadResponse = await uplpoadEnhancedImages(formData, inventoryId)
    if (!uploadResponse.isValid) {
      const { message } = uploadResponse
      dispatch(setNotification('danger', 'Upload Error', message))
    }
    if (uploadResponse.isValid) {
      const enhancedImages = await getEnhancedImages(inventoryId)
      if (enhancedImages.isValid) {
        this.setState({ enhancedImages: enhancedImages.bikeUrls })
      } else {
        this.setState({ enhancedImages: [] })
      }
    }
    dispatch(hideLoader())
  }

  handleDownloadZip = () => {
    const { dispatch } = this.props
    const { inventoryId } = this.state
    dispatch(showLoader())
    getInventoryImagesZip(inventoryId)
      .then(apiResponse => {
        if (apiResponse) {
          saveAs(apiResponse, `${inventoryId}-Compresed-images.zip`)
        } else {
          dispatch(setNotification('danger', 'Download Error', 'File Nout Found'))
        }
        dispatch(hideLoader())
      })
  }

  handleImageDelete = imageId => {
    const { dispatch } = this.props
    dispatch(showLoader())
    deleteBikeImage(imageId)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState({
            enhancedImages: this.state.enhancedImages.filter(image => image.imageId !== imageId)
          })
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  publishShdBike = (payload) => {
    const { filters, status, shdData, pageNumber } = this.state
    payload.gatepassId = shdData.registrationNumber
    //payload.storeId = shdData.storeId
    payload.inspectedBikeDetailId = shdData.id
    const { dispatch } = this.props
    publishShdBike(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState({ isModalOpen: false })
          dispatch(getInventoryByStatusShd({ ...filters, page: pageNumber, status, isShdBike: true }))
          dispatch(setNotification('success', 'Success', apiResponse.message))
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  render() {
    const {
      isModalOpen,
      data,
      isRegistrationSearch,
      open,
      inventoryData,
      openReject,
      searchText,
      filters,
      isClearFilter,
      status,
      enhancedImages
    } = this.state
    return (
      <Fragment>
        <h3> Accept Inventory Details - SHD </h3>
        <InventoryFilters
          onApplyFilter={this.applyFilter}
          onClearFilters={this.clearFilters}
          isRegistrationSearch={isRegistrationSearch}
          filters={filters}
          isClearFilter={isClearFilter}
          setClearFilter={() => this.setState({ isClearFilter: false })}
        />
        <InventoryDataTable
          status={status}
          setStatus={this.setStatus}
          onStatusUpdate={this.handleStatusChange}
          onSearch={this.searchHandler}
          searchText={searchText}
          onSearchType={this.onSearchTypeHandler}
          onPageChange={this.handlePageChange}
          onShowDetails={this.showDetails}
          isRegistrationSearch={isRegistrationSearch}
          onAcceptInventory={this.acceptInventory}
          onRejectInventory={this.rejectInventory}
          onClearRegistrationSearch={this.clearRegistrationInput}
          onRefreshPage={this.refreshData}
        />
        {
          open && <AcceptDialog
            open={open}
            data={inventoryData}
            onClose={this.closeAcceptDialog}
            onRefreshPage={this.refreshData}
          />
        }
        {
          openReject && <RejectDialog
            open={openReject}
            data={inventoryData}
            onClose={this.closeRejectDialog}
            onRefreshPage={this.refreshData}
          />
        }
        <VehicleDetails
          isModalOpen={isModalOpen}
          bikeDetails={data}
          onClose={this.toggleModal}
          enhancedImages={enhancedImages}
          onImageUpload={this.handleImageUpload}
          onImageDownload={this.handleDownloadZip}
          onImageDelete={this.handleImageDelete}
          data={data}
          onPublish={this.publishShdBike}
        />
      </Fragment>
    )
  }
}

export default connect(state => ({ page: state.inventory.page }))(AcceptRejectInvetory)

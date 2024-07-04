import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { getInventoryByStatusShd } from '../../../redux/actions/listinventoryShdAction'
import InventoryFilters from './components/Filters'
import InventoryDataTable from './components/DataTable'
import isEqual from 'lodash/isEqual'
import { getInventoryByStatus } from '../../../redux/actions/publishInventoryAction'
import PublishForm from './components/Forms'
import UnpublishDialog from './components/Dialogs/UnpublishInventory'
import VehicleDetails from './components/Dialogs/VehicleDetails'
import { getInventoryImages, getEnhancedImages, uplpoadEnhancedImages, getInventoryImagesZip, deleteBikeImage, updateInventory } from '../../../core/services/inventoryServices'
import { listStores } from '../../../core/services/miscServices'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { setNotification } from '../../../redux/actions/notificationAction'
import { getDatePayload } from '../../../core/utility'
import { saveAs } from 'file-saver'

class PublishInventorySHD extends Component {

  state = {
    filters: {},
    formOpen: false,
    unPublishOpen: false,
    title: null,
    description: null,
    isModalOpen: false,
    inventory: null,
    stores: null,
    searchText: '',
    data: {},
    enhancedImages: [],
    isRegistrationSearch: false,
    isClearFilter: false,
    status: 'PUBLISHED'
  }

  applyFilter = (filters) => {
    const { filters: prevFilters, status } = this.state
    const { dispatch } = this.props
    if (!isEqual(prevFilters, filters)) {
      this.setState({ filters, searchText: '' }, () => {
        window.scrollTo(0, 0)
        dispatch(getInventoryByStatusShd({ ...filters, page: 1, status, isShdBike: true }))
      })
    }
  }

  handlePageChange = (page) => {
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

  handleStatusChange = status => {
    const { filters } = this.state
    const { dispatch } = this.props
    let payload = { status, page: 1, isShdBike: true }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    this.setState({ status, searchText: '' }, () => {
      window.scrollTo(0, 0)
      dispatch(getInventoryByStatusShd(payload))
    })
  }

  publishInventory = inventory => {
    const { dispatch } = this.props
    dispatch(showLoader())
    listStores(inventory.cityId)
      .then(apiResaponse => {
        if (apiResaponse.isValid) {
          this.setState({
            formOpen: true,
            title: "Publish Inventory",
            description: `Enter price to publish ${inventory.registrationNumber}`,
            inventory,
            stores: apiResaponse.storeListByCityId
          })
          dispatch(hideLoader())
        }
      })
  }

  editPrice = inventory => {
    const { dispatch } = this.props
    dispatch(showLoader())
    listStores(inventory.cityId)
      .then(apiResaponse => {
        if (apiResaponse.isValid) {
          this.setState({
            formOpen: true,
            title: "Edit Price",
            description: `Re-enter the price for ${inventory.registrationNumber}`,
            inventory,
            stores: apiResaponse.storeListByCityId
          })
          dispatch(hideLoader())
        }
      })
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
    const { filters, status } = this.state
    const { dispatch, page } = this.props
    window.scrollTo(0, 0)
    dispatch(getInventoryByStatusShd({ ...filters, status, page, isShdBike: true }))
  }

  closeForm = () => {
    this.setState({
      formOpen: false,
      unPublishOpen: false,
      title: null,
      description: null,
      inventory: null,
      stores: null
    })
  }

  showDetails = async id => {
    const { dispatch } = this.props
    dispatch(showLoader())
    this.setState({ inventoryId: id })
    const inventoryImages = await getInventoryImages(id)
    if (inventoryImages.isValid) {
      this.setState({ data: inventoryImages.vehicalImagesAndDocumentsRes })
    } else {
      this.setState({ data: {} })
      const { message } = inventoryImages
      dispatch(setNotification('danger', 'No Records', message))
    }
    const enhancedImages = await getEnhancedImages(id)
    if (enhancedImages.isValid) {
      this.setState({ enhancedImages: enhancedImages.bikeUrls })
    } else {
      this.setState({ enhancedImages: [] })
    }
    dispatch(hideLoader())
    this.toggleModal()
  }

  searchTypeHandler = searchText => {
    this.setState({ searchText })
  }

  setStatus = status => {
    this.setState({ status, isRegistrationSearch: false })
  }

  openUnpublish = inventory => {
    this.setState({ inventory, unPublishOpen: true })
  }

  unPublishInventory = () => {
    const { dispatch } = this.props
    const { inventory } = this.state
    console.log(inventory,"inventory")
    dispatch(showLoader())
    const payload = { inventoryType: 'SHD', status: 'UNPUBLISHED', isShdBike: true }
    if (inventory.registrationNumber) {
      payload.vehicleRegNum = inventory.registrationNumber
    }
    if (inventory.manufactureDate) {
      payload.dateOfManufacturing = getDatePayload(inventory.manufactureDate)
    }
    if (inventory.id) {
      payload.inspectedBikeDetailId = inventory.id
    }
    if (inventory.storeName) {
      payload.storeName = inventory.storeName
    }
    if (inventory.storeId) {
      payload.storeId = inventory.storeId
    }
    updateInventory(payload)
      .then(apiResaponse => {
        if (apiResaponse.isValid) {
          dispatch(setNotification('success', 'Success', apiResaponse.message))
        } else {
          dispatch(setNotification('danger', 'Error', apiResaponse.message))
        }
        this.closeForm()
        dispatch(hideLoader())
        this.refreshData()
      })
  }

  updateInventoryHandler = payload => {
    const { dispatch } = this.props
    dispatch(showLoader())
    updateInventory(payload)
      .then(apiResaponse => {
        if (apiResaponse.isValid) {
          dispatch(setNotification('success', 'Success', apiResaponse.message))
        } else {
          dispatch(setNotification('danger', 'Error', apiResaponse.message))
        }
        this.closeForm()
        dispatch(hideLoader())
        this.refreshData()
      })
  }

  searchHandler = (regNum) => {
    const { dispatch } = this.props
    if (regNum) {
      this.setState({ isRegistrationSearch: true, isClearFilter: true, filters: {} }, () => {
        dispatch(getInventoryByStatusShd({ page: 1, regNum, isShdBike: true }))
      })
    }
  }

  clearRegistrationInput = () => {
    const { status } = this.state
    this.props.dispatch(getInventoryByStatusShd({ page: 1, status, isShdBike: true }))
    this.setState({ searchText: '' })
  }

  toggleModal = () => {
    const { isModalOpen } = this.state
    this.setState({ isModalOpen: !isModalOpen })
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

  render() {
    const {
      formOpen,
      title,
      description,
      inventory,
      stores,
      searchText,
      status,
      isRegistrationSearch,
      isClearFilter,
      unPublishOpen,
      isModalOpen,
      data,
      enhancedImages
    } = this.state
    return (
      <Fragment>
        <h3> Publish Inventory Details - SHD </h3>
        <InventoryFilters
          onApplyFilter={this.applyFilter}
          onClearFilters={this.clearFilters}
          isClearFilter={isClearFilter}
          setClearFilter={() => this.setState({ isClearFilter: false })}
        />
        <InventoryDataTable
          status={status}
          isRegistrationSearch={isRegistrationSearch}
          onStatusChange={this.handleStatusChange}
          onPageChange={this.handlePageChange}
          onPublishInventory={this.publishInventory}
          onUnPublishInventory={this.openUnpublish}
          onEditPrice={this.editPrice}
          onSearch={this.searchHandler}
          searchText={searchText}
          onSearchType={this.searchTypeHandler}
          setStatus={this.setStatus}
          onClearRegistrationSearch={this.clearRegistrationInput}
          onShowDetails={this.showDetails}
        />
        {
          formOpen && <PublishForm
            title={title}
            description={description}
            open={formOpen}
            onClose={this.closeForm}
            inventory={inventory}
            stores={stores}
            onSubmitForm={this.updateInventoryHandler}
          />
        }
        {
          unPublishOpen && <UnpublishDialog
            inventory={inventory}
            open={unPublishOpen}
            onClose={this.closeForm}
            onUnpublish={this.unPublishInventory}
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
        />
      </Fragment>
    )
  }
}

export default connect(state => ({ page: state.publishInventory.page }))(PublishInventorySHD)
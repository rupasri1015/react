import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { getFhdList } from '../../redux/actions/fhdListAction'
import FhdFilter from './components/Filters'
import FhdTable from './components/Table'
import FhdForm from './components/Forms'
import { addFHDUser, updateFHDUser } from '../../core/services/fhdServices'
import { showLoader, hideLoader } from '../../redux/actions/loaderAction'
import { setNotification } from '../../redux/actions/notificationAction'

const initialState = {
  searchKeyword: '',
  city: null,
  isFromOpen: false,
  initialValues: null,
  isSearchRequired: false
}

class FirstHandDealer extends Component {
  state = initialState

  cityChangeHandler = (city) => {
    this.setState({ city })
    const { searchKeyword } = this.state
    const { dispatch } = this.props
    let payload = { pageNum: 1, userType: "FHD", cityId: city.value }
    if (searchKeyword) {
      payload = { ...payload, searchKeyword }
    }
    dispatch(getFhdList(payload))
  }

  searchHandler = (searchKeyword) => {
    this.setState({ searchKeyword, isSearchRequired: true })
  }

  refreshData = () => {
    const { dispatch, page } = this.props
    const { city, searchKeyword } = this.state
    const payload = { pageNum: page, userType: "FHD" }
    if (city) {
      payload.cityId = city.value
    }
    if (searchKeyword) {
      payload.searchKeyword = searchKeyword
    }
    dispatch(getFhdList(payload))
  }

  handleEnter = () => {
    const { dispatch } = this.props
    const { city, searchKeyword, isSearchRequired } = this.state
    let payload = { pageNum: 1, userType: "FHD", searchKeyword }
    if (city) {
      payload = { ...payload, cityId: city.value }
    }
    if (isSearchRequired) {
      this.setState({ isSearchRequired: false })
      dispatch(getFhdList(payload))
    }
  }

  clearFilters = () => {
    const { searchKeyword, city } = this.state
    const filters = {}
    if (searchKeyword) {
      filters.searchKeyword = searchKeyword
    }
    if (city) {
      filters.city = city
    }
    if (Object.keys(filters).length) {
      this.setState({ ...initialState })
      const { dispatch } = this.props
      dispatch(getFhdList())
    }
  }

  handlePageChange = (pageNum) => {
    const { city, searchKeyword } = this.state;
    const { dispatch } = this.props
    let payload = { pageNum, userType: "FHD" }
    if (city) {
      payload = { ...payload, cityId: city.value }
    }
    if (searchKeyword) {
      payload = { ...payload, searchKeyword }
    }
    window.scrollTo(0, 0)
    dispatch(getFhdList(payload))
  }

  handleFhdForm = formData => {
    this.setState({ isFromOpen: true, initialValues: formData })
  }

  closeFhdForm = () => {
    this.setState({ isFromOpen: false, initialValues: null })
  }

  addFHDDetails = (payload) => {
    const { dispatch } = this.props
    dispatch(showLoader())
    addFHDUser(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          dispatch(setNotification('success', 'Success', 'User Added/Updated Successfully'))
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
        this.closeFhdForm()
        dispatch(hideLoader())
        this.refreshData()
      })
  }

  updateFHDDetails = (payload) => {
    const { dispatch } = this.props
    dispatch(showLoader())
    updateFHDUser(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.closeFhdForm()
          dispatch(hideLoader())
          dispatch(setNotification('success', 'Success', 'User Added/Updated Successfully'))
        } else {
          this.closeFhdForm()
          dispatch(hideLoader())
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
      })
  }

  render() {
    const { searchKeyword, city, isFromOpen, initialValues } = this.state
    return (
      <Fragment>
        <h3>FHD Details</h3>
        <FhdFilter
          onSearch={this.searchHandler}
          onEnter={this.handleEnter}
          onCityChange={this.cityChangeHandler}
          currentCity={city}
          currentSearch={searchKeyword}
          onClearFilters={this.clearFilters}
          onAddFHD={this.handleFhdForm}
        />
        <FhdTable
          onPageChange={this.handlePageChange}
          onUpdateFHD={this.handleFhdForm}
        />
        {
          isFromOpen &&
          <FhdForm
            open={isFromOpen}
            onClose={this.closeFhdForm}
            initialValues={initialValues}
            onAddForm={this.addFHDDetails}
            onUpdateForm={this.updateFHDDetails}
          />
        }
      </Fragment>
    )
  }
}

export default connect(state => ({ page: state.fhdData.page }))(FirstHandDealer)
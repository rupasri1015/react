import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { listAllSHDData } from '../../redux/actions/shdListAction'
import ShdFilter from './components/Filters';
import ShdTable from './components/Table'
import AddShd from './components/Forms'
import { addSHDUser, updateSHDUser } from '../../core/services/shdServices'
import { setNotification } from '../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../redux/actions/loaderAction'

const initialState = {
  searchKeyword: '',
  city: null,
  initialValues: null,
  isFromOpen: false,
  isSearchRequired: false
}

class SecondHandDealer extends Component {

  state = initialState;

  cityChangeHandler = (city) => {
    this.setState({ city });
    const { searchKeyword } = this.state;
    const { dispatch } = this.props
    let payload = { pageNum: 1, userType: "SHD", cityId: city.value }
    if (searchKeyword) {
      payload = { ...payload, searchKeyword }
    }
    dispatch(listAllSHDData(payload))
  }

  searchHandler = (searchKeyword) => {
    this.setState({ searchKeyword, isSearchRequired: true });
  }

  refreshData = () => {
    const { dispatch, page } = this.props
    const { city, searchKeyword } = this.state
    const payload = { pageNum: page, userType: "SHD" }
    if (city) {
      payload.cityId = city.value
    }
    if (searchKeyword) {
      payload.searchKeyword = searchKeyword
    }
    dispatch(listAllSHDData(payload))
  }

  handleEnter = () => {
    const { dispatch } = this.props
    const { city, searchKeyword, isSearchRequired } = this.state;
    let payload = { pageNum: 1, userType: "SHD", searchKeyword }
    if (city) {
      payload = { ...payload, cityId: city.value }
    }
    if (isSearchRequired) {
      this.setState({ isSearchRequired: false })
      dispatch(listAllSHDData(payload))
    }
  }

  clearFilters = () => {
    const { searchKeyword, city } = this.state
    const { dispatch } = this.props
    const filters = {}
    if (searchKeyword) {
      filters.searchKeyword = searchKeyword
    }
    if (city) {
      filters.city = city
    }
    if (Object.keys(filters).length) {
      this.setState({ ...initialState });
      dispatch(listAllSHDData())
    }
  }

  handlePageChange = (pageNum) => {
    const { city, searchKeyword } = this.state;
    const { dispatch } = this.props
    let payload = { pageNum, userType: "SHD" }
    if (city) {
      payload = { ...payload, cityId: city.value }
    }
    if (searchKeyword) {
      payload = { ...payload, searchKeyword }
    }
    window.scrollTo(0, 0)
    dispatch(listAllSHDData(payload))
  }

  closeForm = () => {
    this.setState({
      isFromOpen: false,
      initialValues: null
    })
  }

  handleShdForm = formData => {
    this.setState({ isFromOpen: true, initialValues: formData })
  }

  addSHDDetails = (payload) => {
    const { dispatch } = this.props
    dispatch(showLoader())
    addSHDUser(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          dispatch(setNotification('success', 'Success', 'User Added/Updated Successfully'))
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
        this.closeForm()
        dispatch(hideLoader())
        this.refreshData()
      })
  }

  updateSHDDetails = (payload) => {
    const { dispatch } = this.props
    dispatch(showLoader())
    updateSHDUser(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          dispatch(setNotification('success', 'Success', 'User Added/Updated Successfully'))
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
        this.closeForm()
        dispatch(hideLoader())
        this.refreshData()
      })
  }

  render() {
    const { searchKeyword, city, isFromOpen, initialValues, formType } = this.state;
    return (
      <Fragment>
        <h3> SHD Details </h3>
        <ShdFilter
          onSearch={this.searchHandler}
          onEnter={this.handleEnter}
          onCityChange={this.cityChangeHandler}
          currentCity={city}
          currentSearch={searchKeyword}
          onClearFilters={this.clearFilters}
          onHandleClickOpen={this.handleClickOpen}
          onAddSHD={this.handleShdForm}
        />
        <ShdTable
          onPageChange={this.handlePageChange}
          onUpdateShd={this.handleShdForm}
        />
        {
          isFromOpen &&
          <AddShd
            open={isFromOpen}
            formType={formType}
            onClose={this.closeForm}
            initialValues={initialValues}
            onAddForm={this.addSHDDetails}
            onUpdateForm={this.updateSHDDetails}
          />
        }
      </Fragment>
    )
  }
}

export default connect(state => ({ page: state.shdData.page }))(SecondHandDealer);
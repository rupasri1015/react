import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import ValuatorFilter from './components/Filters';
import ValuatorTable from './components/Table';
import { getValuatorList } from '../../redux/actions/valuatorAction'
import AddValuator from './components/Forms'
import { showLoader, hideLoader } from '../../redux/actions/loaderAction'
import { setNotification } from '../../redux/actions/notificationAction'
import { fhdShdStores } from '../../redux/actions/fhdShdStoreListAction'
import { addValuator, getValuator, updateValuator } from '../../core/services/valuatorServices'

const initialState = {
  searchKeyword: '',
  city: null,
  initialValues: null,
  isFromOpen: false,
  isSearchRequired: false
}

class Valuator extends Component {

  state = initialState;

  cityChangeHandler = (city) => {
    this.setState({ city })
    const { searchKeyword } = this.state;
    const { dispatch } = this.props
    let payload = { pageNum: 1, userType: "valuator", cityId: city.value }
    if (searchKeyword) {
      payload = { ...payload, searchKeyword }
    }
    dispatch(getValuatorList(payload))
  }

  searchHandler = (searchKeyword) => {
    this.setState({ searchKeyword, isSearchRequired: true })
  }

  refreshData = () => {
    const { dispatch, page } = this.props
    const { city, searchKeyword } = this.state
    const payload = { pageNum: page, userType: "valuator" }
    if (city) {
      payload.cityId = city.value
    }
    if (searchKeyword) {
      payload.searchKeyword = searchKeyword
    }
    dispatch(getValuatorList(payload))
  }

  handleEnter = () => {
    const { dispatch } = this.props
    const { city, searchKeyword, isSearchRequired } = this.state;
    let payload = { pageNum: 1, userType: "valuator", searchKeyword }
    if (city) {
      payload = { ...payload, cityId: city.value }
    }
    if (isSearchRequired) {
      this.setState({ isSearchRequired: false })
      dispatch(getValuatorList(payload))
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
      dispatch(getValuatorList())
    }
  }

  handlePageChange = (pageNum) => {
    const { city, searchKeyword } = this.state;
    const { dispatch } = this.props
    let payload = { pageNum, userType: "valuator" }
    if (city) {
      payload = { ...payload, cityId: city.value }
    }
    if (searchKeyword) {
      payload = { ...payload, searchKeyword }
    }
    window.scrollTo(0, 0)
    dispatch(getValuatorList(payload))
  }

  closeForm = () => {
    this.setState({
      isFromOpen: false,
      initialValues: null
    })
  }

  handleValuatorForm = valuatorId => {
    const { dispatch } = this.props
    if (valuatorId) {
      dispatch(showLoader())
      getValuator(valuatorId)
        .then(apiResponse => {
          if (apiResponse.isValid) {
            const { userDetailsResponse } = apiResponse
            dispatch(fhdShdStores({ storeTypeId: 3, cityId: userDetailsResponse.storeCityId }))
              .then(() => {
                this.setState({ isFromOpen: true, initialValues: userDetailsResponse })
                dispatch(hideLoader())
              })
          } else {
            dispatch(setNotification('danger', 'Error', apiResponse.message))
            dispatch(hideLoader())
          }
        })
    } else {
      this.setState({ isFromOpen: true, initialValues: null })
    }
  }

  addValuatorDetails = (payload) => {
    const { dispatch } = this.props
    dispatch(showLoader())
    addValuator(payload)
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

  updateValuatorDetails = (payload) => {
    const { dispatch } = this.props
    dispatch(showLoader())
    updateValuator(payload)
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
    const { searchKeyword, city, isFromOpen, initialValues } = this.state;
    return (
      <Fragment>
        <h3> Valuator Details </h3>
        <ValuatorFilter
          onSearch={this.searchHandler}
          onEnter={this.handleEnter}
          onCityChange={this.cityChangeHandler}
          currentCity={city}
          currentSearch={searchKeyword}
          onClearFilters={this.clearFilters}
          onAddValuator={this.handleValuatorForm}
        />
        <ValuatorTable
          onPageChange={this.handlePageChange}
          onUpdateValuator={this.handleValuatorForm}
        />
        {
          isFromOpen &&
          <AddValuator
            open={isFromOpen}
            onClose={this.closeForm}
            initialValues={initialValues}
            onAddForm={this.addValuatorDetails}
            onUpdateForm={this.updateValuatorDetails}
          />
        }
      </Fragment>
    )
  }
}

export default connect()(Valuator);
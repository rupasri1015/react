import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'

import PendingReturnTable from './components/PendingReturnTable';
import ReturnsFilter from '../../../FranchiseStoreManagerDashboard/components/ReturnsFilter';
import { getPendingAssignList } from '../../../../redux/actions/pendingAssignListAction'
import { getRole, PERMISSIONS, getCityID } from '../../../../core/services/rbacServices'
import { pendingReturnInventoryAction } from '../../../../redux/actions/pendingReturnInventoryAction';

const dateTypes = [
  {
    id: 1,
    label: 'Sold Date',
    value: 'purchaseDate'
  },
  {
    id: 2,
    label: 'Return Request Date',
    value: 'returnRequestedDate'
  }
];
class PendingAssignInventory extends Component {
  state = {
    bikeForm: false,
    data: null,
    filters: {},
    searchText: '',
    isClearFilter: false,
    showMultiButton: false,
    open: false,
    clear: true,
    closeAssignShowroom: true
  }

  assignBikeToStore = assignData => {
    this.setState({
      bikeForm: true,
      data: assignData
    })
  }

  closeBikeDialog = () => {
    this.setState({
      bikeForm: false,
      data: null
    })
  }

  changePage = (page) => {
    const { dispatch } = this.props
    const { filters } = this.state
    let payload = { PageNo: page, PageSize: 15,  returnStatus: 'PENDING', returnSubStatus: 'PENDING INVENTORY ASSIGNMENT' }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (Object.keys(filters).length) {
      payload = { ...payload, ...filters }
    }
    window.scrollTo(0, 0)
    dispatch(pendingReturnInventoryAction(payload))
  }

  onApplyFilter = (filterObj) => {
    const { dispatch, pageNumber } = this.props

    let filterPayload = {};

		if (filterObj) {
			if (filterObj.dateType) {
				filterPayload = {
					PageSize: 10,
					dateColumn: filterObj.dateType && filterObj.dateType,
					from: filterObj.fromDate && filterObj.fromDate,
					to: filterObj.toDate && filterObj.toDate,
				};
			}
			filterPayload = {
				...filterPayload,
				searchString: filterObj.searchTerm && filterObj.searchTerm
			}
		}
		this.setState({ filters: filterPayload });

    return dispatch(pendingReturnInventoryAction({
      ...filterPayload ,
      returnSubStatus: 'PENDING INVENTORY ASSIGNMENT',
      returnStatus: 'PENDING',
      PageNo: pageNumber,
      PageSize: 15,
      cityId:  PERMISSIONS.FRANCHISE.includes(getRole()) ? getCityID() : ''
    }));
  }

  applySearch = (filters) => {
    const { filters: prevFilters } = this.state
    const { dispatch, pageNumber } = this.props
    let payload = { PageNo: pageNumber, returnSubStatus: 'PENDING INVENTORY ASSIGNMENT', returnStatus: 'PENDING' }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
    }
    if (!isEqual(prevFilters,
    )) {
      this.setState({ filters }, () => {
        window.scrollTo(0, 0)
        dispatch(getPendingAssignList({ ...filters, ...payload }))
      })
    }
  }

  checkBoxStatus = (status) => {
    this.setState({ open: status })
  }

  render() {
    const { showMultiButton, filters, open, closeAssignShowroom } = this.state
    return (
      <Fragment>
        <div> <h3> Pending Return Inventory </h3> </div>
        <ReturnsFilter dateTypes={dateTypes} onApplyFilter={this.onApplyFilter} searchPlaceHolder='Search by keyword'/>
        <PendingReturnTable
          onPageChange={this.changePage}
          showMultiButton={showMultiButton}
          cityId={filters.cityID}
          onCheckBox={this.checkBoxStatus}
          open={open}
          closeAssignShowroom={closeAssignShowroom}
        />
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  pageNumber: state.pendingReturnInventory.pageNumber
})

export default connect(mapStateToProps)(PendingAssignInventory);

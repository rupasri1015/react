import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import Checkbox from '@material-ui/core/Checkbox'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { getDate, getAmount, getMmvYear, renderString } from '../../../../../../core/utility'
import NoResultFound from '../../../../../../shared/components/NoResultFound'
import { getRole, PERMISSIONS, getCityID, getUserID } from '../../../../../../core/services/rbacServices'
import { pendingAssignList } from '../../../../../../core/services/franchiseServices'
import Dropdown from '../../../../../../shared/components/form/DropDown'
import { getPendingAssignList } from '../../../../../../redux/actions/pendingAssignListAction'
import { Button } from 'reactstrap'
import { setNotification } from '../../../../../../redux/actions/notificationAction'
import { getStoresList } from '../../../../../../redux/actions/franchiseStoresAction'
import { getFranchiseStores } from '../../../../../../core/services/franchiseServices'
import Select from 'react-select'
import classname from 'classnames'

const columns = [
  { id: 'orderID', label: 'Order ID' },
  { id: 'inventoryReadyDate', label: 'Inventory Ready Date' },
  { id: 'storeName', label: 'Assign\u00a0Showroom' },
  { id: 'cityName', label: 'City' },
  { id: 'registrationNumber', label: 'Registration Number' },
  { id: 'mmv', label: 'MMV & Year' },
  { id: 'cfp', label: 'Minimum CFP' },
  { id: 'crp', label: 'Recommended CSP' },
  { id: 'assignedCfp', label: 'Assigned CFP' },
  { id: 'assignedCrp', label: 'Assigned CRP' },
]

class PendingData extends Component {

  state = {
    open: false,
    checked: false,
    bulkOrderIds: [],
    store: '',
    onlyStoreIDs: [],
    // pendingList: [],
    crpValue: '',
    storeIds: [],
    universalCheck: false,
    pendingCount: 0,
    store: null,
    franchiseStoreList: [],
    payloadData: [],
    crpCfp: [],
    newCrp: '',
    showInputs: false
  }

  componentDidMount() {
    const { dispatch, cityId } = this.props
    // const payload = { page: 1, acceptedStatus: 'PENDING' }
    const payload = { page: 1, acceptedStatus: 'PENDING' }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityID = getCityID()
      this.getStoreList(getCityID())
    }
    dispatch(getPendingAssignList(payload))
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cityId !== this.props.cityId) {
      const { cityId } = this.props
      this.getStoreList(cityId)
      const payload = { page: 1, acceptedStatus: 'PENDING' }
      if (PERMISSIONS.FRANCHISE.includes(getRole())) {
        payload.cityID = getCityID()
      }
      this.getPendingList(payload)
    }
    if (prevProps.showMultiButton !== this.props.showMultiButton) {
      this.setState({ universalCheck: false })
    }
    if (prevProps.closeAssignShowroom !== this.props.closeAssignShowroom) {
      this.setState({ universalCheck: false })
    }
  }

  getPendingList = (payload) => {
    pendingAssignList(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState({
            pendingBikeList: apiResponse.franchiseBikesResponse,
            pendingCount: apiResponse.count,
            onlyStoreIDs: apiResponse.franchiseBikesResponse.map(list => ({
              id: list.orderID,
              storeValue: 0,
              crPrice: list.assignedCrp
            }))
          })
        }
      })
  }

  getStoreList = (payload) => {
    getFranchiseStores(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState({
            franchiseStoreList: apiResponse.storesbyCityId,
            storeIds: apiResponse.storesbyCityId.map(stores => ({
              ids: stores.storeId
            }))
          })
        }
      })
  }

  pageChange = (page) => {
    const { onPageChange } = this.props
    if (onPageChange) {
      onPageChange(page)
    }
  }

  assignBikeToStoreDialog = (assignBikes) => {
    const { onAssignBikeToStore } = this.props
    if (onAssignBikeToStore) {
      onAssignBikeToStore(assignBikes)
    }
  }

  openCheckBox = () => {
    if (getRole() === 'Franchise_ops_manager') {
      this.setState({ showInputs: true })
    }
    const { onCheckBox } = this.props
    this.setState({ universalCheck: false, open: true })
    onCheckBox(true)
  }

  assignInventory = () => {
    const { payloadData, store, bulkOrderIds, universalCheck } = this.state
    const { dispatch, onAssignLotBikes } = this.props
    if (payloadData.length >= 1) {
      if (universalCheck) {
        if (store) {
          const newPayload = payloadData.map(data => {
            data.storeId = store.value
            return data
          })
          let a = window.confirm(`You are updating ${payloadData.length ? payloadData.length : bulkOrderIds.length} records`)
          if (a) {
            onAssignLotBikes(payloadData)
          }
        }
        else {
          dispatch(setNotification('danger', 'ERROR', 'Please Select Showroom to Update'))
        }
      }
      else {
        const storeIdPresent = payloadData.every(store => store.storeId)
        if (storeIdPresent) {
          let a = window.confirm(`You are updating ${payloadData.length ? payloadData.length : bulkOrderIds.length} records`)
          if (a) {
            this.setState({ showInputs: false })
            onAssignLotBikes(payloadData)
          }
        }
        else {
          dispatch(setNotification('danger', 'ERROR', 'Please Select Showroom to Update'))
        }
      }
    }
    else {
      dispatch(setNotification('danger', 'ERROR', 'Please Select One Record to Assign'))
    }
  }

  handleChecked = (list) => {
    window.scrollTo(0, 0);
    const { leadID: newId } = list
    this.setState({ leadId: newId, data: list })
  }

  handleAllChecked = (checked) => {
    const { pendingList } = this.props
    const { payloadData, bulkOrderIds } = this.state
    let payload = {}
    if (checked) {
      this.setState({
        bulkOrderIds: pendingList.map(details => details.orderID),
        payloadData: pendingList.map((money) => {
          return {
            orderId: money.orderID,
            assigneeId: getUserID(),
            assignedCfp: money.assignedCfp,
            assignedCrp: money.assignedCrp
          }
        }, 0)
      })
    }
    else {
      this.setState({ bulkOrderIds: [], payloadData: [] })
    }
  }

  handleMultiChecked = (checked, orderID, pending) => {
    const { payloadData, bulkOrderIds } = this.state
    let newPayloadData = [...payloadData]
    let newBulkIds = [...bulkOrderIds]
    if (checked) {
      newBulkIds.push(orderID)
      const newStore = {
        orderId: pending.orderID,
        assigneeId: getUserID(),
        assignedCfp: pending.assignedCfp,
        assignedCrp: pending.assignedCrp
      }
      newPayloadData.push(newStore)
    }
    else {
      newBulkIds = newBulkIds.filter(oId => oId !== orderID)
      newPayloadData = newPayloadData.filter(store => store.orderId !== orderID)
    }
    this.setState({ payloadData: newPayloadData, bulkOrderIds: newBulkIds })
  }

  getStoresBasedOnCityId = () => {
    const { franchiseStoreList } = this.state
    let getStores = []
    if (franchiseStoreList && franchiseStoreList.length) {
      getStores = franchiseStoreList.map(store => {
        return {
          value: store.storeId,
          label: store.storeName
        }
      })
    }
    return getStores
  }

  setStore = (event, pending) => {
    const { payloadData, universalCheck, store } = this.state
    let newPayloadData = [...payloadData]
    const orderData = payloadData.find(order => order.orderId === pending.orderID)
    if (orderData) {
      newPayloadData = payloadData.map(order => {
        if (order.orderId === pending.orderID) {
          if (!universalCheck) {
            order.storeId = event.value
          }
        }
        return order
      })
    }
    else {
      const newStore = {
        orderId: pending.orderID,
        assigneeId: getUserID(),
        assignedCfp: pending.assignedCfp,
        assignedCrp: pending.assignedCrp
      }
      if (!universalCheck) {
        newStore.storeId = event.value
      }
      newPayloadData.push(newStore)
    }
    this.setState({ payloadData: newPayloadData })
  }

  setCRP = (e, id) => {
    const { payloadData } = this.state
    const { dispatch } = this.props
    if (payloadData.length) {
      const regexp = /^[0-9\b]+$/
      const doc = payloadData.find(doc => doc.orderId === id)
      if (doc) {
        const newPayloadData = payloadData.filter(doc => doc.orderId !== id)
        if (e.target.value === '' || regexp.test(e.target.value)) {
          doc.assignedCrp = e.target.value
          this.setState({ payloadData: [...newPayloadData, doc] })
        }
      }
    }
    else {
      dispatch(setNotification('danger', 'Error', 'Please Select Showroom'))
    }
  }

  getStoreValue = (id) => {
    const { payloadData } = this.state
    const storeData = payloadData.find(payload => payload.orderId === id)
    if (storeData) return storeData.storeId
    return null
  }

  getValue = (pending) => {
    const { payloadData } = this.state
    const orderData = payloadData.find(payload => payload.orderId === pending.orderID)
    if (orderData) {
      return orderData.assignedCrp
    }
    return pending.assignedCrp
  }

  getCfpValue = (pending) => {
    const { payloadData } = this.state
    const orderData = payloadData.find(payload => payload.orderId === pending.orderID)
    if (orderData) {
      return orderData.assignedCfp
    }
    return pending.assignedCfp
  }

  setCFP = (e, id) => {
    const { payloadData } = this.state
    const { dispatch } = this.props
    if (payloadData.length) {
      const regexp = /^[0-9\b]+$/
      const doc = payloadData.find(doc => doc.orderId === id)
      if (doc) {
        const newPayloadData = payloadData.filter(doc => doc.orderId !== id)
        if (e.target.value === '' || regexp.test(e.target.value)) {
          doc.assignedCfp = e.target.value
          this.setState({ payloadData: [...newPayloadData, doc] })
        }
      }
    }
    else {
      dispatch(setNotification('danger', 'Error', 'Please Select Showroom'))
    }
  }


  handleChange = (e) => {
    const { payloadData } = this.state
    const { onCheckBox } = this.props
    if (!e.target.cehcked && payloadData.length) {
      const newPayloadData = payloadData.map(data => {
        delete data.storeId
        return data
      })
      this.setState({ payloadData: newPayloadData })
    }
    this.setState({ universalCheck: e.target.checked })
    onCheckBox(false)
  }

  setStoreValue = (value) => {
    this.setState({ store: value })
  }

  getSelectedState = (oId) => {
    const { bulkOrderIds } = this.state
    if (bulkOrderIds.includes(oId)) return false
    return true
  }

  validateReleaseDate = (assignedDate) => {
    if (getUserID() === 205366 || getUserID() === 158971) {
      return false
    }
    else {
      if (assignedDate) {
        let changedDate = new Date(assignedDate)
        let releaseDate = new Date("2020-01-16 19:30:0")
        if (changedDate.getTime() > releaseDate.getTime()) {
          return true
        }
      }
      else {
        return false
      }
    }
  }

  render() {
    const { open, total, page, className, showMultiButton, pendingList, closeAssignShowroom } = this.props
    const { pendingCount, pendingBikeList, universalCheck, store, payloadData, showInputs } = this.state
    return (
      <div>
        <div className='row ml-1' >
          <div className='mr-3'>
            <h4 className="countHeader"> {`${`Total Records: ${total}`}`} </h4>
          </div>
          {
            showMultiButton &&
            <>
              <div>
                <Button color="success" className="rounded no-margin" type="button" onClick={this.assignInventory} disabled={pendingList.length === 0} style={{ marginBottom: '5px' }}>Update</Button>
                <Button color="success" className="rounded no-margin" type="button" onClick={this.openCheckBox} disabled={pendingList.length === 0} style={{ marginBottom: '5px' }}>Multi Assign</Button>
              </div>
            </>
          }
          {
            PERMISSIONS.FRANCHISE.includes(getRole()) &&
            <>
              <div>
                <Button color="success" className="rounded no-margin" type="button" onClick={this.assignInventory} disabled={pendingList.length === 0} style={{ marginBottom: '5px' }}>Update</Button>
                <Button color="success" className="rounded no-margin" type="button" onClick={this.openCheckBox} disabled={pendingList.length === 0} style={{ marginBottom: '5px' }}>Multi Assign</Button>
              </div>
            </>
          }
          {
            showMultiButton &&
            <>
              <Checkbox
                color="primary"
                onChange={(e) => this.handleChange(e)}
                checked={universalCheck}
              />
              <p style={{ fontSize: 14, fontFamily: 'ProximaNovaSemibold' }}>Assign to Single Showroom</p>
            </>
          }
          {
            (PERMISSIONS.FRANCHISE.includes(getRole())) && pendingList.length !== 0 &&
            <>
              <Checkbox
                color="primary"
                onChange={(e) => this.handleChange(e)}
                checked={universalCheck}
              />
              <p style={{ fontSize: 14, fontFamily: 'ProximaNovaSemibold' }}>Assign to Single Showroom</p>
            </>
          }
          {
            universalCheck &&
            <div >
              <div style={{ width: '300%', marginLeft: '20px' }}>
                <Select
                  classNamePrefix="city-dropdown"
                  options={this.getStoresBasedOnCityId()}
                  placeholder='Showroom'
                  onChange={this.setStoreValue}
                  value={store}
                  searchable={false}
                />
              </div>
            </div>

          }
        </div>
        <div className="table-wraper">
          <Table size="small">
            <TableHead>
              <TableRow>
                {
                  open &&
                  pendingList && Boolean(pendingList.length) &&
                  <TableCell>
                    <Checkbox
                      color='primary'
                      // indeterminate={this.state.bulkOrderIds.length && this.state.bulkOrderIds.length < pendingList.length}
                      // checked={this.state.bulkOrderIds.length === pendingList.length}
                      onChange={(event) => this.handleAllChecked(event.target.checked)}
                    />
                  </TableCell>
                }
                {
                  universalCheck &&
                  pendingList && Boolean(pendingList.length) &&
                  <TableCell>
                    <Checkbox
                      color='primary'
                      // indeterminate={this.state.bulkOrderIds.length && this.state.bulkOrderIds.length < pendingList.length}
                      // checked={this.state.bulkOrderIds.length === pendingList.length}
                      onChange={(event) => this.handleAllChecked(event.target.checked)}
                    />
                  </TableCell>
                }
                {

                  columns.map(column => column.label === 'Assign Showroom' ? (
                    <TableCell key={column.id} style={{ width: '200px' }}>
                      {column.label}
                    </TableCell>
                  ) :
                    <TableCell key={column.id} >
                      {column.label}
                    </TableCell>
                  )
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                Boolean(pendingList.length) && pendingList.map(pending => {
                  const {
                    orderID,
                    createdDate,
                    cityName,
                    registrationNumber,
                    mmv,
                    year,
                    cfp,
                    crp,
                    assignedCfp,
                    assignedCrp,
                  } = pending
                  return (
                    <TableRow
                      hover tabIndex={-1}
                      key={orderID}
                      role="checkbox"
                      onClick={() => this.handleChecked(pending)}
                    >
                      {
                        open &&
                        <TableCell>
                          <Checkbox
                            color='primary'
                            style={{ float: 'left' }}
                            checked={this.state.bulkOrderIds.includes(orderID)}
                            onChange={(event) => this.handleMultiChecked(event.target.checked, orderID, pending)}
                          />
                        </TableCell>
                      }
                      {
                        universalCheck &&
                        <TableCell>
                          <Checkbox
                            color='primary'
                            style={{ float: 'left' }}
                            checked={this.state.bulkOrderIds.includes(orderID)}
                            onChange={(event) => this.handleMultiChecked(event.target.checked, orderID, pending)}
                          />
                        </TableCell>
                      }
                      <TableCell>
                        <p> {renderString(orderID)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getDate(createdDate)} </p>
                      </TableCell>
                      <TableCell>
                        <Fragment>
                          {/* <img src={edit} id={orderID} alt="Assigne Showroom" align="right" role="button" className="payment-action-icon" onClick={() => this.assignBikeToStoreDialog(pending)} /> */}
                          {
                            showMultiButton && !universalCheck &&
                            (PERMISSIONS.FRANCHISE_CENTRAL.includes(getRole())) &&
                            <div className={classname("city-dropdown-container", className)}>
                              <Select
                                classNamePrefix="city-dropdown"
                                options={this.getStoresBasedOnCityId()}
                                placeholder='Showroom'
                                onChange={(event) => this.setStore(event, pending)}
                                // value={this.getStoreValue(orderID)}
                                searchable={false}
                                isDisabled={this.getSelectedState(orderID)}
                                isSearchable={true}
                              />
                            </div>
                          }
                          {
                            (PERMISSIONS.FRANCHISE.includes(getRole())) && !universalCheck && closeAssignShowroom &&
                            <div className={classname("city-dropdown-container", className)} style={{ margin: '0' }}>
                              <Select
                                classNamePrefix="city-dropdown"
                                options={this.getStoresBasedOnCityId()}
                                placeholder='Showroom'
                                onChange={(event) => this.setStore(event, pending)}
                                // value={this.getStoreValue(orderID)}
                                searchable={false}
                                isDisabled={this.getSelectedState(orderID)}
                                isSearchable={true}
                              />
                            </div>
                          }
                        </Fragment>
                      </TableCell>
                      <TableCell>
                        <p> {renderString(cityName)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {renderString(registrationNumber)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getMmvYear(mmv, year)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getAmount(cfp)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getAmount(crp)} </p>
                      </TableCell>
                      {
                        getRole() === 'Franchise_ops_manager' && 
                        <TableCell>
                          <input value={this.getCfpValue(pending)} onChange={(e) => this.setCFP(e, orderID)} disabled={this.getSelectedState(orderID)} style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}></input>
                        </TableCell>
                      }
                      {
                        getRole() === 'Franchise_ops_manager' && 
                        <TableCell>
                          <p> <span>
                            <input value={this.getValue(pending)} onChange={(e) => this.setCRP(e, orderID)} disabled={this.getSelectedState(orderID)} style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}></input>
                          </span>
                          </p>
                        </TableCell>
                      }
                      {
                        getRole() === 'Franchise_ops_manager_central' && showMultiButton &&
                        <TableCell>
                          <input value={this.getCfpValue(pending)} onChange={(e) => this.setCFP(e, orderID)} disabled={this.getSelectedState(orderID)} style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}></input>
                        </TableCell>
                      }
                      {
                        getRole() === 'Franchise_ops_manager_central' && showMultiButton &&
                        <TableCell>
                          <p> <span>
                            <input value={this.getValue(pending)} onChange={(e) => this.setCRP(e, orderID)} disabled={this.getSelectedState(orderID)} style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}></input>
                          </span>
                          </p>
                        </TableCell>
                      }
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
          <div className="table-paginator">
            {
              Boolean(pendingList.length) ?
                <Pagination
                  className="float-right"
                  locale={localeInfo}
                  current={page}
                  total={total}
                  pageSize={15}
                  onChange={this.pageChange}
                /> :
                <NoResultFound />
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  pendingList: state.pending.pendingList,
  total: state.pending.count,
  page: state.pending.page,
  franchiseStoreList: state.franchiseStores.storeListByCityId
})

export default connect(mapStateToProps)(PendingData)

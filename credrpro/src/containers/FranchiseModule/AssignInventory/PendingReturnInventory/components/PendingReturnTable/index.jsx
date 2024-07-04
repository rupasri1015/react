import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import { Button } from 'reactstrap'
import Select from 'react-select'
import classname from 'classnames'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import Checkbox from '@material-ui/core/Checkbox'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { getAmount, renderString } from '../../../../../../core/utility'
import NoResultFound from '../../../../../../shared/components/NoResultFound'
import { getRole, PERMISSIONS, getCityID, getUserID } from '../../../../../../core/services/rbacServices'
import { pendingAssignList, getFranchiseStores } from '../../../../../../core/services/franchiseServices'
import { pendingReturnInventoryAction, createReturnLogisticAction } from '../../../../../../redux/actions/pendingReturnInventoryAction';
import { setNotification } from '../../../../../../redux/actions/notificationAction'

import styles from './styles.module.scss';

const columns = [
  { id: 'ibdId', label: 'Inventory Id' },
  { id: 'id', label: 'Return request Id' },
  { id: 'registrationNumber', label: 'Registration Number' },
  { id: 'storeName', label: 'Store name' },
  { id: 'inspectionAmount', label: 'Inspection Amount' },
  { id: 'invoiceAmount', label: 'Invoice Amount' },
  { id: 'refundAmount', label: 'Refund Amount' },
  { id: 'assigneeTo', label: 'Return to' },
  { id: 'storeId', label: 'Assign Showroom' },
  { id: 'storeCityName', label: 'Assigned CRP' },
  { id: 'storeLocationName', label: 'Assigned CFP' },
]

class PendingReturnInventory extends Component {
  state = {
    open: false,
    checked: false,
    bulkOrderIds: [],
    store: '',
    onlyStoreIDs: [],
    pendingList: [],
    crpValue: '',
    storeIds: [],
    universalCheck: false,
    disableShowRoomDropDown: true,
    pendingCount: 0,
    returnTo: '',
    franchiseStoreList: [],
    payloadData: [],
    crpCfp: [],
    newCrp: ''
  }

  componentDidMount() {
    const { dispatch } = this.props
    const payload = { PageNo: 1, PageSize: 15, returnSubStatus: 'PENDING INVENTORY ASSIGNMENT', returnStatus: 'PENDING' }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
      this.getStoreList(getCityID())
    }
    dispatch(pendingReturnInventoryAction(payload));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.showMultiButton !== this.props.showMultiButton) {
      this.setState({ universalCheck: false })
    }
    if (prevProps.closeAssignShowroom !== this.props.closeAssignShowroom) {
      this.setState({ universalCheck: false })
    }

    if (prevProps.pendingList !== this.props.pendingList)
      this.setState({ pendingList: this.props.pendingList });
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

  openCheckBox = () => {
    const { onCheckBox } = this.props;
    this.setState({ universalCheck: false, open: true });
    onCheckBox(true);
  }

  assignInventory = () => {
    const { payloadData, store, bulkOrderIds, universalCheck } = this.state
    const { dispatch, onCheckBox } = this.props

    if (payloadData.length >= 1){
      if (universalCheck) {
        if (store) {
          const newPayload = payloadData.map(data => {
            data.storeId = store.value
            return data
          })
          let a = window.confirm(`You are updating ${payloadData.length ? payloadData.length : bulkOrderIds.length} records`)
          if (a) {
            dispatch(createReturnLogisticAction(newPayload));
            onCheckBox(false);
            return this.setState({ open: false });
          }
        } else dispatch(setNotification('danger', 'ERROR', 'Please Select Showroom to Update'))
      } else {
        let isValidPayloadData = [];

        payloadData.forEach(item => {
          if (item.returnTo === 'store' && item.storeId) isValidPayloadData.push(item);

          if (item.returnTo === 'warehouse') {
            delete item.assignedCfp;
            delete item.assignedCrp;
            isValidPayloadData.push(item);
          }
        });

        if (isValidPayloadData && isValidPayloadData.length === payloadData.length) {
          let a = window.confirm(`You are updating ${payloadData.length ? payloadData.length : bulkOrderIds.length} records`)
          if (a) {
            onCheckBox(false);
            this.setState({ open: false });
            return dispatch(createReturnLogisticAction(payloadData));
          }
        } else dispatch(setNotification('danger', 'ERROR', 'Please Select Return To or Showroom to Update'))
      }
    } else {
      dispatch(setNotification('danger', 'ERROR', 'Please Select One Record to Assign'))
    }
  }

  handleChecked = (list) => {
    const { leadID: newId } = list
    this.setState({ leadId: newId, data: list })
  }

  handleAllChecked = (checked) => {
    const { pendingList } = this.props;
    if (checked) {
      this.setState({
        bulkOrderIds: pendingList.map(details => details.returnId),
        payloadData: pendingList.map((item) => {
          return {
            assignedCfp: 0,
            assignedCrp: 0,
            brrId: item.returnId,
            ibdId: item.ibdId,
            storeId: item.assignedStoreId,
            toWareHouse: item.returnTo === 'warehouse',
            userId: getUserID()
          }
        }, 0)
      })
    }
    else {
      this.setState({ bulkOrderIds: [], payloadData: [] })
    }
  }

  handleMultiChecked = (checked, returnId, pending) => {
    const { payloadData, bulkOrderIds } = this.state
    let newPayloadData = [...payloadData]
    let newBulkIds = [...bulkOrderIds]

    if (checked) {
      newBulkIds.push(returnId)
      const newStore = {
        assignedCfp: 0,
        assignedCrp: 0,
        brrId: pending.returnId,
        ibdId: pending.inventoryId,
        returnTo: pending.returnTo,
        storeId: pending.returnTo === 'store' ? pending.assignedStoreId : undefined,
        toWareHouse: pending.returnTo === 'warehouse',
        userId: getUserID()
      }
      newPayloadData.push(newStore)
    }
    else {
      newBulkIds = newBulkIds.filter(oId => oId !== returnId)
      newPayloadData = newPayloadData.filter(item => item.brrId !== returnId)
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

  getReturnDropDownItems = () => {
    return [
      {
        value: 'warehouse',
        label: 'Ware house'
      },
      {
        value: 'store',
        label: 'Store'
      }
    ]
  }

  setReturnTo = (event, item) => {
    const { payloadData, universalCheck, pendingList } = this.state
    let newPayloadData = [...payloadData];
    let newStoreData = {};

    let newData = pendingList.map(listItem => {
      if (item.returnId === listItem.returnId)
        listItem.returnTo = event.value;
      return listItem;
    });

    this.setState({ pendingList: newData });

    const orderData = payloadData.find(i => i.brrId === item.returnId)
    newStoreData = {
      assignedCfp: 0,
      assignedCrp: 0,
      brrId: item.returnId,
      storeId: undefined,
      ibdId: item.inventoryId,
      returnTo: event.value,
      toWareHouse: event.value === 'warehouse',
      userId: getUserID()
    }

    if (orderData) {
      newPayloadData = payloadData.map(data => {
        if (data.brrId === item.returnId) {
          if (!universalCheck) {
            data.returnTo = event.value;
            data.storeId = event.value === 'store' ? data.storeId : undefined;
            data.toWareHouse = event.value === 'warehouse';
            data.userId = getUserID()
          }
        }
        return { ...data }
      })
    } else {
      newPayloadData.push(newStoreData)
    }

    this.setState({ payloadData: newPayloadData })
  }

  disableRow = (item) => {
    if (item.returnTo === 'store') {
      return this.getSelectedRow(item.returnId);
    }

    return true;
  }

  setStore = (event, pending) => {
    const { payloadData, universalCheck, pendingList } = this.state
    let newPayloadData = [...payloadData];
    let newStoreData = {};

    const orderData = payloadData.find(item => item.brrId === pending.returnId)

    const newPendingData = pendingList.map((item => {
      if (item.returnTo === 'store' && item.returnId === pending.returnId) {
        item.assignedStoreId = event.value;
        newStoreData = {
          assignedCfp: pending.cfp,
          assignedCrp: pending.crp,
          brrId: item.returnId,
          ibdId: item.inventoryId,
          storeId: event.value,
          returnTo: item.returnTo,
          toWareHouse: false,
          userId: getUserID()
        }
      } else {
        newStoreData = {
          assignedCfp: 0,
          assignedCrp: 0,
          brrId: item.id,
          storeId: undefined,
          ibdId: item.ibdId,
          returnTo: item.returnTo,
          toWareHouse: true,
          userId: getUserID()
        }
      }
      return item;
    }));

    if (orderData) {
      newPayloadData = payloadData.map(data => {
        if (pending.returnTo === 'store' && data.brrId === pending.returnId) {
          if (!universalCheck) {
            data.storeId = event.value;
            data.returnTo = pending.returnTo;
            data.toWareHouse = pending.returnTo === 'warehouse';
            data.userId = getUserID()
          }
        }
        return { ...data }
      })
    } else {
      newPayloadData.push(newStoreData)
    }

    this.setState({ payloadData: newPayloadData, pendingList: newPendingData })
  }

  setCRP = (event, item) => {
    let newData = this.state.payloadData.map(listItem => {
      if (item.returnId === listItem.brrId)
        listItem.assignedCrp = Number(event.target.value);
      return listItem;
    });

    this.setState({ payloadData: newData })
  }

  setCFP = (event, item) => {
    let newData = this.state.payloadData.map(listItem => {
      if (item.returnId === listItem.brrId)
        listItem.assignedCfp = Number(event.target.value);
      return listItem;
    });

    this.setState({ payloadData: newData })
  }

  getCfpValue = (pending) => {
    const { payloadData } = this.state
    const orderData = payloadData.find(payload => payload.brrId === pending.returnId)
    if (orderData) {
      return orderData.cfp
    }
  }

  getCrpValue = (pending) => {
    const { payloadData } = this.state
    const orderData = payloadData.find(payload => payload.brrId === pending.returnId)
    if (orderData) {
      return orderData.crp
    }
  }

  handleChange = (e) => {
    const { payloadData, pendingList } = this.state
    const { onCheckBox } = this.props
    if (e.target.checked && payloadData.length) {
      const newPayloadData = payloadData.map(data => {
        delete data.storeId
        return data
      })

      this.setState({ payloadData: newPayloadData })
    }
    this.setState({
      universalCheck: e.target.checked,
      pendingList: pendingList.map(item => {
        item.returnTo = 'store';
        return item;
      })
    })
    onCheckBox(false)
  }

  setStoreValue = (value) => {
    this.setState({ store: value })
  }

  getSelectedRow = (oId) => {
    const { bulkOrderIds } = this.state;
    if (bulkOrderIds.includes(oId)) {
      return false;
    }
    return true;
  }

  render() {
    const { open, total, pageNumber, showMultiButton, closeAssignShowroom } = this.props
    const { pendingList, universalCheck, store } = this.state

    return (
      <div>
        <div className='row mt-2 ml-1' >
          <div className='mr-3'>
            <h4 className="countHeader"> {`${`Total Records: ${total}`}`} </h4>
          </div>
          {
            // showMultiButton && PERMISSIONS.FRANCHISE.includes(getRole()) &&
            <>
              <div>
                <Button color="success" className="rounded no-margin" type="button" onClick={this.assignInventory} disabled={pendingList.length === 0} style={{ marginBottom: '5px' }}>Update</Button>
                <Button color="success" className="rounded no-margin" type="button" onClick={this.openCheckBox} disabled={pendingList.length === 0} style={{ marginBottom: '5px' }}>Multi Assign</Button>
              </div>
            </>
          }
          {
            // showMultiButton && (PERMISSIONS.FRANCHISE.includes(getRole())) && pendingList.length !== 0 &&
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
                      onChange={(event) => this.handleAllChecked(event.target.checked)}
                    />
                  </TableCell>
                }
                {

                  columns.map(column => column.label === 'Assign Showroom' ? (
                    <TableCell key={column.id}  style={{ width: '200px' }}>
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
                    inventoryId,
                    returnId,
                    registrationNumber,
                    storeName,
                    inspectionAmount,
                    invoiceAmount,
                    refundAmount,
                  } = pending
                  return (
                    <TableRow
                      hover tabIndex={-1}
                      key={returnId}
                      role="checkbox"
                      onClick={() => this.handleChecked(pending)}
                    >
                      {
                        open &&
                        <TableCell>
                          <Checkbox
                            color='primary'
                            style={{ float: 'left' }}
                            checked={this.state.bulkOrderIds.includes(returnId)}
                            onChange={(event) => this.handleMultiChecked(event.target.checked, returnId, pending)}
                          />
                        </TableCell>
                      }
                      {
                        universalCheck &&
                        <TableCell>
                          <Checkbox
                            color='primary'
                            style={{ float: 'left' }}
                            checked={this.state.bulkOrderIds.includes(returnId)}
                            onChange={(event) => this.handleMultiChecked(event.target.checked, returnId, pending)}
                          />
                        </TableCell>
                      }
                      <TableCell>
                        <p> {renderString(inventoryId)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {renderString(returnId)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {renderString(registrationNumber)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {renderString(storeName)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getAmount(inspectionAmount)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getAmount(invoiceAmount)} </p>
                      </TableCell>
                      <TableCell>
                        <p> {getAmount(refundAmount)} </p>
                      </TableCell>
                      <TableCell>
                        <Fragment>
                          {
                            showMultiButton && !universalCheck &&
                            (PERMISSIONS.FRANCHISE_CENTRAL.includes(getRole())) &&
                            <div className={classname("city-dropdown-container")}>
                              <Select
                                classNamePrefix="city-dropdown"
                                options={this.getReturnDropDownItems()}
                                placeholder='Return to'
                                onChange={(event) => this.setReturnTo(event, pending)}
                                searchable={false}
                                isDisabled={this.getSelectedRow(returnId)}
                                isSearchable={true}
                              />
                            </div>
                          }
                          {
                            (PERMISSIONS.FRANCHISE.includes(getRole())) && !universalCheck && closeAssignShowroom &&
                            <div className={classname("city-dropdown-container", styles.dropDownFieldContainer)} style={{ margin: '0' }}>
                              <Select
                                classNamePrefix="city-dropdown"
                                options={this.getReturnDropDownItems()}
                                placeholder='Return to'
                                onChange={(event) => this.setReturnTo(event, pending)}
                                searchable={false}
                                isDisabled={this.getSelectedRow(returnId)}
                                isSearchable={true}
                              />
                            </div>
                          }
                        </Fragment>
                      </TableCell>
                      <TableCell>
                        <Fragment>
                          {
                            showMultiButton && !universalCheck &&
                            (PERMISSIONS.FRANCHISE_CENTRAL.includes(getRole())) &&
                            <div className={classname("city-dropdown-container", styles.dropDownFieldContainer)}>
                              <Select
                                classNamePrefix="city-dropdown"
                                options={this.getStoresBasedOnCityId()}
                                placeholder='Showroom'
                                onChange={(event) => this.setStore(event, pending)}
                                // value={this.getStoreValue(orderID)}
                                searchable={false}
                                isDisabled={this.disableRow(pending)}
                                isSearchable={true}
                              />
                            </div>
                          }
                          {
                            (PERMISSIONS.FRANCHISE.includes(getRole())) && !universalCheck && closeAssignShowroom &&
                            <div className={classname("city-dropdown-container", styles.dropDownFieldContainer)} style={{ margin: '0' }}>
                              <Select
                                classNamePrefix={"city-dropdown"}
                                options={this.getStoresBasedOnCityId()}
                                placeholder='Showroom'
                                onChange={(event) => this.setStore(event, pending)}
                                searchable={false}
                                isDisabled={this.disableRow(pending)}
                                isSearchable={true}
                              />
                            </div>
                          }
                        </Fragment>
                      </TableCell>
                      <TableCell>
                          <input type='number' value={this.getCrpValue(pending)} onChange={(e) => this.setCRP(e, pending)} disabled={this.disableRow(pending)} style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none', width: '70px' }}></input>
                      </TableCell>
                      <TableCell>
                          <input type='number' value={this.getCfpValue(pending)} onChange={(e) => this.setCFP(e, pending)} disabled={this.disableRow(pending)} style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none', width: '70px' }}></input>
                      </TableCell>
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
                  current={pageNumber}
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
  pendingList: state.pendingReturnInventory.pendingReturnInventory,
  total: state.pendingReturnInventory.count,
  pageNumber: state.pendingReturnInventory.pageNumber,
  franchiseStoreList: state.franchiseStores.storeListByCityId
})

export default connect(mapStateToProps)(PendingReturnInventory)


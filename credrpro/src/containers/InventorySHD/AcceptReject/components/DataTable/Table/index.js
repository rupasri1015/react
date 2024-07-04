import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Chip from '@material-ui/core/Chip'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import NoResultFound from '../../../../../../shared/components/NoResultFound'
import { getDate, getBikeName, getKmsDriven, getAmount, capaitalize, renderString } from '../../../../../../core/utility'
import { getInventoryByStatusShd, resetInventoryByStatusShd } from '../../../../../../redux/actions/listinventoryShdAction'
import isEqual from 'lodash/isEqual'
import VehicleDetailDialog from '../../Dialogs/vehicleDetailDailog'
import imgEdit from '../../../../../../shared/img/icons/edit.svg'
import { makeStyles } from "@material-ui/core/styles";
import DrawerSHD from '../../Dialogs/drawerClass'
import { getBikeImages } from '../../../../../../../src/core/services/inventoryServices'

const columns = [
  { id: 'Created Date', label: 'Created\u00a0Date' },
  { id: 'Store Name', label: 'Store\u00a0Name', },
  { id: 'City', label: 'City' },
  { id: 'Vehicle Details', label: 'Vehicle\u00a0Details', maxWidth: 200 },
  { id: 'Inventory Type', label: 'Inventory Type' },
  { id: 'Status', label: 'Status' },
  // { id: 'Actions', label: 'Actions' }
]

const columnsRejected = [
  { id: 'Created Date', label: 'Created\u00a0Date' },
  { id: 'Rejected Date', label: 'Rejected\u00a0Date' },
  { id: 'Store Name', label: 'Store\u00a0Name', },
  { id: 'City', label: 'City' },
  { id: 'Vehicle Details', label: 'Vehicle\u00a0Details', maxWidth: 200 },
  { id: 'Inventory Type', label: 'Inventory Type' },
  { id: 'Status', label: 'Status' }
]

const columnsWithoutAction = [
  { id: 'Created Date', label: 'Created\u00a0Date' },
  { id: 'Store Name', label: 'Store\u00a0Name', },
  { id: 'City', label: 'City' },
  { id: 'Vehicle Details', label: 'Vehicle\u00a0Details', maxWidth: 200 },
  { id: 'Inventory Type', label: 'Inventory Type' },
  { id: 'Status', label: 'Status' },
]

class InventoryTable extends Component {

  state = {
    showVehicleInfo: false,
    data: [],
    editDirect: false,
    selectedID: '',
    drawerClass: 'table-drawer disable',
    disableRow: false,
    enhancedImages: {},
    rowData: []
  }

  componentDidMount() {
    const { dispatch, status } = this.props
    dispatch(getInventoryByStatusShd({ page: 1, status, isShdBike: true }))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetInventoryByStatusShd())
  }

  componentDidUpdate(prevProps) {
    const { inventory, setStatus, isRegistrationSearch, status } = this.props
    if (!isEqual(inventory, prevProps.inventory)) {
      if (isRegistrationSearch && inventory && inventory.length === 1) {
        setStatus(inventory[0].status)
      }
      if (prevProps !== status) {
        this.setState({
          drawerClass: 'table-drawer disable'
        })
      }
    }
  }

  pageChange = (pageNumber) => {
    const { drawerClass } = this.state
    const { page, onPageChange } = this.props
    if (page !== pageNumber) {
      onPageChange(pageNumber)
      this.setState({
        drawerClass: 'table-drawer disable'
      })
    }
  }

  showDetails = (list) => {
    const { onShowDetails } = this.props
    onShowDetails(list)
  }

  rejectInventory = (rejectData) => {
    const { onRejectInventory } = this.props
    if (onRejectInventory) {
      onRejectInventory(rejectData)
      this.closeDrawer()
    }
  }

  acceptInventory = acceptData => {
    const { onAcceptInventory } = this.props
    if (onAcceptInventory) {
      onAcceptInventory(acceptData)
    }
  }

  handleRegistratn = (id) => {
    if (id) {
      this.setState({
        showVehicleInfo: true,
        data: id,
        disableRow: true,
      })
    }
  }

  handleClose = () => {
    const { onRefreshPage } = this.props
    this.setState({
      showVehicleInfo: false,
      editDirect: false,
    })
    onRefreshPage()
  }

  closeDrawer = () => {
    this.setState({ drawerClass: 'table-drawer disable' })
  }

  handleEnableEdit = () => {
    this.setState({
      editDirect: true,
      disableRow: true
    })
  }

  useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      marginTop: theme.spacing.unit * 3,
      overflowX: "auto"
    },
    table: {
      minWidth: 700
    },
    tableRow: {
      "&$selected, &$selected:hover": {
        backgroundColor: "#FBEEED"
      }
    },
    tableCell: {
      "$selected &": {
        color: "yellow"
      }
    },
    hover: {},
    selected: {}
  })
  )

  handleRowChange = (list) => {
    const { drawerClass, disableRow } = this.state
    this.setState({
      rowData: list
    })
    // if (drawerClass === 'table-drawer disable') {
    this.setState({
      drawerClass: 'table-drawer',
      selectedID: list.id,
    })
    getBikeImages(list.id)
      .then(apires => {
        if (apires.valid || apires.isValid) {
          this.setState({
            enhancedImages: apires.resultSet
          })
        }
      })
    // }

    if (disableRow) {
      this.setState({
        disableRow: false
      })
    }
    this.setState({
      selectedID: list.id,
    })
  }

  render() {
    const { showVehicleInfo, data, editDirect, selectedID, drawerClass, disableRow, enhancedImages, rowData, status } = this.state
    const { inventory, page, total, status: pageStatus, onRefreshPage } = this.props
    return (
      <div className='table-container'>
        <div className="table-wraper">
          <Table size="small">
            <TableHead>
              <TableRow>
                {pageStatus.toLowerCase() === 'pending' ? (
                  columns.map(column => (
                    <TableCell key={column.id} style={{ maxWidth: column.maxWidth }}>
                      {column.label}
                    </TableCell>
                  ))
                ) :
                  pageStatus.toLowerCase() === 'rejected' ?
                    (
                      columnsRejected.map(column => (
                        <TableCell key={column.id} style={{ maxWidth: column.maxWidth }}>
                          {column.label}
                        </TableCell>
                      ))
                    )
                    : (
                      columnsWithoutAction.map(column => (
                        <TableCell key={column.id} style={{ maxWidth: column.maxWidth }}>
                          {column.label}
                        </TableCell>
                      ))
                    )}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                Boolean(inventory.length) && inventory.map((inventoryItem, index) => {
                  const {
                    createdDate,
                    inspectedUserName,
                    cityName,
                    bikeMake,
                    bikeModel,
                    bikeVariant,
                    registrationNumber,
                    kmsDriven,
                    inspectedPrice,
                    manufactureDate,
                    status,
                    storeName,
                    rejectedDate,
                    id,
                    inventoryType
                  } = inventoryItem
                  return (
                    <TableRow
                      tabIndex={-1}
                      key={`${inventoryItem.id}${index}`}
                      onClick={() => this.handleRowChange(inventoryItem)}
                      selected={selectedID === inventoryItem.id}
                      classes={{ hover: this.useStyles.hover, selected: this.useStyles.selected }}
                      className={this.useStyles.tableRow}
                    >
                      <TableCell>
                        <p>{getDate(createdDate)}</p>
                      </TableCell>
                      {
                        status && status.toLowerCase() === 'rejected' &&
                        <TableCell>
                          <p>{getDate(rejectedDate)}</p>
                        </TableCell>
                      }
                      <TableCell>
                        <p>{renderString(storeName)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{renderString(cityName)}</p>
                      </TableCell>
                      <TableCell>
                        <p className="link" style={{ color: '#55B7EF' }} onClick={() => this.handleRegistratn(inventoryItem)} >{renderString(registrationNumber)}
                          <img src={imgEdit} alt="edit" style={{ width: '15px', marginLeft: '5px' }} onClick={() => this.handleEnableEdit(inventoryItem)} />
                        </p>
                      </TableCell>
                      <TableCell>

                        <p>{renderString(inventoryType)}</p>
                        {/* <p>{getDate(manufactureDate)}</p> */}
                      </TableCell>
                      <TableCell>
                        {
                          status ?
                            <Chip
                              label={capaitalize(status)}
                              classes={{ colorPrimary: capaitalize(status) }}
                              color="primary"
                            /> : '-'
                        }
                      </TableCell>
                      {/* {
                      status ? status.toLowerCase() === 'pending' && (
                        <TableCell>
                          <button className="btn-outline--small blue" onClick={() => this.showDetails(inventoryItem)}>Accept</button>
                          <button className="btn-outline--small reject" onClick={() => this.rejectInventory(inventoryItem)}>Reject</button>
                        </TableCell>
                      )
                        :
                        <TableCell>-</TableCell>
                    } */}
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
          <div className="table-paginator">
            {
              Boolean(inventory.length) ?
                <Pagination
                  className="float-right"
                  locale={localeInfo}
                  current={page}
                  total={total}
                  pageSize={12}
                  showQuickJumper
                  onChange={this.pageChange}
                /> :
                <NoResultFound />
            }
          </div>
        </div>
        {
          showVehicleInfo &&
          <VehicleDetailDialog
            showVehicleInfo={showVehicleInfo}
            data={data}
            onClose={this.handleClose}
            editDirect={editDirect}
          />
        }
        {
          <DrawerSHD
            drawer={Boolean(inventory.length) && disableRow === false ? drawerClass : 'table-drawer disable'}
            // open={callToCustomer}
            data={data}
            closeDrawer={this.closeDrawer}
            enhancedImages={enhancedImages}
            handleReject={this.rejectInventory}
            rowData={rowData}
            onRefreshPage={onRefreshPage}
            status={pageStatus}
            id={selectedID}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  inventory: state.inventoryShd.inventoryList,
  page: state.inventoryShd.page,
  total: state.inventoryShd.count
})

export default withRouter(connect(mapStateToProps)(InventoryTable))
import React, { useState } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import NoResultFound from '../../../../../../shared/components/NoResultFound'
import action from '../../../../../../shared/img/icons/action-icon.svg'
import { getDate, getBikeName, getKmsDriven, getAmount, capaitalize, renderString } from '../../../../../../core/utility'
import DrawerSHD from '../../Dialogs/drawerClass'
import { getBikeImages } from '../../../../../../../src/core/services/inventoryServices'
import { updateInventory } from '../../../../../../../src/core/services/inventoryServices'
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../../../../redux/actions/notificationAction'

const columns = [
  { id: 'Created Date', label: 'Created\u00a0Date' },
  { id: 'Published Date', label: 'Published\u00a0Date' },
  { id: 'Inspector Name', label: 'Inspector\u00a0Name' },
  { id: 'Outlet Name', label: 'Outlet\u00a0Name' },
  { id: 'City', label: 'City' },
  { id: 'Vehicle Detail', label: 'Vehicle\u00a0Detail', maxWidth: 200 },
  { id: 'Manufacture Date', label: 'Manufacture\u00a0Date' },
  { id: 'Status', label: 'Status' },
  { id: 'View Details', label: 'View Details' },
  { id: 'Actions', label: 'Actions' }
]

const PublishedInventory = ({ inventory, page, status,total, onPageChange, onUnPublishInventory, onEditPrice, showDetails }) => {

  const [anchorElement, setElement] = useState(null)
  const [inventoryState, setInventory] = useState(null)
  const [disableRow, setDisableRow] = useState(false)
  const [drawerClass, setDrawerClass] = useState('table-drawer disable')
  const [data, setData] = useState('')
  const [rowData, setRowData] = useState([])
  const [enhancedImages, setEnhancedImages] = useState([])



  const rejectInventory = (rejectData) => {
    const { onRejectInventory } = this.props
    if (onRejectInventory) {
      onRejectInventory(rejectData)
    }
  }
  const closeDrawer=()=>{
    setDrawerClass('table-drawer disable')
  }

  const pageChange = (pageNumber) => {
    if (page !== pageNumber) {
      onPageChange(pageNumber)
    }
  }

  const setAnchorElement = (anchorTag = null, inventoryData = null) => {
    setElement(anchorTag)
    setInventory(inventoryData)
  }
  const dispatch = useDispatch();

  const unpublishInventory = (data) => {
    console.log(data,'data')
    if(onUnPublishInventory)
    {
      onUnPublishInventory(data)
      setAnchorElement()
    }
    // updateInventory(data)
    //   .then(apiResaponse => {
    //     if (apiResaponse.isValid) {
    //       dispatch(setNotification('success', 'Success', apiResaponse.message))
    //     } else {
    //       dispatch(setNotification('danger', 'Error', apiResaponse.message))
    //     }
    //   })
    
  }
  const handleRowChange = (list) => {
    // const { drawerClass, disableRow } = this.state
    setRowData(list)
    
    if (drawerClass === 'table-drawer disable') {
      setDrawerClass('table-drawer')
      // this.setState({
      //   drawerClass: 'table-drawer',
      //   selectedID: list.id,
      // })
      getBikeImages(list.id)
        .then(apires => {
          if(apires.valid || apires.isValid) {
            setEnhancedImages(apires.resultSet)
            // this.setState({
            //   enhancedImages: apires.resultSet
            // })
          }
        })
    }
    // else {
    //   setDrawerClass('table-drawer disable')
    //   // this.setState({
    //   //   drawerClass: 'table-drawer disable',
    //   //   selectedID: list.id
    //   // })
    // }
    if (disableRow) {
      setDisableRow(false)
    }
    // this.setState({
    //   selectedID: list.id,
    // })
  }
  const editPrice = () => {
    if (onEditPrice) {
      onEditPrice(inventoryState)
    }
    setAnchorElement()
  }

  return (
    <div className='table-container'>
    <div className="table-wraper">
      <Table size="small">
        <TableHead>
          <TableRow>
            {
              columns.map(column => (
                <TableCell key={column.id} style={{ maxWidth: column.maxWidth }}>
                  {column.label}
                </TableCell>
              ))
            }
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
                price,
                manufactureDate,
                status,
                storeName,
                publishedDate,
                id
              } = inventoryItem
              return (
                <TableRow hover tabIndex={-1} key={`${inventoryItem.id}${index}`} onClick={()=>handleRowChange(inventoryItem)}>
                  <TableCell>
                    <p>{getDate(createdDate)}</p>
                  </TableCell>
                  <TableCell>
                    <p>{getDate(publishedDate)}</p>
                  </TableCell>
                  <TableCell>
                    <p>{renderString(inspectedUserName)}</p>
                  </TableCell>
                  <TableCell>
                    <p>{renderString(storeName)}</p>
                  </TableCell>
                  <TableCell>
                    <p>{renderString(cityName)}</p>
                  </TableCell>
                  <TableCell>
                    <p>{getBikeName(bikeMake, bikeModel, bikeVariant)}</p>
                    <p>{renderString(registrationNumber)}</p>
                    <p>{getKmsDriven(kmsDriven)}</p>
                    {<p>{getAmount(price)}</p>}
                  </TableCell>
                  <TableCell>
                    <p>{getDate(manufactureDate)}</p>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={capaitalize(status)}
                      classes={{ colorPrimary: capaitalize(status) }}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <button className="btn-outline--small blue" onClick={() => showDetails(id)}>View&nbsp;Summary</button>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <img src={action} id={id} alt="Action" role="button" className="action-icon" onClick={(e) => setAnchorElement(e.currentTarget, inventoryItem)} />
                  </TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
      <Menu
        anchorEl={anchorElement}
        keepMounted
        open={Boolean(anchorElement)}
        onClose={() => setAnchorElement()}
      >
        {/* <MenuItem onClick={unpublishInventory}>Un-Publish</MenuItem> */}
        <MenuItem onClick={editPrice}>Edit Price</MenuItem>
      </Menu>
      <div className="table-paginator">
        {
          Boolean(inventory.length) ?
            <Pagination
              className="float-right"
              current={page}
              total={total}
              pageSize={12}
              showQuickJumper
              onChange={pageChange}
              locale={localeInfo}
            /> :
            <NoResultFound />
        }
        {
          console.log(drawerClass)
        }
        
      </div>
     
    </div>
    {
          status === 'PUBLISHED' &&
          <DrawerSHD
            drawer={Boolean(inventory.length) && disableRow === false ? drawerClass : 'table-drawer disable'}
            // open={callToCustomer}
            data={data}
            closeDrawer={closeDrawer}
            enhancedImages={enhancedImages}
            handleReject={unpublishInventory}
            rowData={rowData}
            // onRefreshPage={onRefreshPage}
          />
        }
    </div>
  )
}

export default PublishedInventory
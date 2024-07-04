import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import edit from '../../../shared/img/icons/edit-icon.svg'
import { priorityList } from '.././../../redux/actions/bikePriorityAction'
import { getPriorityList } from '.././../../core/services/bikePriorityServices'
import { getAmount, getBikeName, getOnlyDate, renderString, capaitalize } from '.././../../core/utility'
import NoResultFound from '.././../../shared/components/NoResultFound'
import { showLoader, hideLoader } from '.././../../redux/actions/loaderAction'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import { Button } from 'reactstrap'

const columns = [
  { id: 'cityName', label: 'City Name' },
  { id: 'cityRank', label: 'City Rank' }
]

const cityCols = [
  { id: 'cityName', label: 'City Name' },
  { id: 'cityRank', label: 'City Rank' }
]

const cityStroeCols = [
  { id: 'storeName', label: 'Store Name' },
  { id: 'storeRank', label: 'Store Rank' }
]

const cityStoreModelCols = [
  { id: 'model', label: 'Model' },
  { id: 'modelRank', label: 'Model Rank' }
]

const cityModelCols = [
  { id: 'model', label: 'Model' },
  { id: 'modelRank', label: 'Model Rank' }
]

const listCols = [
  { id: 'cityName', label: 'City' },
  { id: 'bikeName', label: 'Bike Name' },
  { id: 'publishedDate', label: 'Published Date' },
  { id: 'storeName', label: 'Store Name' },
  { id: 'registrationNumber', label: 'Registration Number' },
  { id: 'storeTypeName', label: 'Store Type' },
  { id: 'price', label: 'Price' },
  { id: 'rank', label: 'Rank' }
]

class ListingTable extends Component {

  state = {
    open: true,
    inputValue: '',
    uniqueId: '',
    listOfPriority: [],
    selectedId: null,
    setOne: false,
    setTwo: false
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(priorityList())
    let payload = { cityCategory: true }
    this.getListOfPriorities(payload)
  }

  getListOfPriorities = (payload) => {
    const { dispatch, status } = this.props
    dispatch(showLoader())
    getPriorityList(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          if (status === 'CITY') {
            this.setState({
              listOfPriority: apiResponse.priorityCategory.cityCategoryDetails.map(list => ({
                id: list.cityId,
                priorityValue: '',
                textBoxStatus: true
              })),
            })
          }
          if (status === 'CITYSTORE') {
            this.setState({
              listOfPriority: apiResponse.priorityCategory.cityStoreCategoryDetails.map(list => ({
                id: list.storeId,
                priorityValue: '',
                textBoxStatus: true
              })),
            })
          }
          if (status === 'CITYSTOREMODEL') {
            this.setState({
              listOfPriority: apiResponse.priorityCategory.cityStoreModelCategoryDetails.map(list => ({
                id: list.modelId,
                priorityValue: '',
                textBoxStatus: true
              })),
            })
          }
          if (status === 'CITYMODEL') {
            this.setState({
              listOfPriority: apiResponse.priorityCategory.cityModelCategoryDetails.map(list => ({
                id: list.modelId,
                priorityValue: '',
                textBoxStatus: true
              })),
            })
          }
          dispatch(hideLoader())
        }
      })
  }

  componentDidUpdate(prevPros) {
    const { dispatch, status, filters } = this.props
    if (prevPros.status !== this.props.status) {
      this.setState({ inputValue: '', open: true, selectedId: null })
    }
    if (prevPros.prioList !== this.props.prioList) {
      const { prioList } = this.props
      if (prioList && prioList.length) {
        this.setState({ listOfPriority: prioList })
      }
    }
    if (prevPros.filters !== this.props.filters) {
      let payload = {}
      this.setState({ listOfPriority: [] })
      if (status === 'CITY') {
        this.setState({ listOfPriority: [] })
        payload.cityCategory = true
        this.getListOfPriorities(payload)
      }
      if (status === 'CITYSTORE') {
        this.setState({ listOfPriority: [] })
        payload.cityStoreCategory = true
        payload.cityId = filters.city && filters.city.value
        this.getListOfPriorities(payload)
      }
      if (status === 'CITYSTOREMODEL') {
        this.setState({ listOfPriority: [] })
        payload.cityStoreModelCategory = true
        payload.cityId =  filters.city && filters.city.value
        payload.storeId = filters.outlet && filters.outlet.value
        this.getListOfPriorities(payload)
      }
      if (status === 'CITYMODEL') {
        this.setState({ listOfPriority: [] })
        payload.cityModelCategory = true
        payload.cityId =  filters.city && filters.city.value
        this.getListOfPriorities(payload)
      }
    }
  }

  get tableHeaders() {
    const { status } = this.props
    switch (status) {
      case 'CITY': return cityCols
      case 'CITYSTORE': return cityStroeCols
      case 'CITYSTOREMODEL': return cityStoreModelCols
      case 'CITYMODEL': return cityModelCols
      case 'LISTVIEW': return listCols
      case 'PREVIEW': return listCols
      default: return columns
    }
  }

  openTextBox = (id) => {
    const { listOfPriority } = this.state
    const openTbox = listOfPriority.find(doc => doc.id === id)
    if (openTbox)
      this.setState({ open: false, selectedId: id })
  }

  closeTextBox = (id) => {
    this.setState({ open: true, selectedId: null })
  }

  setInputValue = (e, id) => {
    const { listOfPriority } = this.state
    const regexp = /^[0-9\b]+$/
    const priorityList = listOfPriority.find(list => list.id === id)
    if (priorityList) {
      const newListOfPriority = listOfPriority.filter(list => list.id !== id)
      if (e.target.value === '' || regexp.test(e.target.value)) {
        priorityList.priorityValue = e.target.value
        this.setState({ listOfPriority: [...newListOfPriority, priorityList] })
      }
    }
  }

  getPriorityValue = (id) => {
    const { listOfPriority } = this.state
    const priorityList = listOfPriority.find(doc => doc.id === id)
    if (priorityList)
      return priorityList.priorityValue
    return 0
  }

  getOnlyInput = (id) => {
    const { listOfPriority } = this.state
    const priorityList = listOfPriority.find(doc => doc.id === id)
    if (priorityList) return true
    return false
  }

  getOpenStatus = (id) => {
    const { listOfPriority } = this.state
    const priorityList = listOfPriority.find(doc => doc.id === id)
    if (priorityList) return true
    return priorityList && priorityList.textBoxStatus && priorityList.textBoxStatus
  }

  getList = () => {
    const { status, priorityBasedList, priorityStoreList, priorityStoreModelList, priorityCityModelList, inventoryList } = this.props
    if (status === 'CITY' && priorityBasedList && Boolean(priorityBasedList.length)) {
      return priorityBasedList
    }
    if (status === 'CITYSTORE' && priorityStoreList && Boolean(priorityStoreList.length)) {
      return priorityStoreList
    }
    if (status === 'CITYSTOREMODEL' && priorityStoreModelList && Boolean(priorityStoreModelList.length)) {
      return priorityStoreModelList
    }
    if (status === 'CITYMODEL' && priorityCityModelList && Boolean(priorityCityModelList.length)) {
      return priorityCityModelList
    }
    if (status === 'LISTVIEW' && inventoryList && Boolean(inventoryList.length)) {
      return inventoryList
    }
    else return []
  }

  pageChange = pageNum => {
    const { onPageChange } = this.props
    if (onPageChange) {
      onPageChange(pageNum)
    }
  }

  submitPriorities = (type) => {
    const { listOfPriority } = this.state
    const { status, onSubmitPriority, filters } = this.props
    let payload = {}
    if (status === 'CITY') {
      const getPriorityList = listOfPriority.filter(list => {
        return list.priorityValue !== ''
      })
      payload = {
        cityCategory: true,
        priorityCategory: {
          cityCategoryDetails: getPriorityList.map(list => {
            return {
              cityId: list.id,
              cityPriority: list.priorityValue
            }
          })
        }
      }
    }

    if (status === 'CITYSTORE') {
      const getPriorityList = listOfPriority.filter(list => {
        return list.priorityValue !== ''
      })
      payload = {
        cityStoreCategory: true,
        priorityCategory: {
          cityStoreCategoryDetails: getPriorityList.map(list => {
            return {
              cityId: filters.city.value,
              storeId: list.id,
              storePriority: list.priorityValue
            }
          })
        }
      }
    }

    if (status === 'CITYSTOREMODEL') {
      const getPriorityList = listOfPriority.filter(list => {
        return list.priorityValue !== ''
      })
      payload = {
        cityStoreModelCategory: true,
        priorityCategory: {
          cityStoreModelCategoryDetails: getPriorityList.map(list => {
            return {
              cityId: filters.city.value,
              storeId: filters.outlet.value,
              modelId: list.id,
              modelPriority: list.priorityValue
            }
          })
        }
      }
    }

    if (status === 'CITYMODEL') {
      const getPriorityList = listOfPriority.filter(list => {
        return list.priorityValue !== ''
      })
      payload = {
        cityModelCategory: true,
        priorityCategory: {
          cityModelCategoryDetails: getPriorityList.map(list => {
            return {
              cityId: filters.city.value,
              modelId: list.id,
              modelPriority: list.priorityValue
            }
          })
        }
      }
    }
    window.scrollTo(0, 0)
    onSubmitPriority(payload, type, status)
  }

  getTableData = () => {
    const { inventoryList, filterInventoryList } = this.props
    if (inventoryList && Boolean(inventoryList.length)) {
      return inventoryList
    }
    if (filterInventoryList && Boolean(filterInventoryList.length)) {
      return filterInventoryList
    }
    return []
  }

  render() {
    const { status, inventoryList, page, showTables, totalCount, pageNumber, filterInventoryList, total } = this.props
    const { open, listOfPriority, uniqueId, selectedId } = this.state
    return (
      <Fragment>
        {
          showTables && status !== 'LISTVIEW' && status !== 'PREVIEW' &&
          <div className="list_table-wraper mt-5" style={{ width: '100%', maxWidth: '645px' }}>
            <Table size='small' >
              <TableHead >
                <TableRow >
                  {
                    this.tableHeaders.map(column => (
                      <TableCell key={column.id}>
                        {column.label}
                      </TableCell>
                    ))
                  }
                </TableRow>
              </TableHead>
              <TableBody >
                {
                  this.getList().map((list) => {
                    const {
                      cityName,
                      cityId,
                      cityPriority,
                      storeName,
                      storePriority,
                      modelName,
                      modelPriority,
                      modelId,
                      storeId
                    } = list
                    return (
                      <TableRow style={{ marginTop: '10px' }} >
                        {
                          status === 'CITY' &&
                          <TableCell>
                            <p>{cityName}</p>
                          </TableCell>
                        }
                        {
                          status === 'CITYSTORE' &&
                          <TableCell>
                            <p>{storeName}</p>
                          </TableCell>
                        }
                        {
                          status === 'CITYSTOREMODEL' &&
                          <TableCell>
                            <p>{modelName}</p>
                          </TableCell>
                        }
                        {
                          status === 'CITYMODEL' &&
                          <TableCell>
                            <p>{modelName}</p>
                          </TableCell>
                        }
                        {
                          status === 'CITY' &&
                          <TableCell>
                            {
                              selectedId !== cityId ? <p>{this.getPriorityValue(cityId) ? this.getPriorityValue(cityId) : cityPriority}
                                <span style={{ marginLeft: '10px' }}><img src={edit} alt="Edit City" style={{ width: '20px' }} role="button" className="action-icon" onClick={() => this.openTextBox(cityId)} /> </span>
                              </p>
                                :
                                <>
                                  <input type='text' value={this.getPriorityValue(cityId)} onChange={(e) => this.setInputValue(e, cityId)} disabled={open} style={{ width: '100%', maxWidth: '40px', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }} autoFocus id={uniqueId} />
                                  <span style={{ marginLeft: '20px' }}><img src={edit} alt="Edit City" style={{ width: '20px' }} role="button" className="action-icon" onClick={() => this.closeTextBox()} /> </span>
                                </>
                            }
                          </TableCell>
                        }
                        {
                          status === 'CITYSTORE' &&
                          <TableCell>
                            {
                              selectedId !== storeId ? <p>{this.getPriorityValue(storeId) ? this.getPriorityValue(storeId) : storePriority}
                                <span style={{ marginLeft: '10px' }}><img src={edit} alt="Edit City" style={{ width: '20px' }} role="button" className="action-icon" onClick={() => this.openTextBox(storeId)} /> </span>
                              </p>
                                :
                                <>
                                  <input type='text' value={this.getPriorityValue(storeId)} onChange={(e) => this.setInputValue(e, storeId)} disabled={open} style={{ width: '100%', maxWidth: '40px', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }} autoFocus />
                                  <span style={{ marginLeft: '20px' }}><img src={edit} alt="Edit City" style={{ width: '20px' }} role="button" className="action-icon" onClick={() => this.closeTextBox()} /> </span>
                                </>
                            }
                          </TableCell>
                        }
                        {
                          status === 'CITYSTOREMODEL' &&
                          <TableCell>
                            {
                              selectedId !== modelId ? <p>{this.getPriorityValue(modelId) ? this.getPriorityValue(modelId) : modelPriority}
                                <span style={{ marginLeft: '10px' }}><img src={edit} alt="Edit City" style={{ width: '20px' }} role="button" className="action-icon" onClick={() => this.openTextBox(modelId)} /> </span>
                              </p>
                                :
                                <>
                                  <input type='text' value={this.getPriorityValue(modelId)} onChange={(e) => this.setInputValue(e, modelId)} disabled={open} style={{ width: '100%', maxWidth: '40px', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }} autoFocus />
                                  <span style={{ marginLeft: '20px' }}><img src={edit} alt="Edit City" style={{ width: '20px' }} role="button" className="action-icon" onClick={() => this.closeTextBox()} /> </span>
                                </>
                            }
                          </TableCell>
                        }
                        {
                          status === 'CITYMODEL' &&
                          <TableCell>
                            {
                              selectedId !== modelId ? <p>{this.getPriorityValue(modelId) ? this.getPriorityValue(modelId) : modelPriority}
                                <span style={{ marginLeft: '10px' }}><img src={edit} alt="Edit City" style={{ width: '20px' }} role="button" className="action-icon" onClick={() => this.openTextBox(modelId)} /> </span>
                              </p>
                                :
                                <>
                                  {
                                    listOfPriority.find(doc => doc.id === modelId) && <>
                                      <input type='text' value={this.getPriorityValue(modelId)} onChange={(e) => this.setInputValue(e, modelId)} disabled={open} style={{ width: '100%', maxWidth: '40px', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }} autoFocus />
                                      <span style={{ marginLeft: '20px' }}><img src={edit} alt="Edit City" style={{ width: '20px' }} role="button" className="action-icon" onClick={() => this.closeTextBox()} /> </span>
                                    </>
                                  }
                                </>
                            }
                          </TableCell>
                        }
                      </TableRow>
                    )
                  })
                }
                {
                  status !== 'LISTVIEW' &&
                  <TableRow>
                    {
                      status === 'CITY' && <TableCell></TableCell>
                    }
                    {
                      status === 'CITYSTORE' && <TableCell></TableCell>
                    }
                    {
                      status === 'CITYSTOREMODEL' && <TableCell></TableCell>
                    }
                    {
                      status === 'CITYMODEL' && <TableCell></TableCell>
                    }
                    <TableCell>
                      <div style={{ float: 'right' }}>
                        <Button type="button" className="rounded no-margin" onClick={() => this.submitPriorities('PREVIEW')}> Preview</Button>
                        <Button color="success" type="button" className="rounded no-margin" onClick={() => this.submitPriorities('SUBMIT')}> Submit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </div>
        }
        {
          status === 'LISTVIEW' &&
          <Fragment>
            <div className="table-wraper mt-5">
              <Table size='small' >
                <TableHead >
                  <TableRow >
                    {
                      this.tableHeaders.map(column => (
                        <TableCell key={column.id}>
                          {column.label}
                        </TableCell>
                      ))
                    }
                  </TableRow>
                </TableHead>
                <TableBody >
                  {
                    this.getTableData().map((list, index) => {
                      // inventoryList && Boolean(inventoryList.length) && inventoryList.map((list, index) => {
                      const {
                        publishedDate,
                        make,
                        model,
                        variant,
                        cityName,
                        storeName,
                        displayPrice,
                        bikeRanking,
                        registrationNumber,
                        storeTypeName
                      } = list
                      return (
                        <TableRow style={{ marginTop: '10px' }}>
                          <TableCell>
                            <p>{cityName}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getBikeName(make, model, variant)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getOnlyDate(publishedDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p> {renderString(storeName)} </p>
                          </TableCell>
                          <TableCell>
                            <p> {renderString(registrationNumber)} </p>
                          </TableCell>
                          <TableCell>
                            <p> {capaitalize(storeTypeName)} </p>
                          </TableCell>
                          <TableCell>
                            <p> {getAmount(displayPrice)} </p>
                          </TableCell>
                          <TableCell>
                            <p>{bikeRanking}</p>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
              <div className="table-paginator">
                {
                  filterInventoryList && Boolean(filterInventoryList.length) ?
                    <Pagination
                      className="float-right"
                      current={pageNumber}
                      pageSize={12}
                      locale={localeInfo}
                      onChange={this.pageChange}
                      total={total}
                    /> :
                    <NoResultFound />
                }
              </div>
            </div>
          </Fragment>
        }
        {
          status === 'PREVIEW' &&
          <Fragment>
            <div className="table-wraper mt-5">
              <Table size='small' >
                <TableHead >
                  <TableRow >
                    {
                      this.tableHeaders.map(column => (
                        <TableCell key={column.id}>
                          {column.label}
                        </TableCell>
                      ))
                    }
                  </TableRow>
                </TableHead>
                <TableBody >
                  {
                    this.getTableData().map((list, index) => {
                      // inventoryList && Boolean(inventoryList.length) && inventoryList.map((list, index) => {
                      const {
                        publishedDate,
                        make,
                        model,
                        variant,
                        cityName,
                        storeName,
                        displayPrice,
                        bikeRanking,
                        registrationNumber,
                        storeTypeName
                      } = list
                      return (
                        <TableRow style={{ marginTop: '10px' }}>
                          <TableCell>
                            <p>{cityName}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getBikeName(make, model, variant)}</p>
                          </TableCell>
                          <TableCell>
                            <p>{getOnlyDate(publishedDate)}</p>
                          </TableCell>
                          <TableCell>
                            <p> {renderString(storeName)} </p>
                          </TableCell>
                          <TableCell>
                            <p> {renderString(registrationNumber)} </p>
                          </TableCell>
                          <TableCell>
                            <p> {capaitalize(storeTypeName)} </p>
                          </TableCell>
                          <TableCell>
                            <p> {getAmount(displayPrice)} </p>
                          </TableCell>
                          <TableCell>
                            <p>{bikeRanking}</p>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
              <div className="table-paginator">
                {
                  inventoryList && Boolean(inventoryList.length) ?
                    <Pagination
                      className="float-right"
                      current={page}
                      pageSize={12}
                      locale={localeInfo}
                      onChange={this.pageChange}
                      total={totalCount}
                    /> :
                    <NoResultFound />
                }
              </div>
            </div>
          </Fragment>
        }
      </Fragment>

    )
  }
}

const mapStateToProps = (state) => ({
  priorityBasedList: state.priorityList.priorityCategory.cityCategoryDetails,
  priorityStoreList: state.priorityList.priorityCategory.cityStoreCategoryDetails,
  priorityStoreModelList: state.priorityList.priorityCategory.cityStoreModelCategoryDetails,
  priorityCityModelList: state.priorityList.priorityCategory.cityModelCategoryDetails,
  inventoryList: state.priorityList.priorityCategory.inventoryFromDb,
  filterInventoryList: state.filterListView.priorityCategory.inventoryFromDb,
  totalCount: state.priorityList.count,
  total: state.filterListView.count,
  pageNumber: state.filterListView.pageNum,
  page: state.priorityList.pageNum
})

export default connect(mapStateToProps)(ListingTable)
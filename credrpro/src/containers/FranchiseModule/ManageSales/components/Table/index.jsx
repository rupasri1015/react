import React, { Component } from 'react'
import { connect } from 'react-redux'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { getDate, getAmount, getMmvYear, renderString, } from '../../../../../core/utility'
import { getSaleDocs } from '../../../../../core/services/franchiseServices'
import TableDrawer from './TableDrawer'
import { getRole, PERMISSIONS, getCityID } from '../../../../../core/services/rbacServices'
import { getFranchiseSaleList } from '../../../../../redux/actions/franchiseSalesAction'
import NoResultFound from '../../../../../shared/components/NoResultFound'
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { makeStyles } from "@material-ui/core/styles";

class SalesTable extends Component {

  state = {
    drawerClass: 'table-drawer disable',
    saleData: [],
    splittedUrls: [],
    open: false,
    rowInfo: '',
    selectedID: ''
  }

  componentDidMount() {
    const { dispatch } = this.props
    const payload = { pageNum: 1, orderType: "desc" }
    if (PERMISSIONS.FRANCHISE.includes(getRole())) {
      payload.cityId = getCityID()
    }
    dispatch(getFranchiseSaleList(payload))
  }

  pageChange = (page) => {
    const { onPageChange } = this.props
    this.setState({ drawerClass: 'table-drawer disable' })
    if (onPageChange) {
      onPageChange(page)
    }
  }

  getPdf = (urls) => {
    if (urls.includes('$')) {
      const totalUrls = urls.split('$')
      window.open(totalUrls[1])
    }
    window.open(urls)
  }

  onRowClick = (info) => {
    this.setState({ saleData: [] })
    const { status } = this.props
    let splitUrls = info.tranactionreciptUrls.split('$')
    this.setState({ splittedUrls: splitUrls })
    const { prevLeadId, drawerClass } = this.state
    this.setState({ prevLeadId: info.leadId, rowInfo: info })
    const { leadId: leadIdd } = info
    if (!prevLeadId) {
      this.setState({ drawerClass: 'table-drawer open', selectedID: info.leadId })
    }
    if (prevLeadId === leadIdd) {
      if (drawerClass === 'table-drawer disable') {
        this.setState({ drawerClass: 'table-drawer open' })
      } else {
        this.setState({ drawerClass: 'table-drawer disable' })
      }
    }
    else {
      this.setState({ drawerClass: 'table-drawer open' })
    }
    this.setState({ prevLeadId: leadIdd, selectedID: info.leadId })
    window.scrollTo(0, 0)
    if (info.paymentStatus === 'FULL') {
      getSaleDocs(info.leadId).
        then(saleDocResponse => {
          if (saleDocResponse.isValid) {
            this.setState({
              saleData: saleDocResponse.leadIdList
            })
          }
        })
    }
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

  render() {
    const { franchiseSaleList, count, pageNum, orderType, handleSorting, direction, tableHeader } = this.props
    const { drawerClass, splittedUrls, open, rowInfo, selectedID, saleData } = this.state
    return (
      <>
        <h4 className="countHeader"> {`${`Total Records: ${count}`}`} </h4>
        <div className="table-container">
          <div className='table-wraper marginTopFranchise'>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {
                    tableHeader.map(column => (
                      <TableCell key={column.id} >
                        {column.sort ?
                          <TableSortLabel active={true}
                            direction={direction ? orderType : 'asc'}
                            onClick={handleSorting}>
                            {column.label}
                          </TableSortLabel>
                          :
                          (column.label)}
                      </TableCell>
                    ))
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  Boolean(franchiseSaleList.length) && franchiseSaleList.map(stores => {
                    const {
                      leadId,
                      soldDate,
                      cityName,
                      storeName,
                      paymentStatus,
                      customerName,
                      customerMobileName,
                      mmv,
                      ibdYear,
                      registrationNumber,
                      bikePrice,
                      margin,
                      tranactionreciptUrls,
                      rsType
                    } = stores
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={leadId}
                        onClick={() => this.onRowClick(stores)}
                        selected={selectedID === stores.leadId}
                        classes={{ hover: this.useStyles.hover, selected: this.useStyles.selected }}
                        className={this.useStyles.tableRow}
                      >
                        <TableCell>
                          <p> {getDate(soldDate)}</p>
                        </TableCell>
                        <TableCell>
                          <p> {renderString(cityName)} </p>
                        </TableCell>
                        <TableCell>
                          <p> {renderString(storeName)} </p>
                        </TableCell>
                        <TableCell>
                          <p> {renderString(registrationNumber)} </p>
                        </TableCell>
                        <TableCell>
                          <p> {getMmvYear(mmv, ibdYear)} </p>
                        </TableCell>
                        <TableCell>
                          <p> {renderString(customerName)} </p>
                        </TableCell>
                        <TableCell>
                          <p> {renderString(rsType)} </p>
                        </TableCell>
                        <TableCell>
                          <p> {renderString(customerMobileName)} </p>
                        </TableCell>
                        <TableCell>
                          <p> {renderString(paymentStatus)} </p>
                        </TableCell>

                        <TableCell>
                          <p> {getAmount(bikePrice)} </p>
                        </TableCell>
                        <TableCell>
                          <p> {getAmount(margin)} </p>
                        </TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
            <div className="table-paginator">
              {
                Boolean(franchiseSaleList.length) ?
                  <Pagination
                    className="float-right"
                    current={pageNum}
                    total={count}
                    pageSize={20}
                    onChange={this.pageChange}
                    locale={localeInfo}
                  /> :
                  <NoResultFound />
              }
            </div>
          </div>
          {
            franchiseSaleList && Boolean(franchiseSaleList.length) &&
            <TableDrawer
              drawer={drawerClass}
              transitionDuration={{ enter: 500, exit: 1000 }}
              open={open}
              onRefund={this.refundAmount}
              onMarkAsSold={this.markAsSold}
              rowInfo={rowInfo}
              splittedUrls={splittedUrls}
              saleData={saleData}
            // status={status}
            // saleData={saleData}
            />
          }
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  franchiseSaleList: state.franchiseSales.franchiseSales,
  count: state.franchiseSales.count,
  pageNum: state.franchiseSales.pageNum,
  orderType: state.franchiseSales.orderType,
})

export default connect(mapStateToProps)(SalesTable)
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableHead from '@material-ui/core/TableHead'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import { getUserID } from '../../../core/services/rbacServices'
import NoResultFound from '../../../shared/components/NoResultFound'
import { getShdCommission, resetShdCommissionList } from '../../../redux/actions/shdCommissionAction'
import { renderString, getAmount } from '../../../core/utility'
import Button from '@material-ui/core/Button';

import Visibility from '@material-ui/icons/Visibility';
import ADD from '@material-ui/icons/ControlPoint';
import Edit from '@material-ui/icons/BorderColorOutlined';

const liveColoumns = [
  { id: 'leadId', label: 'Lead\u00a0Id' },
  { id: 'vehicleNumber', label: 'Vehicle\u00a0Number', },
  { id: 'shdDetails', label: 'SHD\u00a0Details', },
  { id: 'cityName', label: 'City Name', },
  { id: 'bidAmount', label: 'Bid\u00a0Amount (Highest)', },
  { id: 'leadSource', label: 'Lead\u00a0Source', },
  // { id: 'countDownTime', label: 'Count\u00a0Down Time', },
  // { id: 'cityLevelCommission', label: 'City\u00a0Level Commission', },
  { id: 'Commission/Deduction', label: 'Commission/Deduction' }
];

const pendingColoumns = [
  { id: 'leadId', label: 'Lead\u00a0Id' },
  { id: 'vehicleNumber', label: 'Vehicle\u00a0Number', },
  { id: 'shdDetails', label: 'SHD\u00a0Details', },
  { id: 'cityName', label: 'City Name', },
  { id: 'bidAmount', label: 'Bid\u00a0Amount (Highest)', },
  { id: 'leadSource', label: 'Lead\u00a0Source', },
  { id: 'Commission/Deduction', label: 'Commission/Deduction' }

  // { id: 'cityLevelCommision', label: 'City\u00a0Level Commission', },
  // { id: 'addCommission', label: 'Add\u00a0Commission', },
  // { id: 'highestBidAfterCommission', label: 'Highest Bid After Commission' },
];

const completeColoumns = [
  { id: 'leadId', label: 'Lead\u00a0Id' },
  { id: 'vehicleNumber', label: 'Vehicle\u00a0Number', },
  { id: 'shdDetails', label: 'SHD\u00a0Details', },
  { id: 'cityName', label: 'cityName', },
  { id: 'bidAmount', label: 'Bid\u00a0Amount (Highest)', },
  { id: 'leadSource', label: 'Lead\u00a0Source', },
  { id: 'Commission/Deduction', label: 'Commission/Deduction' }

  // { id: 'cityLevelCommision', label: 'City\u00a0Level Commission', },
  // { id: 'addCommission', label: 'Add\u00a0Commission', },
  // { id: 'highestBidAfterCommission', label: 'Highest Bid After Commission' },
  // { id: 'actions', label: 'Actions' }
];

class CommissionTable extends Component {

  state = {
    commissionData: null,
    status: '',
    commission: '',
    id: ''
  }

  componentDidMount() {
    const { dispatch } = this.props
    let payload = {
      status: 'LIVE',
      pageNum: 1,
      userId: getUserID()
    }
    dispatch(getShdCommission(payload))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetShdCommissionList())
  }

  get tableHeaders() {
    const { status } = this.props
    switch (status) {
      case 'LIVE': return liveColoumns
      case 'PENDING CUSTOMER': return pendingColoumns
      case 'COMPLETED': return completeColoumns
      default: return liveColoumns
    }
  }

  openRebid = () => {
  }

  showShdDetails = (shdData) => {
    const { onShdDetails } = this.props
    onShdDetails(shdData)
  }
  view = (orderId) => {
    const { onView } = this.props
    onView(orderId)
  }
  add = (cityCom, leadID, userId, bidAmount, csm, rto, trafficChallan) => {
    console.log(cityCom, leadID, userId, bidAmount, csm, rto, trafficChallan," cityCom, leadID, userId, bidAmount, csm, rto, trafficChallan")
    const { onAdd } = this.props
    onAdd(cityCom, leadID, userId, bidAmount, csm, rto, trafficChallan)
  }
  edit = (orderId, leadID, userId) => {
    const { onEdit } = this.props
    onEdit(orderId, leadID, userId)
  }
  showVehicleDetails = (shdData) => {
    const { onVehicleDetails } = this.props
    onVehicleDetails(shdData)
  }
  setCommission = (e) => {
    this.setState({ commission: e.target.value })
  }
  submitCommission = (shdData) => {
    const { commission } = this.state
    const { onSubmitCommission } = this.props
    onSubmitCommission(commission, shdData)
  }
  handlePageChange = (page) => {
    const { onPageChange } = this.props
    onPageChange(page)
  }

  getValue = (shdData) => {
    const { id } = this.state
    if (id === shdData.id) {
      return id
    }
  }

  getHighestBidAfterCommission = (bAM, comm, cityComm) => {
    let total = 0
    if (bAM || cityComm || cityComm) {
      if (bAM) {
        total = Number(bAM)
      }
      if (comm) {
        total = Number(total - Number(comm))
      }
      if (cityComm) {
        total = total - Number(cityComm)
      }
    }
    return total
  }

  getBidAfterDeductions = (data) => {
    let total = 0
    if (data.bidAmount || data.shdAddedCommission || data.cityLevelCommission) {
      if (data.bidAmount)
        total = Number(data.bidAmount)
      if (data.shdAddedCommission)
        total = total - Number(data.shdAddedCommission)
      if (data.cityLevelCommission)
        total = total - Number(data.cityLevelCommission)
      return total
    }
    else
      return 'NA'
  }

  maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength)
    }
  }

  render() {
    const { status, showAddCommission, shdInfo, pageNum, count } = this.props
    const { commission } = this.state
    return (
      <div className="table-wraper">
        <Table size="small">
          <TableHead>
            <TableRow>
              {
                this.tableHeaders.map(row => (
                  <TableCell
                    key={row.id}
                  >
                    {row.label}
                  </TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              shdInfo && Boolean(shdInfo.length) &&
              shdInfo.map((shdData, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={`${shdData.leadId}${index}`}>
                    <TableCell>
                      {renderString(shdData.leadId)}
                    </TableCell>
                    <TableCell>
                      <p> {renderString(shdData.regNumber)} </p>
                    </TableCell>
                    <TableCell>
                      <p className="link" style={{ color: '#339DCC' }} onClick={() => this.showShdDetails(shdData)}> Highest Bidder Details </p>
                    </TableCell>
                    <TableCell>
                      {getAmount(shdData.cityName)}
                    </TableCell>
                    <TableCell>
                      {getAmount(shdData.bidAmount)}
                    </TableCell>
                      <TableCell style={{ paddingBottom: "15px", paddingTop: "15px" }}>
                        {renderString(shdData.leadSource)}
                      </TableCell>
                    <TableCell style={{ paddingBottom: "15px", paddingTop: "15px" }}>
                      {
                        status === 'LIVE' &&
                        <Button onClick={() => this.add(shdData.cityLevelCommission, shdData.leadId, shdData.userId, shdData.bidAmount, shdData.cmsPlusAmount, shdData.rtoCharges, shdData.trafficChallan)} name="index" variant="contained" style={{ backgroundColor: "#4DBD74", color: "white" }} startIcon={<ADD />}>add</Button>
                      }
                      {

                        status !== 'LIVE' && shdData.action !== "YES" &&
                        <Button onClick={() => this.view(shdData.orderId, shdData.leadId)} value="" name="index" variant="outlined" color="primary" startIcon={<Visibility />}>view</Button>
                      }
                      {shdData.action === "YES" && status !== 'LIVE' &&
                        <Button onClick={() => this.edit(shdData.orderId, shdData.leadId, shdData.userId)} name="index" variant="contained" style={{ backgroundColor: "#55B7EF", color: "white" }} startIcon={<Edit />}>edit</Button>}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <div className="table-paginator">
          {
            shdInfo && Boolean(shdInfo.length) ?
              <Pagination
                className='float-right'
                showSizeChanger={false}
                total={count}
                pageSize={10}
                current={pageNum}
                locale={localeInfo}
                onChange={this.handlePageChange}
              />
              :
              <NoResultFound />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  shdInfo: state.shdCommission.shdCommissionList,
  pageNum: state.shdCommission.pageNum,
  count: state.shdCommission.count
})

export default connect(mapStateToProps)(CommissionTable)
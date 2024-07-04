import React, { Component } from 'react'
import { connect } from 'react-redux'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import NoResultFound from '../../../../../shared/components/NoResultFound'
import { getPendingAssignList } from '../../../../../redux/actions/pendingAssignListAction'
import { getWalletBalance } from '../../../../../core/services/franchiseServices'
import { franchiseRazorPay, verifyPayment, validateRazorPayLoad, redeemUsingWallet, verifyOtp } from '../../../../../core/services/paymentServices'
import { getDate, renderString, getAmount } from '../../../../../core/utility'
import './table_drawer.scss'
import { setNotification } from '../../../../../redux/actions/notificationAction'
import TableDrawer from './TableDrawer'
import { getUserID, getUserName } from '../../../../../core/services/rbacServices'
import { RAZORPAY_ID } from '../../../../../core/constants/apiConstant'
import { userTypeDetails } from '../../../../../core/services/authenticationServices'
import ConfiramtionPopup from '../Modal'

const columns = [
  { id: 'orderID', label: 'Order ID' },
  { id: 'assigneDate', label: 'Vehicle Assigned Date' },
  { id: 'registrationNumber', label: 'Registration Number' },
  { id: 'mmv', label: 'MMV' },
  { id: 'assignedCfp', label: 'CFP' },
  { id: 'amount', label: 'Payment Made' },
  { id: 'remainingAmount', label: 'Pending Amount' },
  { id: 'paymentModeStaus', label: 'Payment Status' },
]

class OnlinePayments extends Component {

  state = {
    paymentsIds: [],
    data: [],
    drawerClass: 'table-drawer disable',
    open: false,
    pendingPaymentAmount: 0,
    walletBallance: 0,
    openWalletPopup: false,
    cfp: ''
  }

  pageChange = (pageNum) => {
    const { onPageChange } = this.props
    onPageChange(pageNum)
  }

  componentDidMount() {
    const { dispatch, storeID } = this.props
    dispatch(getPendingAssignList({ page: 1, paymentstatus: "PENDING", storeID }))
    const payload = {
      storeId: storeID
    }
    getWalletBalance(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState({ pendingPaymentAmount: apiResponse.fsmpendingAmount, walletBallance: apiResponse.walletAmount })
        }
      })
  }

  handleAllChecked = (checked) => {
    const { onlineList } = this.props
    let payload = {}
    if (checked) {
      this.setState({
        drawerClass: 'table-drawer',
        open: true,
        paymentsIds: onlineList.map(details => details.orderID),
        pendingAmount: onlineList.reduce((currentAmount, money) => {
          return Number(money.remainingAmount) + currentAmount
        }, 0),
      }, () => {
        payload.orderIds = this.state.paymentsIds
        payload.amount = this.state.pendingAmount
      })
    }
    else {
      this.setState({ paymentsIds: [], open: false, drawerClass: 'table-drawer disable' })
    }
  }

  showErrorMsg = () => {

  }

  handleMultiChecked = (checked, orderID, cfpValue) => {
    this.setState({ cfp: cfpValue })
    const { onlineList } = this.props
    let payload = {}
    this.setState(prevState => {
      let prevIds = [].concat(prevState.paymentsIds)
      if (prevIds.includes(orderID)) {
        prevIds = prevIds.filter(ids => ids !== orderID)
      } else {
        prevIds = [...prevIds, orderID]
      }
      let amount = onlineList.reduce((currentAmount, money) => {
        if (prevIds.includes(money.orderID)) {
          return Number(money.remainingAmount) + currentAmount
        }
        else {
          return currentAmount
        }
      }, 0)
      return {
        ...prevState,
        paymentsIds: prevIds,
        pendingAmount: amount,
        open: true,
        drawerClass: 'table-drawer open',
      }
    }, () => {
      payload.orderIds = this.state.paymentsIds
      payload.amount = this.state.pendingAmount
      payload.storeId = Number(this.props.storeId)
    })
    if (checked) {
      this.setState({ open: true })
    }
    else if (this.state.paymentsIds.length === 1)
      this.setState({ drawerClass: 'table-drawer disable', open: false })
  }

  handleBulk = (list) => {
    window.scrollTo(0, 0);
    this.setState({ data: list })
  }

  initiateRazorPay = () => {
    const { paymentsIds, pendingPaymentAmount } = this.state
    const payload = {
      orderIds: paymentsIds,
      userID: getUserID(),
      amount: pendingPaymentAmount
    }
    franchiseRazorPay(payload)
      .then(razorPayResponse => {
        if (razorPayResponse.isValid) {
          this.openPaymentGateway(razorPayResponse.rzOrderId, pendingPaymentAmount)
        }
      })
  }

  openPaymentGateway = (rzOrderId, pendingPaymentAmount) => {
    const { storeID } = this.props
    const self = this
    let options = {
      key: RAZORPAY_ID,
      name: getUserName(),
      amount: pendingPaymentAmount,
      description: 'Incredible Technologies Pvt. Ltd.',
      order_id: rzOrderId,
      prefill: {
        name: userTypeDetails().userType.storeName,
        email: userTypeDetails().userType.email,
        contact: userTypeDetails().userType.mobile
      },
      handler: function (response) {
        if (response) {
          const paymentData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            razorPaySignature: response.razorpay_signature,
            userId: getUserID(),
            storeId: storeID
          }
          self.verifyPaymentFromServer(paymentData, rzOrderId)
        }
      }
    }
    let razorpay = new window.Razorpay(options)
    razorpay.open()
    razorpay.on('payment.failed', (res) => {
      alert(res.error.description)
    })
  }

  verifyPaymentFromServer = (razorPayData, rzOrderId) => {
    verifyPayment(razorPayData)
      .then(verifyResponse => {
        if (verifyResponse.isValid) {
          this.loadToWallet(rzOrderId)
        }
      })
  }

  loadToWallet = (rzOrderId) => {
    const { storeID } = this.props
    const payload = {
      paymentValidated: true,
      razorpayPaymentId: rzOrderId,
      storeId: storeID
    }
    validateRazorPayLoad(payload)
      .then(loadResponse => {
        if (loadResponse.isValid) {
          this.redeemFromFranchiseWallet()
        }
      })
  }

  redeemFromFranchiseWallet = () => {
    const { paymentsIds, walletBallance } = this.state
    const { storeID } = this.props
    const payload = {
      paymentAmount: walletBallance,
      orderIds: paymentsIds,
      storeId: storeID
    }
    redeemUsingWallet(payload)
      .then(redeemResponse => {
        if (redeemResponse.isValid) {
          window.location.reload()
        }
      })
  }

  payUsingWalletAndRazor = () => {
    this.WalletAndRajorPay()
  }

  redeemFromWallet = () => {
    this.setState({ openWalletPopup: true })
  }

  closeWalletPopup = () => {
    this.setState({ openWalletPopup: false })
  }

  verifyOtp = (payload) => {
    const { dispatch, storeID } = this.props
    verifyOtp(payload)
      .then(verifyResponse => {
        if (verifyResponse.isValid) {
          this.setState({ openWalletPopup: false, drawerClass: 'table-drawer disable' })
          dispatch(setNotification('success', 'SUCCESS', verifyResponse.message))
          // dispatch(getPendingAssignList({ page: 1, paymentstatus: "PENDING", storeID }))
        }
      })
  }

  WalletAndRajorPay = () => {
    const { pendingAmount, walletBallance, paymentsIds } = this.state
    const payload = {
      orderIds: paymentsIds,
      userID: getUserID(),
      amount: Math.abs(walletBallance-pendingAmount)
    }
    franchiseRazorPay(payload)
      .then(razorPayResponse => {
        if (razorPayResponse.isValid) {
          this.openPaymentGateway(razorPayResponse.rzOrderId, pendingAmount)
        }
      })
  }

  useOnlyWallet = () => {
    const { pendingAmount, paymentsIds } = this.state
    const { storeID, dispatch } = this.props
    const payload = {
      paymentAmount: pendingAmount,
      orderIds: paymentsIds,
      storeId: storeID,
      updatedBy: getUserID()
    }
    redeemUsingWallet(payload)
      .then(redeemResponse => {
        if (redeemResponse.isValid) {
          this.setState({ openWalletPopup: false, drawerClass: 'table-drawer disable' })
          dispatch(setNotification('success', 'SUCCESS', redeemResponse.message))
          dispatch(getPendingAssignList({ page: 1, paymentstatus: "PENDING", storeID }))
        }
      })
  }

  render() {
    const { onlineList, total, page } = this.props
    const { paymentsIds, pendingAmount, drawerClass, open, pendingPaymentAmount, walletBallance, openWalletPopup, cfp } = this.state
    return (
      <div className="table-container">
        <div className="table-wraper">
          <Table size="small">
            <TableHead>
              <TableRow>
                {
                  Boolean(onlineList.length) &&
                  <TableCell>
                    <Checkbox
                      color='primary'
                      indeterminate={paymentsIds && paymentsIds.length < onlineList.length}
                      checked={paymentsIds.length === onlineList.length}
                      onChange={(event) => this.handleAllChecked(event.target.checked)}
                      onClick={() => this.handleBulk(onlineList && onlineList.map(list => list))}
                    />
                  </TableCell>
                }
                {
                  columns.map(column => (
                    <TableCell key={column.id}>
                      {column.label}
                    </TableCell>
                  ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                Boolean(onlineList.length) && onlineList.map(fhd => {
                  const {
                    orderID,
                    assigneDate,
                    registrationNumber,
                    mmv,
                    assignedCfp,
                    amount,
                    remainingAmount,
                    paymentModeStaus
                  } = fhd
                  return (
                    <TableRow hover tabIndex={-1} key={orderID}>
                      {
                        Boolean(onlineList.length) &&
                        <TableCell>
                          <Checkbox
                            color='primary'
                            style={{ float: 'left' }}
                            checked={this.state.paymentsIds.includes(orderID)}
                            onChange={(event) => this.handleMultiChecked(event.target.checked, orderID, assignedCfp)}
                            onClick={() => this.handleBulk(onlineList && onlineList.map(list => list))}
                          />
                        </TableCell>
                      }
                      <TableCell>
                        <p>{renderString(orderID)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{getDate(assigneDate)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{renderString(registrationNumber)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{renderString(mmv)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{getAmount(assignedCfp)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{getAmount(amount)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{getAmount(remainingAmount)}</p>
                      </TableCell>
                      <TableCell>
                        <p>{renderString(paymentModeStaus)}</p>
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
          <div className="table-paginator">
            {
              Boolean(onlineList.length) ?
                <Pagination
                  className="float-right"
                  current={page}
                  locale={localeInfo}
                  total={total}
                  pageSize={10}
                  onChange={this.pageChange}
                /> :
                <NoResultFound />
            }
          </div>
        </div>
        <TableDrawer
          drawer={Boolean(onlineList.length) ? drawerClass : 'table-drawer disable'}
          pendingAmount={pendingAmount}
          transitionDuration={{ enter: 500, exit: 1000 }}
          open={open}
          pendingPaymentAmount={pendingPaymentAmount}
          walletBallance={walletBallance}
          OnInitiateRazorPayPayment={this.initiateRazorPay}
          onPayUsingWalletAndRazor={this.payUsingWalletAndRazor}
          onRedeemFromWallet={this.redeemFromWallet}
          cfp={cfp}
        />
        {
          openWalletPopup &&
          <ConfiramtionPopup
            open={openWalletPopup}
            onClose={this.closeWalletPopup}
            paymentsIds={paymentsIds}
            pendingPaymentAmount={pendingPaymentAmount}
            walletBallance={walletBallance}
            onlyWalletMoney={this.useOnlyWallet}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  onlineList: state.pending.pendingList,
  total: state.pending.count,
  page: state.pending.page
})

export default connect(mapStateToProps)(OnlinePayments)
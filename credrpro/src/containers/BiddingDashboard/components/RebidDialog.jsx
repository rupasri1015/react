import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import { rebid, shdRebid } from '../../../core/services/biddingServices'
import { setNotification } from '../../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import { useDispatch } from 'react-redux'
import { Alert } from '@material-ui/lab'

const RebidDialog = ({ data, onClose, open, onRefreshPage }) => {

  const dispatch = useDispatch()

  const continueBid = () => {
    dispatch(showLoader())
    if (data.leadVehicleSellType === 'NTP' || data.leadVehicleSellType === 'TP-R' || data.leadVehicleSellType === 'TP-CP') {
      const payload = {
        auctionTransactionId: data.auctionTransactionId,
        cityId: data.cityId,
        gatePassId: data.gatePassId,
        leadId: data.leadId,
        type: "Continue"
      }
      shdRebid(payload)
        .then(apiResponse => {
          if (apiResponse.isValid) {
            dispatch(setNotification('success', 'SUCCESS', 'Bidding Started'))
          }
          else {
            dispatch(setNotification(
              'danger',
              'Error',
              apiResponse.message
            ))
          }
          dispatch(hideLoader())
          onRefreshPage()
          onClose()
        })
    }
    else {
      const payload = {
        auctionTransactionId: data.auctionTransactionId,
        cityId: data.cityId,
        gatePassId: data.gatePassId,
        leadId: data.leadId,
        type: "Continue"
      }
      rebid(payload)
        .then(apiResponse => {
          if (apiResponse.isValid) {
            dispatch(setNotification('success', 'SUCCESS', 'Bidding Started'))
          }
          else {
            dispatch(setNotification(
              'danger',
              'Error',
              apiResponse.message
            ))
          }
          dispatch(hideLoader())
          onRefreshPage()
          onClose()
        })
    }
  }

  const discardBid = () => {
    dispatch(showLoader())
    if (data.leadVehicleSellType === 'NTP' || data.leadVehicleSellType === 'TP-R' || data.leadVehicleSellType === 'TP-CP') {
      const payload = {
        auctionTransactionId: data.auctionTransactionId,
        cityId: data.cityId,
        gatePassId: data.gatePassId,
        leadId: data.leadId,
        type: "Discard"
      }
      shdRebid(payload)
        .then(apiResponse => {
          if (apiResponse.isValid) {
            dispatch(setNotification('success', 'SUCCESS', 'Bidding Started'))
          }
          else {
            dispatch(setNotification(
              'danger',
              'Error',
              apiResponse.message
            ))
          }
          dispatch(hideLoader())
          onRefreshPage()
          onClose()
        })
    }
    else {
      const payload = {
        auctionTransactionId: data.auctionTransactionId,
        cityId: data.cityId,
        gatePassId: data.gatePassId,
        leadId: data.leadId,
        type: "Continue"
      }
      rebid(payload)
        .then(apiResponse => {
          if (apiResponse.isValid) {
            dispatch(setNotification('success', 'SUCCESS', 'Bidding Started'))
          }
          else {
            dispatch(setNotification(
              'danger',
              'Error',
              apiResponse.message
            ))
          }
          dispatch(hideLoader())
          onRefreshPage()
          onClose()
        })
    }
  }


  return (
          <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
          >
            {console.log(data,'data')}
            <DialogTitle>
              Rebid <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
            </DialogTitle>
            <DialogContent>
              <DialogContentText style={{ fontSize: "20px" }}>
                Are you sure you want to rebid?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <button className="icon-btn gray" onClick={discardBid}>Discard</button>
              <button className="icon-btn" onClick={continueBid}>Continue</button>
            </DialogActions>
          </Dialog>
  )
}

export default RebidDialog
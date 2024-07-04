import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DropDown from '../../../../shared/components/form/DropDown';
import { Divider } from '@material-ui/core'
import DatePicker from '../../../../shared/components/form/DatePickerDeliver';
import './businessEntity.scss'
import { formatTimeStamp } from '../../../../core/utility'

const deliveryStatuses = [
    {
        id: 1,
        label: 'DELIVERED',
        value: 'DELIVERED'
    },
    {
        id: 2,
        label: 'PENDING',
        value: 'PENDING'
    }
]

const DeliveryConfirmPopup = ({ open, onClose, onConfirmDelivery, rowData }) => {

    const [deliveryStatus, setDeliveryStatus] = useState('');
    const [dateType, setDateType] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState(new Date());

    const confirmDelivery = () => {
        const payload = {
            deliveryStatus: deliveryStatus.value,
            deleiverdDate: formatTimeStamp(toDate),
            orderID: rowData.orderID,
            storeID: rowData.storeID
        }
        onConfirmDelivery(payload)
    }

    return (
        <Dialog
            open={open}
            maxWidth="xs"
            fullWidth
            onClose
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle style={{ textAlign: "center" }}>
                Update Delivery Status <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <div className='row'>
                    <div className='col-6'>
                        Delivery Status
                    </div>
                    <div className='col-6'>
                        <DropDown
                            options={deliveryStatuses}
                            value={deliveryStatus}
                            placeholder="Select Date Type"
                            onChange={setDeliveryStatus}
                            className="dropdown-wraper m-0"
                        />
                    </div>
                    <div className='col-6 mt-4'>
                        Delivery Delivery Date
                    </div>
                    <div className='col-6 mt-4'>
                        <DatePicker onDateChange={setToDate} startDate={toDate} />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <button className="submitBtn" color="success" onClick={confirmDelivery}>
                    <span>Confirm</span>
                </button>
            </DialogActions>
        </Dialog>
    )
}

export default DeliveryConfirmPopup
import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DropDown from '../../../shared/components/form/DropDown'
import { renderString } from '../../../core/utility'
import { getUserID } from '../../../core/services/rbacServices'

const RescheduleDialog = ({ open, onClose, data, valList, onReAssignSubmit }) => {

    const [valuator, setValuator] = useState('')
    const [valuatorError, setValuatorError] = useState(false)

    const onValuatorChange = valData => {
        setValuator(valData)
        setValuatorError(false)
    }

    const handleSubmit = () => {
        if (valuator === '') {
            setValuatorError(true)
        }
        if (valuator) {
            const payload = {
                leadId: data.leadId,
                reScheduleDate: '',
                reScheduleTime: '',
                updatedBy: getUserID(),
                type: 'REASSIGN',
                valuatorId: valuator.value
            }
            onReAssignSubmit(payload)
        }
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} disableEscapeKeyDown maxWidth="sm"  fullWidth>
                <DialogTitle>Re-Assign<span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span></DialogTitle>
                <DialogContent>
                    <div className="doc-image-conatiner">
                        <p className="name">New Valuator:</p>
                        <div className = 'row' style={{ width: '50%' }}>
                        <DropDown
                            placeholder="Select Valuator"
                            options={valList}
                            onChange={onValuatorChange}
                            value={valuator}
                            className="dropdown-wraper"
                        />
                        {
                            valuatorError && <p style={{ color: 'red' }}> *Please Enter Valuator Name</p>
                        }
                    </div>
                    </div>
                    <div className="doc-image-conatiner">
                        <p className="name">Current Date:</p>
                        <p>{data.dateAndSlot && data.dateAndSlot !== null && data.dateAndSlot.split(' : ')[0]}</p>
                    </div>
                    <div className="doc-image-conatiner">
                        <p className="name">Current Time:</p>
                        <p>{data.dateAndSlot && data.dateAndSlot !== null && data.dateAndSlot.split(' : ')[1]}</p>
                    </div>
                    <div className="doc-image-conatiner">
                        <p className="name">Valuator:</p>
                        <p>{renderString(data.valuatorName)}</p>
                    </div>
                    <div className="doc-image-conatiner">
                        <p className="name">Pincode:</p>
                        <p>{renderString(data.pincode)}</p>
                    </div>
                    <div className="doc-image-container">
                        <button className="btn-outline--small blue float-right" onClick={handleSubmit}>Confirm</button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default RescheduleDialog
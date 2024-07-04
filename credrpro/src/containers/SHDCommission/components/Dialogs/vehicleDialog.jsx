import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
// import PropTypes from 'prop-types';
// import SwipeableViews from 'react-swipeable-views';
// import { makeStyles, useTheme } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
// import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Box';
import { useDispatch } from 'react-redux'
import { Divider } from '@material-ui/core'

const VehicleDialog = ({ onClose, open }) => {

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle style={{ textAlign: 'center' }}>
                Vehicle Details <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
            </DialogTitle>
            <Divider />
            <DialogContent style={{ marginTop: '8px' }}>
                <div>
                    <div >
                        <p style={{ fontSize: '13px' }}>MMV :
                                   <span style={{fontWeight: 'bolder', letterSpacing: '0px' }}>Bajaj Pulsar 150</span>
                        </p>
                    </div>
                    <div >
                        <p style={{ fontSize: '13px' }}>Registration Number :
                                   <span style={{fontWeight: 'bolder', letterSpacing: '0px' }}>KA30EF4567</span>
                        </p>
                    </div>
                    <div >
                        <p style={{ fontSize: '13px' }}>Manufacturing Year:
                                   <span style={{fontWeight: 'bolder', letterSpacing: '0px' }}>2015</span>
                        </p>
                    </div>
                    <div >
                        <p style={{ fontSize: '13px' }}>Number of Owners:
                                   <span style={{fontWeight: 'bolder', letterSpacing: '0px' }}>02</span>
                        </p>
                    </div>
                </div>
            </DialogContent>
            <Divider />
            <DialogActions>
                <button className="icon-btn white" style={{ background: '#FFFFFF 0% 0% no-repeat padding-box;' }} onClick={onClose} >Close</button>
            </DialogActions>
        </Dialog>
    )
}

export default VehicleDialog
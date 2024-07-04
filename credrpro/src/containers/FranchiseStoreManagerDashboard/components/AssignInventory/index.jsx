import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import { getAmount } from '../../../../core/utility'
import { DialogActions, FormHelperText } from '@material-ui/core'
import { getUserID } from '../../../../core/services/rbacServices'
import { assignInventory } from '../../../../core/services/franchiseServices'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { setNotification } from '../../../../redux/actions/notificationAction'

class AssignInventory extends Component {

    state = {
        selectedIndex: -1,
        inventoryId: '',
        showError: false
    }

    closePopUp = () => {
        this.setState({ selectedIndex: '' })
        const { onClose } = this.props
        onClose()
    }

    handleItemSelect(item, index) {
        const { selectedIndex } = this.state
        this.setState({
            selectedIndex: selectedIndex === index ? -1 : index,
            inventoryId: item.inventoryID
        })
    }

    assignInventoryToLead = () => {
        const { rowInfo, dispatch, onAssignedInventory } = this.props
        const { inventoryId } = this.state
        if (inventoryId !== '') {
            const payload = {
                inventoryId: inventoryId,
                updatedBy: getUserID(),
                leadId: rowInfo.leadId,
                oldInventoryId: rowInfo.inventoryID
            }
            assignInventory(payload).
                then(assignResponse => {
                    if (assignResponse.isValid) {
                        onAssignedInventory()
                    }
                    else
                        dispatch(setNotification('danger', 'ERROR', assignResponse.message))
                })
        }
        else {
            this.setState({ showError: true })
        }
    }

    handleChange = (event) => {
        if(event.target.checked){
            this.setState({ showError: false })
        }
        else{
            this.setState({ showError: true, inventoryId: '' })
        }
    }

    render() {
        const { open, storeBikeList } = this.props
        const { showError, selectedIndex } = this.state
        return (
            <>
                <Dialog
                    open={open}
                    maxWidth="md"
                    fullWidth
                    onClose={this.closePopUp}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description" >
                    <DialogTitle style={{ textAlign: 'center' }}>
                        Assign Inventory
                        <span className="float-right" onClick={this.closePopUp} style={{ cursor: 'pointer' }}>&#10005;</span>
                    </DialogTitle>
                    <Divider style={{ height: '1px' }} />
                    <DialogContent>
                        <div className="row">
                            {/* <div className="col-lg-4 md-4 sm-4">
                                <input type="text" className="form-control" placeholder="Search by Vehicle Name " value={this.state.searchByBikeName} onChange={(e) => this.handleVehicleTypeChange(e, this.state.inventoryList)} />
                            </div>
                            <div className="col-lg-4 md-4 sm-4">
                                <input type="text" className="form-control" placeholder="Search by Registration Number " value={this.state.searchByReg} onChange={(e) => this.handleRegistrationChange(e, this.state.inventoryList)} />
                            </div> */}
                        </div>
                        <div className="row mt-3 inventoryTable">
                            <div className="col-md-12">Total inventory: {storeBikeList.length}</div>
                            <table className="table table-bordered">
                                <thead className="pb-3 pt-3">
                                    <tr>
                                        <th >Vehicle Name</th>
                                        <th >Registration Number</th>
                                        <th>Year</th>
                                        <th >Price</th>
                                        <th >Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        storeBikeList && Boolean(storeBikeList.length) ?
                                            storeBikeList.map((item, i) => (
                                                < tr
                                                    key={i}
                                                    id={"table-row"}
                                                    className={"pb-4 pt-4 active"} >

                                                    <td >
                                                        <span> {item.bikemake + " " + item.bikemodelName + " " + item.bikevariant}</span>
                                                    </td>
                                                    <td>
                                                        <span>{item.regNumber}</span>
                                                    </td>
                                                    <td>
                                                        <span>{item.mfYear}</span>
                                                    </td>

                                                    <td >
                                                        <span>Rs. {item.publishedPrice == (null || '' || undefined) ? 'N/A' : getAmount(item.publishedPrice)}</span>
                                                    </td>

                                                    <td >
                                                        <input
                                                            className="row-checkbox"
                                                            id="row-checkbox"
                                                            type="checkbox"
                                                            width="25px"
                                                            height="25px"
                                                            checked={selectedIndex === i ? true : false}
                                                            onClick={() => this.handleItemSelect(item, i)}
                                                            onChange={(event) =>this.handleChange(event)}
                                                        >
                                                        </input>
                                                    </td>

                                                </tr>
                                            )) : null}
                                </tbody>
                            </table>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <span>
                            {
                                showError && <FormHelperText style={{ color: 'red', fontSize: '17px' }}> Please select one bike to assign </FormHelperText>
                            }
                        </span>
                        <button type="button" className="btn-success btn text-center mt-2"
                            onClick={this.assignInventoryToLead}
                            color="secondary"><i className="fa fa-check-circle-o  mr-1" ></i>
                            Confirm
                        </button>
                        <button type="button" className="btn-danger btn text-center mt-2" onClick={this.closePopUp}><i className="fa fa-times" aria-hidden="true"></i>Cancel</button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}


export default withRouter(connect()(AssignInventory))

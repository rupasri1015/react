import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import './popUp.scss'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Card, CardBody, Button } from 'reactstrap'
import { getAmount } from '../../../../core/utility'
import { FormHelperText } from '@material-ui/core'
import { userTypeDetails } from '../../../../core/services/authenticationServices';
import { getMinPrice } from '../../../../core/services/franchiseServices';

class SoldPopup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showPayment: true,
            newBikePrice: this.props.rowInfo.bikePrice,
            tokenAmount: '',
            offerAmount: 0,
            bikePriceLimitError: false,
            finalPrice: 0,
            storeType: userTypeDetails().userType.storeType
        }
    }

    getAmoutToBePaid = () => {
        const { rowInfo } = this.props
        const { newBikePrice } = this.state
        let finalAmount = 0

        finalAmount = Number(rowInfo.amountPaid) + Number(newBikePrice)
        return finalAmount
    }

    goToGSTPage = () => {
        const { history, rowInfo } = this.props
        history.push({
            pathname: '/franchise-store/gst-form',
            state: { rowDataa: rowInfo, finalAmount: this.getAmoutToBePaid(), fromSales: true }
        })
    }

    goToGSTPage = () => {
        const { history, rowInfo } = this.props
        const { storeType } = this.state
        
        if (storeType === 'BFG') {
            getMinPrice(rowInfo.registrationNumber).then
            (minPriceResponse => {
                if(minPriceResponse.isValid){
                    if (Number(this.getAmoutToBePaid()) < Number(minPriceResponse.bikePriceDetails.minBikePrice)) {
                        this.setState({ bikePriceLimitError: true, finalPrice: minPriceResponse.bikePriceDetails.minBikePrice })
                    }
                    else {
                        history.push({
                            pathname: '/franchise-store/gst-form',
                            state: { rowDataa: rowInfo, finalAmount: this.getAmoutToBePaid(), fromSales: false }
                        })
                    }
                }
            })
        }
        else {
            history.push({
                pathname: '/franchise-store/gst-form',
                state: { rowDataa: rowInfo, finalAmount: this.getAmoutToBePaid(), fromSales: false }
            })
        }
    }

    onPriceChange = (e) => {
        this.setState({ newBikePrice: e.target.value, bikePriceLimitError: false })
    }

    isNumeric(evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /[0-9]|\./;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    maxLengthCheck(e) {
        if (e.target.value.length > e.target.value.maxLength)
            e.target.value = e.target.value.slice(0, e.target.value.maxLength)
    }

    render() {
        const { open, onClose, rowInfo } = this.props
        const { newBikePrice, bikePriceLimitError, finalPrice } = this.state
        return (
            <Dialog
                open={open}
                maxWidth="xs"
                fullWidth
                onClose={onClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle style={{ textAlign: 'center' }}>
                    Mark as sold <span className="float-right" onClick={onClose} style={{ cursor: 'pointer' }}>&#10005;</span>
                </DialogTitle>
                <Divider style={{ height: '1px' }} />
                <DialogContent>
                    <div className="tokenFullPayment" >
                        <label className=" font16 " style={{ marginLeft: '70px' }}><input type="radio" name="optradio" className='mr-1 mt-1' defaultChecked={true} onClick={this.openFull} />{`Pay\u00a0Remaining\u00a0Amount`}</label>
                    </div>
                    <div>
                        <Card className="tokenSaleOuter mt-4 ">
                            <CardBody>
                                <div className="row mb-2">
                                    <div className="col-sm-5">
                                        Bike Price
                                    </div>
                                    <div className="col-sm-1 text-center">:</div>
                                    <div className=" col-sm-4 pl-0 text-right customInput">
                                        {/* <input id="bikePrice" className="bikeInputs" placeholder=" &#8377;0 " value={newBikePrice} onChange={this.onPriceChange}></input> */}
                                        <input id="bikePrice" className="bikeInputs" placeholder=" &#8377;0 " value={newBikePrice} onChange={this.onPriceChange} maxLength="7" onKeyPress={this.isNumeric} onInput={this.maxLengthCheck.bind(this)}></input>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-5 font-semibold font16">
                                        Token Amount     </div>
                                    <div className="col-sm-1 text-center">:</div>
                                    <div className="col-sm-4 pl-0 font-semibold font16 text-right customInput">
                                        <input id="tokenAmount" className="bikeInputs" placeholder=" &#8377;0 " value={getAmount(rowInfo.amountPaid)} disabled></input>
                                    </div>
                                </div>
                                <Divider />
                                <div className="row">
                                    <div className="col-sm-5 font-weight-bold font17 mt-3">
                                        Total Bike Price
                                    </div>
                                    <div className="col-sm-1 text-center mt-3">:</div>
                                    <div className="col-sm-3  font-semibold font16 text-right mt-3" style={{ marginLeft: '39px' }}>
                                        {getAmount(this.getAmoutToBePaid())}
                                        <span className="mr-3">&nbsp;&nbsp;</span>
                                    </div>
                                </div>
                                <div>
                                    {
                                        bikePriceLimitError && <FormHelperText style={{ color: 'red', textAlign: 'center', marginTop: '15px' }}> Total Bike Price should be {getAmount(rowInfo.minBikePrice)} or above. </FormHelperText>
                                    }
                                </div>
                                <div className="col text-center mt-3">
                                    <Button color="success" onClick={this.goToGSTPage}>Continue</Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
}

export default withRouter(connect()(SoldPopup))
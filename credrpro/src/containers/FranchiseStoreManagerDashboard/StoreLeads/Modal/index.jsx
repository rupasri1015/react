import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'
import './popUp.scss'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Card, CardBody, Button } from 'reactstrap'
import edit from '../../../../shared/img/icons/edit-icon.svg'
import { FormHelperText } from '@material-ui/core'
import { getAmount } from '../../../../core/utility'
import { userTypeDetails } from '../../../../core/services/authenticationServices';
import { getMinPrice } from '../../../../core/services/franchiseServices';

class SoldPopup extends Component {

    constructor(props) {
        super(props)

        const { rowInfo } = this.props
        this.state = {
            showPayment: true,
            newBikePrice: rowInfo.bikeprice,
            tokenAmount: '',
            offerAmount: 0,
            tokenError: false,
            bikePriceError: false,
            tokenLimitError: false,
            bikePriceLimitError: false,
            finalPrice: 0,
            storeType: userTypeDetails().userType.storeType
        }

        this.bikeAmountRef = React.createRef();
        this.tokenAmountRef = React.createRef();
    }

    openToken = () => {
        this.setState({ showPayment: false })
    }

    openFull = () => {
        this.setState({ showPayment: true, tokenError: false })
    }

    focusTokenAmount = () => {
        this.tokenAmountRef.current.focus();
    }

    focusBikeAmount = () => {
        this.bikeAmountRef.current.focus();
    }

    onBikePriceChange = (e) => {
        this.setState({ newBikePrice: e.target.value, bikePriceError: false, bikePriceLimitError: false })
    }

    onTokenAmountChnage = (e) => {
        const { tokenLimitError } = this.state
        this.setState({ tokenAmount: e.target.value, tokenError: false })
        if (tokenLimitError) {
            this.setState({ tokenLimitError: false })
        }
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

    getAmoutToBePaid = () => {
        const { newBikePrice, tokenAmount, showPayment } = this.state
        const { rowInfo } = this.props
        let finalAmount = 0
        if (showPayment) {
            finalAmount = newBikePrice
        }
        else finalAmount = newBikePrice - tokenAmount
        return finalAmount
    }

    markAsSoldToken = () => {
        const { onMarkAsSoldToken } = this.props
        const { tokenAmount, newBikePrice } = this.state
        if (tokenAmount) {
            if (Number(tokenAmount) <= Number(newBikePrice)) {
                onMarkAsSoldToken(this.getAmoutToBePaid(), tokenAmount)
            }
            else {
                this.setState({ tokenLimitError: true })
            }
        }
        else
            this.setState({ tokenError: true })
    }

    goToGSTPage = () => {
        const { history, rowInfo } = this.props
        const { storeType } = this.state
        if (storeType === 'BFG') {
            getMinPrice(rowInfo.regnum).then
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

    checkTokenLimit = () => {
        const { newBikePrice, tokenAmount } = this.state
        if (tokenAmount <= newBikePrice) return false
        else return true
    }

    render() {
        const { open, onClose } = this.props
        const { showPayment, newBikePrice, tokenAmount, tokenError, bikePriceError, tokenLimitError, bikePriceLimitError, finalPrice, storeType } = this.state
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
                    <div className="mainSecOuter" >
                        <label className=" font16 "><input type="radio" name="optradio" className='mr-1 mt-1' defaultChecked={true} onClick={this.openFull} />Total Payment</label>
                        <label className="pull-right font16 mr-1" ><input type="radio" name="optradio" className='mt-1' onClick={this.openToken} />  Token</label>
                    </div>
                    {
                        !showPayment ?
                            <div>
                                <Card className="tokenSaleOuter mt-4 ">
                                    <CardBody>
                                        <div className="row mb-2">
                                            <div className="col-sm-5">
                                                Bike Price
                                            </div>
                                            <div className="col-sm-1 text-center">:</div>
                                            <div className=" col-sm-4 pl-0 text-right customInput">
                                                <input id="bikePrice" className="bikeInputs" placeholder=" &#8377;0 " value={newBikePrice} onChange={this.onBikePriceChange} maxLength="7" onKeyPress={this.isNumeric} onInput={this.maxLengthCheck.bind(this)} disabled></input>
                                                {/* <img src={edit} alt="Edit Valuator" role="button" className="action-icon" onClick={this.focusBikeAmount} /> */}
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-sm-5 font-semibold font16">
                                                Token Amount     </div>
                                            <div className="col-sm-1 text-center">:</div>
                                            <div className="col-sm-4 pl-0 font-semibold font16 text-right customInput">
                                                <input id="tokenAmount" className="bikeInputs" placeholder=" &#8377;0 " value={tokenAmount} ref={this.tokenAmountRef} onChange={this.onTokenAmountChnage} maxLength="7" onKeyPress={this.isNumeric} onInput={this.maxLengthCheck.bind(this)}></input>
                                                <img src={edit} alt="Edit Valuator" role="button" className="action-icon" onClick={this.focusTokenAmount} />
                                            </div>
                                            {
                                                tokenError && <FormHelperText style={{ color: 'red', marginLeft: '180px' }}> Please enter token amount</FormHelperText>
                                            }
                                            {
                                                tokenLimitError && <FormHelperText style={{ color: 'red', marginLeft: '180px' }}> Token amount should be less than bike price</FormHelperText>
                                            }
                                        </div>
                                        <Divider />
                                        <div className="row">
                                            <div className="col-sm-5 font-weight-bold font17 mt-3">
                                                Total Bike Price
                                            </div>
                                            <div className="col-sm-1 text-center mt-3">:</div>
                                            <div className="col-sm-3  font-semibold font16 text-right mt-3" style={{ marginLeft: '50px' }}>
                                                {getAmount(this.getAmoutToBePaid())}
                                                <span className="mr-3">&nbsp;&nbsp;</span>
                                            </div>
                                        </div>
                                        <div className="col text-center mt-3">
                                            <Button color="success" onClick={this.markAsSoldToken}>Generate Reciept</Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div> :
                            <div>
                                <div>
                                    <Card className="tokenSaleOuter mt-4 ">
                                        <CardBody>
                                            <div className="row mb-2">
                                                <div className="col-sm-5">
                                                    Bike Price
                                                </div>
                                                <div className="col-sm-1 text-center">:</div>
                                                <div className=" col-sm-4 pl-0 text-right customInput">
                                                    <input id="bikePrice" className="bikeInputs" placeholder=" &#8377;0 " value={newBikePrice} ref={this.bikeAmountRef} onChange={this.onBikePriceChange} maxLength="7" onKeyPress={this.isNumeric} onInput={this.maxLengthCheck.bind(this)}></input>
                                                </div>
                                            </div>
                                            <Divider />
                                            <div className="row">
                                                <div className="col-sm-5 font-weight-bold font17 mt-3">
                                                    Total Bike Price
                                                </div>
                                                <div className="col-sm-1 text-center mt-3">:</div>
                                                <div className="col-sm-3  font-semibold font16 text-right mt-3" style={{ marginLeft: '43px' }}>
                                                    {getAmount(this.getAmoutToBePaid())}
                                                    <span className="mr-3">&nbsp;&nbsp;</span>
                                                </div>
                                            </div>
                                            <div>
                                                {
                                                    bikePriceError && <FormHelperText style={{ color: 'red', marginLeft: '180px' }}> Please enter bike price</FormHelperText>
                                                }
                                                {
                                                    bikePriceLimitError && <FormHelperText style={{ color: 'red', textAlign: 'center', marginTop: '15px' }}> Please enter {getAmount(finalPrice)} or above </FormHelperText>
                                                }
                                            </div>
                                            <div className="col text-center mt-3">
                                                <Button color="success" onClick={this.goToGSTPage}>Continue</Button>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                    }
                </DialogContent>
            </Dialog>
        )
    }
}

export default withRouter(connect()(SoldPopup))
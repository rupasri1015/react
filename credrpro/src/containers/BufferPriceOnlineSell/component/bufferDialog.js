import React, { Component } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import { getAmount } from '../../../core/utility'
import { setNotification } from '../../../redux/actions/notificationAction'
import warning from '../../../shared/img/icons/warning.svg'
import { saveFMPrice } from '../../../core/services/bufferSellServices'
import { showLoader, hideLoader } from '../../../redux/actions/loaderAction'
import error from '../../../shared/img/icons/error.svg'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

const onlyNumbers = (value) => {
    if (!value) {
        return value
    }
    let onlyNumberValue = value.replace(/[^\d]/g, '')
    onlyNumberValue = onlyNumberValue.replace(/(?!^)+/g, '')
    return onlyNumberValue.slice(0, 7)
}


class BufferDataDialog extends Component {

    constructor(props) {
        super(props);
        this.input = React.createRef();
    }

    state = {
        newFmPrice: null,
        enableTextbox: false,
        fmPriceError: false,
        approvalPrice: '',
        closurePrice: ''
    }

    componentDidMount() {
        const { rowData } = this.props
        const value = Number(rowData.refurbDeductions) + Number(rowData.refurbCost)
        this.setState({
            closurePrice: value
        })
    }

    setPrice = (e) => {
        const regexp = /^[0-9\b]+$/
        if (e.target.value === '' || regexp.test(e.target.value)) {
            this.setState({
                approvalPrice: onlyNumbers(e.target.value),
                fmPriceError: false,
            })
        }
        else {
            this.setState({
                fmPriceError: true,
            })
        }
    }

    handleFmPrice = () => {
        const { dispatch, rowData, onRefreshPage } = this.props
        const { approvalPrice } = this.state
        if (this.getFinalPrice() <= Number(rowData.cutomerExpectedPrice)) {
            if (approvalPrice) {
                const payload = {
                    fmPrice: approvalPrice,
                    leadId: this.props.rowData.leadId,
                    cvUserId: this.props.rowData.cvUserId
                }
                this.setState({
                    fmPriceError: false
                })
                dispatch(showLoader())
                saveFMPrice(payload)
                    .then(apiResponse => {
                        if (apiResponse.isValid) {
                            dispatch(hideLoader())
                            this.props.onClose()
                            dispatch(setNotification('success', 'Success', apiResponse.message));
                            onRefreshPage()
                        }
                        else {
                            this.props.onClose()
                            dispatch(setNotification('danger', 'Error', apiResponse.message));
                            onRefreshPage()
                        }
                    })
            }
            else {
                this.setState({
                    fmPriceError: true
                })
            }
        }
    }

    getFinalPrice = () => {
        const { approvalPrice, closurePrice } = this.state
        let price = approvalPrice - closurePrice
        if (price && price.toString().includes('-')) {
            let actualPrice = price && price.toString().split('-')[1]
            return Number(actualPrice)
        }
        return price
    }

    render() {
        const { open, onClose, rowData } = this.props
        const { approvalPrice, fmPriceError, closurePrice } = this.state
        return (
            <div className='bufferPriceOnlineSellWrap'>
                <Dialog
                    open={open}
                    onClose={onClose}
                    maxWidth="sm"
                    className='bufferPriceOnlineSellWrap'
                >
                    <h4 style={{ color: '#0066FF', fontFamily: 'ProximaNovaSemibold', fontSize: '20px' }}>Approve Price</h4>
                    <DialogContent>
                        <div className='row'>
                            <div className='col-4 mb-1'>
                                <p style={{ fontFamily: 'ProximaNovaSemibold' }}>MMVY</p>
                            </div>
                            <div className='col-8 mb-1'>
                                <p style={{ fontFamily: 'ProximaNovaRegular' }}> {rowData.mmvy} </p>
                            </div>
                            <div className='col-4 mb-1'>
                                <p style={{ fontFamily: 'ProximaNovaSemibold' }}>Reg num</p>
                            </div>
                            <div className='col-8 mb-1'>
                                <p style={{ fontFamily: 'ProximaNovaRegular' }}> {rowData.registrationNumber} </p>
                            </div>
                            <div className='col-4 mb-1'>
                                <p style={{ fontFamily: 'ProximaNovaSemibold' }}>No of owners</p>
                            </div>
                            <div className='col-8 mb-1'>
                                <p style={{ fontFamily: 'ProximaNovaRegular' }}> {rowData.noOfOwners} </p>
                            </div>
                            <div className='col-4 mb-1'>
                                <p style={{ fontFamily: 'ProximaNovaSemibold' }}>CFP</p>
                            </div>
                            <div className='col-8 mb-1'>
                                <p style={{ fontFamily: 'ProximaNovaRegular' }}> {getAmount(rowData.cfpPrice)} </p>
                            </div>
                            <div className='col-4 mb-1'>
                                <p style={{ fontFamily: 'ProximaNovaSemibold' }}>Last Offer Price</p>
                            </div>
                            <div className='col-8 mb-1'>
                                <p style={{ fontFamily: 'ProximaNovaRegular' }}> {getAmount(rowData.lastPrice)} </p>
                            </div>
                        </div>
                        <div className='deduction-wrap'>
                            <p style={{ color: '#E51554', fontFamily: 'ProximaNovaSemibold', fontSize: '16px' }}>Deductions</p>
                            <div className='row mt-2'>
                                <div className='col-5 mb-1'>
                                    <p style={{ fontFamily: 'ProximaNovaSemibold' }}>DOC QC1 deductions</p>
                                </div>
                                <div className="col-7 mb-1">
                                    <p style={{ fontFamily: 'ProximaNovaRegular' }}> {getAmount(rowData.refurbDeductions)} </p>
                                </div>
                                <div className='col-5 mb-1'>
                                    <p style={{ fontFamily: 'ProximaNovaSemibold' }}>Refurb Cost</p>
                                </div>
                                <div className="col-7 mb-1">
                                    <p style={{ fontFamily: 'ProximaNovaRegular' }}> {getAmount(rowData.refurbCost)} </p>
                                </div>
                                <div className='col-5 mb-1'>
                                    <p style={{ fontFamily: 'ProximaNovaSemibold' }}>Total Deduction</p>
                                </div>
                                <div className="col-7 mb-1">
                                    <p style={{ fontFamily: 'ProximaNovaSemibold' }}> {getAmount(Number(rowData.refurbCost) + Number(rowData.refurbDeductions))} </p>
                                </div>
                            </div>
                        </div>
                        <div className='row' style={{ marginTop: '20px', alignItems: 'center' }}>
                            <div className='col-4' >
                                <p style={{ fontFamily: 'ProximaNovaSemibold', marginBottom: '10px' }}>Customer Expected Price</p>
                            </div>
                            <div className='col-8'>
                                <p style={{ fontFamily: 'ProximaNovaRegular', marginBottom: '10px' }}>{getAmount(rowData.cutomerExpectedPrice)}</p>
                            </div>
                            {
                                rowData && rowData.leadStatus === 'REQUEST_NEW_PRICE' &&
                                <>
                                    <div className='col-4 mb-1'>
                                        <p style={{ fontFamily: 'ProximaNovaSemibold' }}>Enter Approval Price <span style={{ color: '#da2128' }}>*</span></p>
                                    </div>
                                    <div className='col-8 mb-1'>
                                        <input type='text' value={approvalPrice} autoFocus placeholder='Enter Amount' onChange={this.setPrice} style={{ maxWidth: '220px', padding: '6px 9px', border: '1px solid #EFF1F7', width: '100%', fontFamily: 'ProximaNovaRegular' }}></input>
                                        {
                                            fmPriceError &&
                                            <p style={{ color: '#da2128', fontSize: '14px', fontFamily: 'ProximaNovaRegular', marginTop: '0px' }}>*Please enter approval price </p>
                                        }
                                    </div>
                                </>
                            }
                            <div className='col-4' style={{ marginTop: '10px' }}>
                                <span style={{ fontFamily: 'ProximaNovaSemibold', marginTop: '10px' }}>Customer Closure Price</span>
                            </div>
                            <div className='col-8' style={{ marginTop: '15px' }}>
                                <span className='closure-price'> {approvalPrice ? getAmount(this.getFinalPrice()) : getAmount('0')}</span>
                            </div>
                            {
                                this.getFinalPrice() < Number(rowData.cutomerExpectedPrice) &&
                                <div className='col-12' style={{ marginTop: '20px' }}>
                                    <span className='warning-below'><img src={error} alt='error' style={{ width: '20px' }} /> Below customer expected price</span>
                                </div>
                            }
                            {
                                this.getFinalPrice() > Number(rowData.cutomerExpectedPrice) &&
                                <div className='col-12' style={{ marginTop: '20px' }}>
                                    <span className='warning-above'><img src={error} alt='error' style={{ width: '20px' }} /> Exceeded customer expected price</span>
                                </div>
                            }
                            <div className='col-12'>
                                <p style={{ color: '#2996E5', marginTop: '15px', fontFamily: 'ProximaNovaSemibold', lineHeight: '1.3', display: 'flex', alignItems: 'flex-start' }}><img src={warning} alt='warning' style={{ width: '25px', marginRight: '5px' }} /> Deductions are already applied on customer closure price <br /> Approval price should be inclusive of Refurb Cost and DOCQC-1 deductions   </p>
                            </div>
                        </div>
                    </DialogContent>
                    {
                        rowData && rowData.leadStatus === 'REQUEST_NEW_PRICE' &&
                        <DialogActions>
                            <button className='approve-btn' onClick={this.handleFmPrice}>APPROVE</button>
                        </DialogActions>
                    }
                </Dialog>
            </div>
        )
    }

}
export default connect()(BufferDataDialog)
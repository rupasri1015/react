import React, { Component } from 'react'
import pdf from '../../../../shared/img/icons/PDFIcon.svg'
import Upload from '../../../../shared/components/form/UploadKyc'
import { uploadMultiImages } from '../../../../core/services/documentQcServices'
import { uploadCustomerKyc, getInvoicees, markAsSold } from '../../../../core/services/franchiseServices'
import { showLoader, hideLoader } from '../../../../redux/actions/loaderAction'
import { setNotification } from '../../../../redux/actions/notificationAction'
import { userTypeDetails } from '../../../../core/services/authenticationServices';
import ImagePreview from '../../../../shared/components/ImagePreview'
import { Button } from 'reactstrap';
import { connect } from 'react-redux'
import './pdf.scss'
import { getUserID } from '../../../../core/services/rbacServices'
import moment from 'moment'
import { FormHelperText } from '@material-ui/core'

class PDFPage extends Component {

    state = {
        urls: [],
        showSaveContinue: false,
        uploadImages: [],
        showPdfs: false,
        invoice: '',
        saleReceipt: '',
        warrantyCard: '',
        selfDeclaration: '',
        showNotSupportedError: false
    }

    removeImage = removeUrl => {
        const { urls } = this.state
        const images = [].concat(urls)
        this.setState({ urls: images.filter(url => url !== removeUrl) })
        if (urls.length !== 1)
            this.setState({ showSaveContinue: true })
        else
            this.setState({ showSaveContinue: false })
    }

    uploadImagesForDelvivery = images => {
        this.setState({ showNotSupportedError: false })
        const { dispatch } = this.props
        dispatch(showLoader())
        const formData = new FormData()
        images.forEach(file => {
            formData.append('file', file)
        })
        uploadMultiImages(formData)
            .then(apiResponse => {
                if (apiResponse.isValid) {
                    this.setState(prevState => ({ urls: [...prevState.urls, ...apiResponse.urls] }))
                    this.setState({ showSaveContinue: true })
                } else {
                    dispatch(setNotification('danger', 'Error', apiResponse.message))
                }
                dispatch(hideLoader())
            })
    }

    getKyc = (urls) => {
        var docs = []
        var payload = {
            documentIdType: "customerKyc",
            imageUrl: urls
        }
        docs.push(payload)
        return docs;
    }

    submitKyc = (urls) => {
        const { dispatch, store, startTime } = this.props
        const { state } = this.props.location
        const storeID = userTypeDetails().userType.storeId;
        let payloadOne = {}
        if (state.fromSales) {
            payloadOne = {
                regnum: state.rowInfo.rowDataa.registrationNumber,
                name: state.rowInfo.rowDataa.customerName,
                number: state.rowInfo.rowDataa.customerMobileName,
                make: state.rowInfo.rowDataa.make,
                model: state.rowInfo.rowDataa.model,
                variant: state.rowInfo.rowDataa.varient,
                city: state.rowInfo.rowDataa.cityName,
                leadCreatedDate: state.rowInfo.rowDataa.leadCreatedDate,
                bikeprice: state.rowInfo.rowDataa.bikePrice,
                referralId:state.rowInfo.referralId,
                storeId: storeID,
                leadID: state.rowInfo.rowDataa.leadId,
                amountPaid: Number(state.rowInfo.rowDataa.bikePrice) - Number(state.rowInfo.rowDataa.offer),
                paymentStatus: 'FULL',
                updatedBy: getUserID(),
                requestType: 'TOKENTOFULL',
                paperTransferCost: '',
                insuranceCost: '',
                finalBikePrice: Number(state.rowInfo.rowDataa.bikePrice) - Number(state.rowInfo.rowDataa.offer) - Number(state.rowInfo.rowDataa.tokenAmountPaid),
                createdDate: moment(startTime).format('YYYY-MM-DD HH:mm:ss')
            }
        }
        else {
            payloadOne = {
                regnum: state.rowInfo.rowDataa.regnum,
                name: state.rowInfo.rowDataa.name,
                number: state.rowInfo.rowDataa.number,
                make: state.rowInfo.rowDataa.make,
                model: state.rowInfo.rowDataa.model,
                variant: state.rowInfo.rowDataa.variant,
                city: state.rowInfo.rowDataa.city,
                leadCreatedDate: state.rowInfo.rowDataa.leadCreatedDate,
                bikeprice: state.invoicePayload.amount,
                discount: state.rowInfo.rowDataa.discount,
                storeId: storeID,
                referralId:state.rowInfo.referralId,
                leadID: state.rowInfo.rowDataa.leadId,
                amountPaid: state.invoicePayload.amount,
                paymentStatus: 'FULL',
                updatedBy: getUserID(),
                requestType: '',
                paperTransferCost: '',
                insuranceCost: '',
                finalBikePrice: state.invoicePayload.amount,
                createdDate: moment(startTime).format('YYYY-MM-DD HH:mm:ss')
            }
        }
        dispatch(showLoader())
        const payload = {
            leadId: state.rowInfo.rowDataa.leadId,
            mobileNumber: state.rowInfo.rowDataa.number,
            documents: this.getKyc(urls)
        }
        uploadCustomerKyc(payload).
            then(kycResponse => {
                if (kycResponse.isValid) {
                    let payload = {}
                    dispatch(setNotification('success', 'SUCCESS', 'Successfully Updated'))
                    if (state.otherCharges === false) {
                        payload = {
                            ...state.invoicePayload,
                            warrCode: state.wrntyCode,
                            createdDate: moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
                        }
                    }
                    else {
                        payload = {
                            ...state.invoicePayload,
                            warrCode: state.wrntyCode,
                            createdDate: moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
                            otherCharges: [{
                                ...state.otherCharges
                            }]
                        }
                    }
                    getInvoicees(payload).
                        then(invoiceResponse => {
                            if (invoiceResponse.isValid) {
                                markAsSold(payloadOne).
                                then(soldResponse => {
                                    if (soldResponse.isValid) {
                                    }
                                })
                                this.setState({ showPdfs: true })
                                this.setState({
                                    invoice: invoiceResponse.secondaryInvoice.invoiceUrl,
                                    saleReceipt: invoiceResponse.secondaryInvoice.salesRecUrl,
                                    warrantyCard: invoiceResponse.secondaryInvoice.warrCardUrl,
                                    selfDeclaration: invoiceResponse.secondaryInvoice.slfDecUrl
                                }, )
                                dispatch(hideLoader())
                                dispatch(setNotification('success', 'SUCCESS', invoiceResponse.message))
                            }
                            else {
                                dispatch(hideLoader())
                                dispatch(setNotification('danger', 'ERROR', invoiceResponse.message))
                            }
                        })
                }
            })
    }

    downloadInvoice = () => {
        const { invoice } = this.state
        window.open(invoice)
    }

    downloadSaleReceipt = () => {
        const { saleReceipt } = this.state
        window.open(saleReceipt)
    }

    downloadWarrantyCard = () => {
        const { warrantyCard } = this.state
        window.open(warrantyCard)
    }

    downloadSelfDeclaration = () => {
        const { selfDeclaration } = this.state
        window.open(selfDeclaration)
    }

    throwNotImageError = () => {
        this.setState({ showNotSupportedError: true })
    }

    render() {
        const { urls, showSaveContinue, showPdfs, showNotSupportedError } = this.state
        const { rowInfo } = this.props
        return (
            <div>
                {
                    showPdfs ?
                        <>
                            <h3 >Click to view the PDFs</h3>
                            <div style={{ marginTop: '10px' }}>
                                <button className='pdfBtn' onClick={() => this.downloadInvoice()}>
                                    <img src={pdf} alt='pdf' style={{ width: '17px', marginRight: '7px' }} />
                                    Invoice
                                </button>
                                <button className='pdfBtn' style={{ marginLeft: '10px' }} onClick={() => this.downloadSaleReceipt()}>
                                    <img src={pdf} alt='pdf' style={{ width: '17px', marginRight: '7px' }} />
                                    Sale Reciept
                                </button>
                                <button className='pdfBtn' style={{ marginLeft: '10px' }} onClick={() => this.downloadWarrantyCard()}>
                                    <img src={pdf} alt='pdf' style={{ width: '17px', marginRight: '7px' }} />
                                    Warranty Card
                                </button>
                                <button className='pdfBtn' style={{ marginLeft: '10px' }} onClick={() => this.downloadSelfDeclaration()}>
                                    <img src={pdf} alt='pdf' style={{ width: '17px', marginRight: '7px' }} />
                                    Self Declaration
                                </button>
                            </div>
                        </>
                        :
                        <>
                            <h3 >Upload Customer KYC </h3>
                            <div style={{ display: 'inline-block', minWidth: 115, marginTop: '10px' }}>
                                <Upload
                                    accept="image/*"
                                    onFileChange={this.uploadImagesForDelvivery}
                                    multiple
                                    id='file'
                                    onNotSupported={this.throwNotImageError}
                                />
                                {
                                    showNotSupportedError && <FormHelperText style={{ color: '#c00' }}>Upload only Images</FormHelperText>
                                }
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                {
                                    Boolean(urls.length) &&
                                    urls.map(url => <ImagePreview key={url} url={url} onRemove={() => this.removeImage(url)} />)
                                }
                            </div>
                            {
                                showSaveContinue &&
                                <div style={{ marginTop: '20px' }}>
                                    <Button color="success" type="button" className="rounded no-margin" onClick={() => this.submitKyc(urls)}>
                                        Submit
                                    </Button>
                                </div>
                            }
                        </>
                }
            </div>
        )
    }

}

export default connect()(PDFPage)
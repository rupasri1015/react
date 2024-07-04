import React, { Component, Fragment } from 'react'
import { Button, Card, CardBody, Input } from 'reactstrap'
import TabPanel from '../DocumentQcBikeDetails/components/DocumentQcTabPanel'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Upload from '../../shared/components/form/Upload'
import { viewPendingDetails, submitStage1Docs, getSMSForStages } from '../../core/services/paperTransferService'
import { uploadMultiImages } from '../../core/services/documentQcServices'
import ImageViewer from '../../shared/components/ImageViewer'
import { setNotification } from '../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../redux/actions/loaderAction'
import ImagePreview from '../../shared/components/ImagePreview'
import FormLabel from '@material-ui/core/FormLabel'
import { connect } from 'react-redux'
import NoResultsFound from '../../shared/components/NoResultFound'
import { getUserID } from '../../core/services/rbacServices'
import PaperVehicleDetails from './component/vehicleDeatils'

const Mandatory = ({ mandatory, name }) => mandatory ? <p style={{ textTransform: 'capitalize' }}>{name.toLowerCase()}&nbsp;<span className="red-star">*</span></p> : <p style={{ textTransform: 'capitalize' }}>{name.toLowerCase()}</p>

class PaperTransferTab extends Component {
  state = {
    currentTab: 0,
    imageurls: [],
    currentIndex: 0,
    imageOpen: false,
    documents: [],
    approveStatus: [],
    qcBikeDetails: [],
    isDialogOpen: false,
    isDisputeOpen: false,
    challanAmount: '',
    showChallan: false,
    Amount: '',
    showConditionButton: false,
    costForRC: '',
    costForChallan: '',
    costForKyc: '',
    costForNoc: '',
    priceForNoDocs: [],
    challanbikeDis: '',
    vehicleDetail: [],
    imageDocuments: [],
    challanTwo: '',
    Data: this.props.location.state.detail,
    documentName: ''
  }

  componentDidMount() {
    const { match } = this.props
    this.paperDocument(match.params.leadId)
  }


  paperDocument = (leadId) => {
    const { dispatch } = this.props
    dispatch(showLoader())
    viewPendingDetails(leadId)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState({
            qcBikeDetails: apiResponse.bikeDocList,
            approveStatus: apiResponse.bikeDocList.map(doc => ({
              id: doc.id,
              mandatory: doc.mandatoryField,
              documentName: doc.docKey
            })),
            vehicleDetail: apiResponse.vehicleDetails,
          })
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
        }
        dispatch(hideLoader())
      })
  }

  handleTabChange = (event, nextValue) => {
    this.setState({ currentTab: nextValue })
  }

  tabProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    }
  }

  openImageViewer = (imageList, index, caption) => {
    if (Array.isArray(imageList)) {
      const imgs = imageList.map(img => ({ src: img, caption: caption }))
      this.setState({
        documents: imgs,
      })
    }
    else {
      this.setState({
        documents: [{ src: imageList, caption }]
      })
    }
    this.setState({
      currentIndex: index,
      imageOpen: true
    })
  }

  closeImageViewer = () => {
    this.setState({
      imageOpen: false,
      documents: [],
      currentIndex: 0
    })
  }

  nextImage = () => {
    const { currentIndex } = this.state
    this.setState({
      currentIndex: currentIndex + 1
    })
  }

  previousImage = () => {
    const { currentIndex } = this.state
    this.setState({
      currentIndex: currentIndex - 1
    })
  }

  uploadImagesForDelvivery = documents => {
    const { dispatch } = this.props
    const formData = new FormData()
    documents.forEach(file => {
      formData.append('file', file)
    })
    return uploadMultiImages(formData)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          return apiResponse.urls
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
          return null
        }
      })
  }


  fileChangedHandler = (files, id) => {
    const { imageurls } = this.state
    const documentIndex = imageurls.findIndex(doc => doc.id === id)
    if (documentIndex === -1) {
      if (files.length) {
        this.uploadImagesForDelvivery(files)
          .then(urls => {
            if (urls) {
              const newUrls = imageurls.concat({
                urls,
                id
              })
              this.setState({ imageurls: newUrls })
            }
          })
      }
    } else {
      if (files.length) {
        this.uploadImagesForDelvivery(files)
          .then(urls => {
            if (urls) {
              const newState = imageurls.map(url => {
                if (url.id === id) {
                  url.urls = url.urls.concat(urls)
                }
                return url
              })
              this.setState({ imageurls: newState })
            }
          })
      }
    }
  }


  updateDocQcPayload = () => {
    const { approveStatus, imageurls, Data, documentName } = this.state
    const { dispatch } = this.props
    const payload = {  leadID: this.props.match.params.leadId, ptStatus: 'COLLECTED' }
    const docs = approveStatus.map(doc => {
      const imageKey = imageurls.findIndex(img => img.id === doc.id)
      const { mandatory, ...rest } = doc
      if (imageKey === -1) {
        return { ...rest }
      } else {
        return { ...rest, urls: imageurls[imageKey].urls }
      }
    })

    payload.documents = docs.map(doc => {
      const { id, urls, documentName } = doc
      if (urls) {
        return {
           documentId: id, imageUrl: urls, documentType: documentName
        }
      }
      else
        return { documentId: id,  documentType: documentName}
    })
      this.updatePaperTransformDetails(payload)
  }


  updatePaperTransformDetails = (payload) => {
    const { vehicleDetail, Data } = this.state
    const { dispatch } = this.props
    dispatch(showLoader())
    submitStage1Docs(payload)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          const payload = {
            leadId: this.props.match.params.leadId,
            ptStatus: 'COLLECTED',
            customerMobileNumber: Data.customerMobileNumber,
            ptCurrentStage: 1,
            customerName: Data.customerName,
            cityName: Data.cityName
          }
          getSMSForStages(payload)
          .then(apiResponse => {
            if (apiResponse.isValid) {
              dispatch(setNotification('success', 'Success', apiResponse.message))
              this.props.history.push('/paperTransfer')
            }
          })
        } 
        else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))
          dispatch(hideLoader())
        }
      })
  }



  getImagesById = (id) => {
    const { imageurls } = this.state
    const doc = imageurls.filter(docs => docs.id === id)
    return doc.length ? doc[0].urls : []
  }

  removeImage = (id, key) => {
    const { imageurls } = this.state
    const newState = imageurls.map(doc => {
      if (doc.id === id) {
        doc.urls.splice(key, 1)
      }
      return doc
    }).filter(docs => docs.urls.length)
    this.setState({ imageurls: newState })
  }


  handleClose = () => {
    this.setState({ isDialogOpen: false, isDisputeOpen: false })
  }

  handleOpen = () => {
    this.setState({ isDialogOpen: true})
  }

  onlyNumber = (value) => {
    if (!value) {
      return value
    }
    let onlyNumberValue = value.replace(/[^\d]/g, '')
    onlyNumberValue = onlyNumberValue.replace(/(?!^)+/g, '')
    return onlyNumberValue.startsWith('0') ? '' : onlyNumberValue
  }

  getDocAmount = (id) => {
    const { approveStatus } = this.state
    const doc = approveStatus.find(doc => doc.id === id)
    if (doc) return doc.docAmount
    return 0
  }

  render() {

    const { currentTab, imageOpen, documents, currentIndex, qcBikeDetails, isDialogOpen, costForNoDocument, priceForNoDocs, showChallan, challanbikeDis, vehicleDetail, imageDocuments, isDisputeOpen, Data } = this.state
    return (
      <Fragment>
        {
          !qcBikeDetails.length ? <NoResultsFound /> :
            < div className="tab-container" >
              <Tabs
                orientation="vertical"
                value={currentTab}
                onChange={this.handleTabChange}
                classes={{ indicator: 'indicator-color' }}
                style={{ marginTop: 10 }}
              >
                {
                  Boolean(qcBikeDetails.length) && qcBikeDetails.map(qclist => (
                    <Tab
                      key={qclist.id}
                      label={<Mandatory mandatory={qclist.mandatoryField === 'TRUE'} name={qclist.docName} />}
                      className="tab-style"
                      {...this.tabProps(qclist.id)}
                    />
                  ))
                }
                <Tab label="Vehicle Details" className="tab-style" {...this.tabProps(3)} />
              </Tabs>
              {
                Boolean(qcBikeDetails.length) && qcBikeDetails.map((doclist, index) => (
                  <TabPanel key={doclist.id} value={currentTab} index={index}>
                    <h1 className="tab-heading">{doclist.docName}</h1>
                    {/* <FormLabel className="doc-label" style={{ marginTop: '10px', fontWeight: 'bolder' }}>Documents Received</FormLabel> */}
                    <div className="doc-container">
                      <div className="docs">
                        {
                          doclist.imageUrl && doclist.imageUrl.length && doclist.imageUrl.map((img, docIndex) => {
                            return (
                              <div key={`${img}${docIndex}`} className="doc-preview" onClick={() => this.openImageViewer(doclist.imageUrl, docIndex, doclist.docName)}>
                                <img src={img} alt={doclist.docName} />
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 doc-received-header">Add Image*</div>
                      <div className="col-12 upload-image">
                        <Upload
                          accept="image/*"
                          onFileChange={(files) => this.fileChangedHandler(files, doclist.id)}
                          multiple
                        />
                      </div>
                    </div>
                    {
                      Boolean(this.getImagesById(doclist.id).length) &&
                      this.getImagesById(doclist.id).map((url, index) =>
                        <ImagePreview className="imageview" key={`${url}${index}`} url={url} onRemove={() => this.removeImage(doclist.id, index)} />
                      )
                    }
                  </TabPanel>
                ))
              }
              {
                Boolean(Object.keys(vehicleDetail).length) &&
                <>
                  <TabPanel value={currentTab} index={qcBikeDetails.length}>
                    <PaperVehicleDetails vehicle={vehicleDetail} />
                  </TabPanel>
                </>
              }
            </div>
        }
        {
          Boolean(qcBikeDetails.length) &&
          <div>
            <Card>
              <CardBody style={{ height: 65 }}>
                {
                  <Button color="success" type="button" className="rounded no-margin documentQcbutton" onClick={() => this.updateDocQcPayload()}>Submit</Button>
                }
              </CardBody>
            </Card>
          </div>
        }
        {
          imageOpen &&
          <ImageViewer
            documents={documents}
            isOpen={imageOpen}
            currentIndex={currentIndex}
            onClickNext={this.nextImage}
            onClickPrev={this.previousImage}
            onClose={this.closeImageViewer}
          />
        }
      </Fragment >
    )
  }
}

export default connect()(PaperTransferTab)
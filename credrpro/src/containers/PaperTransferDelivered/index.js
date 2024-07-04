import React, { Component, Fragment } from 'react'
import TabPanel from '../DocumentQCViewOnly/components/DocumentQcTabPanel'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { viewOtherLeads, getSMSForStages } from '../../core/services/paperTransferService'
import { getQcBikeDocuments } from '../../core/services/documentQcServices'
import ImageViewer from '../../shared/components/ImageViewer'
import { setNotification } from '../../redux/actions/notificationAction'
import { showLoader, hideLoader } from '../../redux/actions/loaderAction'
import { connect } from 'react-redux'
import NoResultsFound from '../../shared/components/NoResultFound'
import VehicleDetails from '../PaperViewDetails/component/vehicleDetail'
import { Button, Card, CardBody } from 'reactstrap'
import Upload from '../../shared/components/form/Upload'
import ImagePreview from '../../shared/components/ImagePreview'
import { uploadMultiImages } from '../../core/services/documentQcServices'

const Mandatory = ({ mandatory, name }) => mandatory ? <p style={{ textTransform: 'capitalize' }}>{name.toLowerCase()}&nbsp;<span className="red-star">*</span></p> : <p style={{ textTransform: 'capitalize' }}>{name.toLowerCase()}</p>

class PaperTransferDelivered extends Component {
  state = {
    currentTab: 0,
    imageurls: [],
    currentIndex: 0,
    imageOpen: false,
    images: [],
    approveStatus: [],
    qcBikeDetails: [],
    vehicleDetail: [],
    imageDocuments: [],
    Data: this.props.location.state.detail,
    imageURLS: []
  }

  componentDidMount() {
    const { match } = this.props
    this.paperdocumentDetails(match.params.leadId)
  }


  paperdocumentDetails = (leadId) => {
    const { dispatch } = this.props
    dispatch(showLoader())
    viewOtherLeads(leadId)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          this.setState({
            qcBikeDetails: apiResponse.qcBikeDoc,
            approveStatus: apiResponse.qcBikeDoc.map(doc => ({
              status: null,
              id: doc.docID,
              mandatory: doc.mandatory
            })),
            vehicleDetail: apiResponse.vehicleDetails,
            imageDocuments: apiResponse.inspsParams
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
        images: imgs,
      })
    }
    else {
      this.setState({
        images: [{ src: imageList, caption }]
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
      images: [],
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

  getImagesById = (id) => {
    const { imageurls } = this.state
    const doc = imageurls.filter(docs => docs.id === id)
    return doc.length ? doc[0].urls : []
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
              this.setState({ imageurls: newUrls, imageURLS: urls })
            }
          })
      }
    }
    else {
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
              let onlyUrls = newState.map(urls => urls.urls)
              this.setState({ imageurls: newState, imageURLS: onlyUrls[0] })
            }
          })
      }
    }
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

  render() {
    const { currentTab, imageOpen, images, currentIndex, qcBikeDetails, vehicleDetail, imageUrl } = this.state
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
                      key={qclist.docID}
                      label={<Mandatory mandatory={qclist.mandatory === 'TRUE'} name={qclist.docDisplayName} />}
                      className="tab-style"
                      {...this.tabProps(qclist.docID)}
                    />
                  ))
                }
                <Tab label="Vehicle Details" className="tab-style" {...this.tabProps(3)} />
              </Tabs>
              {
                Boolean(qcBikeDetails.length) && qcBikeDetails.map((doclist, index) => (
                  <TabPanel key={doclist.docID} value={currentTab} index={index}>
                    <h1 className="tab-heading">{doclist.docDisplayName}</h1>
                    <div className="doc-container" style={{ alignItems: 'flex-start', minHeight: 300 }}>
                      <div className="docs">
                        {
                          doclist.imageUrl.length && doclist.imageUrl.map((img, docindex) => {
                            return (
                              <div key={`${img}${docindex}`} className="doc-preview" onClick={() => this.openImageViewer(doclist.imageUrl, docindex, doclist.docDisplayName)}>
                                <img src={img} alt={doclist.docDisplayName} />
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  </TabPanel>
                ))
              }
              {
                Boolean(Object.keys(vehicleDetail).length) &&
                <>
                  <TabPanel value={currentTab} index={qcBikeDetails.length}>
                    <VehicleDetails vehicle={vehicleDetail} />
                  </TabPanel>
                </>
              }
            </div>
        }
        {
          imageOpen &&
          <ImageViewer
            isOpen={imageOpen}
            images={images}
            currentIndex={currentIndex}
            onClose={this.closeImageViewer}
            onClickNext={this.nextImage}
            onClickPrev={this.previousImage}
          />
        }
      </Fragment>
    )
  }
}

export default connect()(PaperTransferDelivered)
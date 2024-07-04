import React, { Component, Fragment } from 'react';
import TabPanel from './components/DocumentQcTabPanel';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { getQcBikeDocuments } from '../../core/services/documentQcServices';
import ImageViewer from '../../shared/components/ImageViewer';
import { setNotification } from '../../redux/actions/notificationAction';
import { showLoader, hideLoader } from '../../redux/actions/loaderAction';
import { connect } from 'react-redux';
import NoResultsFound from '../../shared/components/NoResultFound';
import DocumentAndImages from './components/VehicleImages';
import VehicleDetails from './components/VehicleDetails';

const Mandatory = ({ mandatory, name }) =>
  mandatory ? (
    <p style={{ textTransform: 'capitalize' }}>
      {name.toLowerCase()}&nbsp;<span className="red-star">*</span>
    </p>
  ) : (
    <p style={{ textTransform: 'capitalize' }}>{name.toLowerCase()}</p>
  );

class DocumentQcDetailsTab extends Component {
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
  };

  componentDidMount() {
    const { match } = this.props;
    this.documentQcBikeDetailes(match.params.leadId);
  }

  documentQcBikeDetailes = (leadId) => {
    const { dispatch } = this.props;
    dispatch(showLoader());
    getQcBikeDocuments(leadId, 'QCMAIN').then((apiResponse) => {
      if (apiResponse.isValid) {
        this.setState({
          qcBikeDetails: apiResponse.qcBikeDoc,
          approveStatus: apiResponse.qcBikeDoc.map((doc) => ({
            status: null,
            id: doc.docID,
            mandatory: doc.mandatory,
          })),
          vehicleDetail: apiResponse.vehicleDetails,
          imageDocuments: apiResponse.inspsParams,
        });
      } else {
        dispatch(setNotification('danger', 'Error', apiResponse.message));
      }
      dispatch(hideLoader());
    });
  };

  handleTabChange = (event, nextValue) => {
    this.setState({ currentTab: nextValue });
  };

  tabProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

  openImageViewer = (imageList, index, caption) => {
    if (Array.isArray(imageList)) {
      const imgs = imageList.map((img) => ({ src: img, caption: caption }));
      this.setState({
        images: imgs,
      });
    } else {
      this.setState({
        images: [{ src: imageList, caption }],
      });
    }
    this.setState({
      currentIndex: index,
      imageOpen: true,
    });
  };

  closeImageViewer = () => {
    this.setState({
      imageOpen: false,
      images: [],
      currentIndex: 0,
    });
  };

  nextImage = () => {
    const { currentIndex } = this.state;
    this.setState({
      currentIndex: currentIndex + 1,
    });
  };

  previousImage = () => {
    const { currentIndex } = this.state;
    this.setState({
      currentIndex: currentIndex - 1,
    });
  };

  getImagesById = (id) => {
    const { imageurls } = this.state;
    const doc = imageurls.filter((docs) => docs.id === id);
    return doc.length ? doc[0].urls : [];
  };

  render() {
    const {
      currentTab,
      imageOpen,
      images,
      currentIndex,
      qcBikeDetails,
      vehicleDetail,
      imageDocuments,
    } = this.state;
    return (
      <Fragment>
        {!qcBikeDetails.length ? (
          <NoResultsFound />
        ) : (
          <div className="tab-container">
            <Tabs
              orientation="vertical"
              value={currentTab}
              onChange={this.handleTabChange}
              classes={{ indicator: 'indicator-color' }}
              style={{ marginTop: 10 }}
            >
              {Boolean(qcBikeDetails.length) &&
                qcBikeDetails.map((qclist) => (
                  <Tab
                    key={qclist.docID}
                    label={
                      <Mandatory
                        mandatory={qclist.mandatory === 'TRUE'}
                        name={qclist.docDisplayName}
                      />
                    }
                    className="tab-style"
                    {...this.tabProps(qclist.docID)}
                  />
                ))}
              <Tab
                label="Vehicle Details"
                className="tab-style"
                {...this.tabProps(3)}
              />
              <Tab
                label="Vehicle Images"
                className="tab-style"
                {...this.tabProps(4)}
              />
            </Tabs>
            {Boolean(qcBikeDetails.length) &&
              qcBikeDetails.map((doclist, index) => (
                <TabPanel key={doclist.docID} value={currentTab} index={index}>
                  <h1 className="tab-heading">{doclist.docDisplayName}</h1>
                  <div
                    className="doc-container"
                    style={{ alignItems: 'flex-start', minHeight: 300 }}
                  >
                    <div className="docs">
                      {doclist.imageUrl.length &&
                        doclist.imageUrl.map((img, docindex) => {
                          return (
                            <div
                              key={`${img}${docindex}`}
                              className="doc-preview"
                              onClick={() =>
                                this.openImageViewer(
                                  doclist.imageUrl,
                                  docindex,
                                  doclist.docDisplayName
                                )
                              }
                            >
                              <img src={img} alt={doclist.docDisplayName} />
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </TabPanel>
              ))}
            {Boolean(Object.keys(vehicleDetail).length) && (
              <>
                <TabPanel value={currentTab} index={qcBikeDetails.length}>
                  <VehicleDetails vehicle={vehicleDetail} />
                </TabPanel>
                <TabPanel value={currentTab} index={qcBikeDetails.length + 1}>
                  <DocumentAndImages vehicleDocs={imageDocuments} />
                </TabPanel>
              </>
            )}
          </div>
        )}
        {imageOpen && (
          <ImageViewer
            isOpen={imageOpen}
            images={images}
            currentIndex={currentIndex}
            onClose={this.closeImageViewer}
            onClickNext={this.nextImage}
            onClickPrev={this.previousImage}
          />
        )}
      </Fragment>
    );
  }
}

export default connect()(DocumentQcDetailsTab);

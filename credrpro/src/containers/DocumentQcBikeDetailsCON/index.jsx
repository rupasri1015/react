import React, { Fragment, useState, useEffect, useRef  } from 'react';
import classNames from 'classnames';
import { useDispatch, connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import pullAt from 'lodash/pullAt';
import { Button } from 'reactstrap';
import Radio from '@material-ui/core/Radio';
import FileUploadInput from '../../shared/components/form/UploadImgnPdf';
import ImageSlider from '../../shared/components/ImageSlider';

import {
  uploadMultiImages,
  updateDocumentQcBikeStatus,
  getQcBikeDocuments,
  editBankDetails,
  validateAccountDetails,
} from '../../core/services/documentQcServices';
import ImageViewer from '../../shared/components/ImageViewer';
import { setNotification } from '../../redux/actions/notificationAction';
import { showLoader, hideLoader } from '../../redux/actions/loaderAction';
import ImagePreview from '../../shared/components/ImagePreview';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { getUserID } from '../../core/services/rbacServices';
import RejectDialog from '../DocumentQcBikeDetails/components/RejectDialog';
import DisputeDialog from './components/DisputeDialog';
import VehicleDetails from './components/VehicleDetails';
import VehicleImages from './components/VehicleImages';
import { editYearOrRegNo as editYear } from '../../core/services/documentQcServices'

import uploadIcon from '../../shared/img/icons/blue_upload_icon.svg';
import removeicon from '../../shared/img/icons/ic_remove.svg';
import edit from '../../shared/img/icons/edit-icon.svg';
import styles from './styles.module.scss';

const DocumentQcDetailsTab = (props) => {
  const { match } = props;
  const [imageUrls, setImageUrls] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageOpen, setImageOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [approveStatus, setApproveStatus] = useState([]);
  const [qcBikeDetails, setQcBikeDetails] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [vehicleDetail, setVehicleDetail] = useState([]);
  const [imageDocuments, setImageDocuments] = useState([]);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [rtoCharges, setRtoCharges] = useState(0);
  const [chalanaDeduction, setChalanaDeduction] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [rcName, setRcName] = useState(null);
  const [enableRcName,setEnableRcName] = useState(false);
  const inputRcName = useRef(null);
  const [finVal,setFinVal] = useState(null)
  const [inVal,setInVal] = useState(null)
  const [rcType,setRcType] = useState(null)

  let SLIDER_IMAGE_SETTINGS = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    className: 'date-slider',
    rows: 1,
  };

  const yesNoOptions = [
        { label: 'Yes', value: true }, { label: 'No', value: false }
      ]

  const dispatch = useDispatch();

  useEffect(() => {
    documentQcBikeDetailes(match.params.leadId);
  }, []);

  const useStyles = makeStyles((theme) => {
    return {
      label: {
        fontSize: '14px',
      },
    };
  });

  const classes = useStyles();

  const documentQcBikeDetailes = (leadId) => {
    dispatch(showLoader());
    getQcBikeDocuments(leadId, 'QCCONDITIONAL').then((apiResponse) => {
      if (apiResponse.isValid) {
        setQcBikeDetails(apiResponse.qcBikeDoc);
        setApproveStatus(
          apiResponse.qcBikeDoc.map((doc) => ({
            status: doc.docStatus
              ? doc.docStatus === 'APPROVE'
                ? 'Approve'
                : 'Pending'
              : null,
            id: doc.docID,
            mandatory: doc.mandatory,
            approveConditional:
              (doc.docDisplayName && doc.docDisplayName === 'RC') ||
              doc.docDisplayName === 'ADDRESSORID'
                ? true
                : false,
          }))
        );
        setChalanaDeduction(apiResponse.vehicleDetails.bikeChallan);
        setRtoCharges(apiResponse.rtoCharges); 
        setVehicleDetail(apiResponse.vehicleDetails);
        setRcName(apiResponse.vehicleDetails.rcName)
        setFinVal(apiResponse.vehicleDetails.bikeFinance ? yesNoOptions[0].label: yesNoOptions[1].label )
        setInVal(apiResponse.vehicleDetails.insurance ? yesNoOptions[0].label: yesNoOptions[1].label)
        setRcType(apiResponse.vehicleDetails.bikeRcType)
        setImageDocuments(apiResponse.inspsParams);
        setFinVal(apiResponse.vehicleDetails.bikeFinance ? yesNoOptions[0].label: yesNoOptions[1].label )
        setInVal(apiResponse.vehicleDetails.insurance ? yesNoOptions[0].label: yesNoOptions[1].label)
        setRcType(apiResponse.vehicleDetails.bikeRcType)
      } else {
        dispatch(setNotification('danger', 'Error', apiResponse.message));
      }
      dispatch(hideLoader());
    });
  };

  const refreshVehicleData=(leadId)=>{
    dispatch(showLoader());
    getQcBikeDocuments(leadId, 'QCCONDITIONAL').then((apiResponse) => {
      if (apiResponse.isValid) {
        setVehicleDetail(apiResponse.vehicleDetails);
      } else {
        dispatch(setNotification('danger', 'Error', apiResponse.message));
      }
      dispatch(hideLoader());
    });
  }
  const openImageViewer = (imageList, index, caption) => {
    if (Array.isArray(imageList)) {
      const imgs = imageList.map((img) => ({ src: img, caption: caption }));
      setImages(imgs);
    } else {
      setImages([{ src: imageList, caption }]);
    }
    setCurrentIndex(index);
    setImageOpen(true);
  };

  const closeImageViewer = () => {
    setImageOpen(false);
    setImages([]);
    setCurrentIndex(0);
  };

  const nextImage = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const previousImage = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const uploadImagesForDelvivery = (images) => {
    const formData = new FormData();
    images.forEach((file) => {
      formData.append('file', file);
    });
    return uploadMultiImages(formData).then((apiResponse) => {
      if (apiResponse.isValid) {
        return apiResponse.urls;
      } else {
        dispatch(setNotification('danger', 'Error', apiResponse.message));
        return null;
      }
    });
  };

  const rejectDocQcPayload = (rejectPayload) => {
    const payload = {
      finalDocStatus: 'REJECTED',
      leadId: props.match.params.leadId,
      type: 'QCCONDITIONAL',
      updatedBy: getUserID(),
      ...rejectPayload,
    };
    const docs = approveStatus.map((doc) => {
      const imageKey = imageUrls.findIndex((img) => img.id === doc.id);
      const { mandatory, ...rest } = doc;
      if (imageKey === -1) {
        return { ...rest };
      } else {
        return { ...rest, urls: imageUrls[imageKey].urls };
      }
    });

    payload.images = docs.map((doc) => {
      const { status, id, urls } = doc;
      if (urls) return { status, docId: id, imageUrl: urls };
      else return { status, docId: id };
    });
    updateDocumentQcDetails(payload);
  };

  const disputeDocQcPayload = (rejectPayload) => {
    const payload = {
      finalDocStatus: 'DISPUTE',
      leadId: props.match.params.leadId,
      type: 'QCCONDITIONAL',
      updatedBy: getUserID(),
      ...rejectPayload,
      reasonId: 0,
    };
    const docs = approveStatus.map((doc) => {
      const imageKey = imageUrls.findIndex((img) => img.id === doc.id);
      const { mandatory, ...rest } = doc;
      if (imageKey === -1) {
        return { ...rest };
      } else {
        return { ...rest, urls: imageUrls[imageKey].urls };
      }
    });

    payload.images = docs.map((doc) => {
      const { status, id, urls } = doc;
      if (urls) return { status, docId: id, imageUrl: urls };
      else return { status, docId: id };
    });
    updateDocumentQcDetails(payload);
  };

  const updateDocQcPayload = (finalDocStatus) => {
    const payload = {
      finalDocStatus,
      leadId: props.match.params.leadId,
      type: 'QCCONDITIONAL',
      updatedBy: getUserID(),
      rtoCharges,
      reasonId: 0,
      challanCharges: chalanaDeduction,
      rcName:rcName,
      rcType:rcType,
      finance:finVal,
      insurance:inVal
    };
    const docs = approveStatus.map((doc) => {
      const imageKey = imageUrls.findIndex((img) => img.id === doc.id);
      const { mandatory, ...rest } = doc;
      if (imageKey === -1) {
        return { ...rest };
      } else {
        return { ...rest, urls: imageUrls[imageKey].urls };
      }
    });

    payload.images = docs.map((doc) => {
      const { status, id, urls } = doc;
      if (urls) return { status, docId: id, imageUrl: urls };
      else return { status, docId: id };
    });
    updateDocumentQcDetails(payload);
    // validateDocQcAccountDetails({leadId:props.match.params.leadId})
  };

  const validateDocQcAccountDetails = (payload) => {
    dispatch(showLoader());
    validateAccountDetails(payload).then((apiResponse) => {
      if (apiResponse.isValid) {
        dispatch(setNotification('success', 'Success', apiResponse.message));
        props.history.push('/documentQc/QC1');
      } else {
        dispatch(setNotification('danger', 'Error', apiResponse.message));
        dispatch(hideLoader());
      }
    })
  }

  const updateDocumentQcDetails = (payload) => {
    dispatch(showLoader());
    updateDocumentQcBikeStatus(payload).then((apiResponse) => {
      if (apiResponse.isValid) {
        dispatch(setNotification('success', 'Success', apiResponse.message));
        props.history.push('/documentQc/QC1');
      } else {
        dispatch(setNotification('danger', 'Error', apiResponse.message));
        dispatch(hideLoader());
      }
    });
  };

  const handleRadioButtonChange = (status, id, list) => {
    const newState = approveStatus.map((doc) => {
      if (doc.id === id) {
        doc.status = status;
      }
      return doc;
    });
    setApproveStatus(newState);
  };

  const getImagesById = (id) => {
    const doc = imageUrls.filter((docs) => docs.id === id);
    return doc.length ? doc[0].urls : [];
  };

  const isShowButton = () => {
    if (!approveStatus.length) return false;
    const status = approveStatus.filter(
      (doc) => doc.mandatory === 'TRUE' && doc.status === null
    );
    return status.length === 0;
  };

  const isApprove = () => {
    const status = approveStatus.filter(
      (doc) =>
        doc.mandatory === 'TRUE' &&
        (doc.status === 'Pending' || doc.status === null)
    );
    return status.length === 0 && finVal && inVal && rcType && rcType !== "NA" && rcName && enableRcName === false ;
  };

  const removeImage = (id, key) => {
    const newState = imageUrls
      .map((doc) => {
        if (doc.id === id) {
          doc.urls.splice(key, 1);
        }
        return doc;
      })
      .filter((docs) => docs.urls.length);
    setImageUrls(newState);
  };

  const getValueForRadio = (id) => {
    const value = approveStatus.filter((doc) => doc.id === id);
    if (value.length) return value[0].status;
    return null;
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setIsDisputeOpen(false);
  };

  const handleOpen = () => {
    setIsDialogOpen(true);
  };

  const handleOpenDispute = () => {
    setIsDisputeOpen(true);
  };

  const setChallanCharges = (e) => {
    const regexp = /^[0-9\b]+$/;
    if (e.target.value === '' || regexp.test(e.target.value)) {
      setChalanaDeduction(e.target.value);
    }
  };

  const _setRtoCharges = (e) => {
    const regexp = /^[0-9\b]+$/;
    if (e.target.value === '' || regexp.test(e.target.value)) {
      setRtoCharges(e.target.value);
    }
  };

  const handleRcName = (e) => {
    setRcName(e.target.value)
  }
  const onInputRcName = (e) => {
    if (e.keyCode === 13) {
      const payload = {
        leadId: props.match.params.leadId,
        userId: getUserID(),
        rcName: e.target.value,
      };

      editBankDetails(payload).then((apiResponse) => {
        if (apiResponse.isValid) {
          dispatch(setNotification('success', 'Success', apiResponse.message));
        } else {
          dispatch(setNotification('danger', 'Error', apiResponse.message));
        }
        setEnableRcName(false);
      });
    }
    }

  const handleFiles = (files, id) => {
    const selectedFiles = uploadedFiles[id]
      ? [...uploadedFiles[id], ...files]
      : [...files];
    setUploadedFiles({ ...uploadedFiles, [id]: selectedFiles });

    const documentIndex = imageUrls.findIndex((doc) => doc.id === id);
    if (documentIndex === -1) {
      if (files.length) {
        uploadImagesForDelvivery(files).then((urls) => {
          if (urls) {
            const newUrls = imageUrls.concat({
              urls,
              id,
            });
            setImageUrls(newUrls);
          }
        });
      }
    } else {
      if (files.length) {
        uploadImagesForDelvivery(files).then((urls) => {
          if (urls) {
            const newState = imageUrls.map((url) => {
              if (url.id === id) {
                url.urls = url.urls.concat(urls);
              }
              return url;
            });
            setImageUrls(newState);
          }
        });
      }
    }
  };

  const handleRemoveFile = ({ item, index, id }) => {
    const currentFiles = uploadedFiles[id];

    pullAt(currentFiles, index);

    setUploadedFiles({ [id]: [...currentFiles], ...uploadedFiles });
  };

  const handleFinVal = (finVal) => {
    setFinVal(finVal)  
  }
  const handleInsureVal = (insureVal) => {
    setInVal(insureVal)  
  }
  const handleRcVal = (rcType) => {
    setRcType(rcType)  
  }

  const renderFiles = (id) => {
    if (uploadedFiles[id] && uploadedFiles[id].length > 0) {
      return (
        <ImageSlider
          files={uploadedFiles[id]}
          onRemoveClick={handleRemoveFile}
          onImageClick={openImageViewer}
          id={id}
          imageStyles={{ height: '80px', width: '80px', borderRadius: '6px' }}
          className={styles.filesClassName}
          containerClassName={styles.filesContainerClassName}
          removeIconClass={styles.removeIconClass}
          removeicon={removeicon}
          SLIDER_IMAGE_SETTINGS={SLIDER_IMAGE_SETTINGS}
        />
      );
    }
  };

  return (
    <div style={{ maxWidth: '990px' }}>
      <div className={styles.container}>
        <div style={{ marginRight: '30px' }}>
          <div
            style={{
              maxWidth: '520px',
              height: '221px',
              borderRadius: '5px',
              flexDirection: 'column',
              marginBottom: '20px',
              letterSpacing: '0.05ch',
            }}
            className="tab-container"
          >
            <VehicleImages vehicleDocs={imageDocuments} />
          </div>
          <div
            style={{
              maxWidth: '520px',
              height: '290',
              borderRadius: '5px',
              flexDirection: 'column',
              marginBottom: '20px',
            }}
            className="tab-container"
          >    
          <VehicleDetails
              vehicle={vehicleDetail}
              refreshData={refreshVehicleData}
              isEdit={match.path.includes('viewdetails')}
              cityId={props.location.state && props.location.state.cityId && props.location.state.cityId}
              handleFinVal = {handleFinVal}
              handleInsureVal = {handleInsureVal}
              handleRcVal = {handleRcVal}
            />
          </div>
          <div
            style={{
              maxWidth: '520px',
              height: '290',
              borderRadius: '5px',
              flexDirection: 'column',
              paddingBottom: '20px',
              marginBottom: '20px',
            }}
            className="tab-container"
          >
            <div>
              <div
                style={{
                  padding: '8px 15px',
                  background: '#FFDEC7',
                  width: '150px',
                  color: '#98360C',
                  letterSpacing: '0.05ch',
                  borderTopLeftRadius: '5px',
                  marginBottom: '20px',
                  fontWeight: 600,
                }}
              >
                Deductions
              </div>
              <div className="data-row">
                <p className="bold-text title">RTO</p>
                <p className="data">
                  <input
                    style={{
                      height: '30px',
                      width: '175px',
                      border: '1px solid rgba(160, 160, 160, 0.5)',
                    }}
                    disabled={!match.path.includes('bikedetails')}
                    value={rtoCharges}
                    onChange={(e) => _setRtoCharges(e)}
                  />
                </p>
              </div>
              <div className="data-row">
                <p className="bold-text title">Challan</p>
                <p className="data">
                  <input
                    value={chalanaDeduction}
                    onChange={(e) => setChallanCharges(e)}
                    disabled={!match.path.includes('bikedetails')}
                    style={{
                      height: '30px',
                      width: '175px',
                      border: '1px solid rgba(160, 160, 160, 0.5)',
                    }}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          {qcBikeDetails.map((doclist, index) => (
            <div
              className="tab-container"
              style={{
                width: '520px',
                borderRadius: '5px',
                flexDirection: 'column',
                marginBottom: '20px',
                letterSpacing: '0.05ch',
                background: 'white',
                paddingBottom: '10px',
              }}
            >
              <div
                style={{
                  padding: '8px 15px',
                  background: '#FFDEC7',
                  width: '150px',
                  color: '#98360C',
                  letterSpacing: '0.05ch',
                  borderTopLeftRadius: '5px',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '14px' }}>
                  {doclist.docDisplayName}
                </span>
              </div>
              <div style={{ display: 'flex', padding: '15px' }}>
                <span style={{ fontSize: '12px' }}>Document Received</span>
                <RadioGroup
                  style={{ marginLeft: '30px' }}
                  name={doclist.docDisplayName}
                  value={getValueForRadio(doclist.docID) || ''}
                  onChange={(event) =>
                    handleRadioButtonChange(
                      event.target.value,
                      doclist.docID,
                      doclist
                    )
                  }
                  row
                >
                  <FormControlLabel
                    style={{ height: '20px' }}
                    value="Approve"
                    control={<Radio color="primary" />}
                    label="Yes"
                    disabled={match.path.includes('viewdetails')}
                    classes={classes}
                  />
                  <FormControlLabel
                    style={{ height: '20px' }}
                    value="Pending"
                    disabled={match.path.includes('viewdetails')}
                    control={<Radio color="primary" />}
                    label="No"
                  />
                </RadioGroup>
              </div>
              <div
                className="doc-container"
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginTop: 0,
                  padding: '0 15px',
                  fontSize: '16px',
                  color: 'black',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ width: '50%' }}>Uploaded Documents</div>
                  {!match.path.includes('viewdetails') && (
                    <div
                      className="col-12 upload-image"
                      style={{ width: '50%', flex: 0, margin: 0 }}
                    >
                      <FileUploadInput
                        multiple
                        name={'Upload'}
                        accept="image/*, application/pdf"
                        onFileChange={handleFiles}
                        buttonClass={styles.browseBtn}
                        leftIcon={uploadIcon}
                        minWidth={124}
                        id={doclist.docID}
                      />
                    </div>
                  )}
                </div>
                <div className="docs" style={{ padding: '6px 0 10px 0px' }}>
                  {doclist.imageUrl.length && (
                    <ImageSlider
                      files={doclist.imageUrl}
                      onRemoveClick={handleRemoveFile}
                      onImageClick={openImageViewer}
                      imageStyles={{
                        height: '80px',
                        width: '80px',
                        borderRadius: '6px',
                      }}
                      className={styles.filesClassName}
                      containerClassName={styles.filesContainerClassName}
                      removeIconClass={styles.removeIconClass}
                      removeicon={removeicon}
                      SLIDER_IMAGE_SETTINGS={SLIDER_IMAGE_SETTINGS}
                      selectedFromComputer={false}
                    />
                  )}
                </div>
                {renderFiles(doclist.docID)}
                {doclist.docDisplayName === 'RC' ? <div className="data-row">
                <p className="bold-text title">RC&nbsp;Name</p>
                <p className="data">
                    <input
                        style={{
                            height: '30px',
                            width: '250px',
                            border: '1px solid rgba(160, 160, 160, 0.5)',
                        }}
                        ref={inputRcName}
                        disabled={!enableRcName}
                        value={rcName}
                        onChange={(e) =>handleRcName(e)}
                        onKeyDown={(e) => onInputRcName(e)}
                    />
                    <img
                        src={edit}
                        alt="Edit No Of Owners"
                        role="button"
                        className="action-icon"
                        style={{ marginLeft: 10 }}
                        onClick={(e) => setEnableRcName(true)}
                    />
                </p>
            </div> : <></>}
              </div>
              {/* {Boolean(getImagesById(doclist.docID).length) &&
                getImagesById(doclist.docID).map((url, docIndex) => (
                  <ImagePreview
                    className="imageview"
                    key={`${url}${docIndex}`}
                    url={url}
                    onRemove={() => removeImage(doclist.docID, docIndex)}
                  />
                ))} */}
            </div>
          ))}
          {imageOpen && (
            <ImageViewer
              images={images}
              isOpen={imageOpen}
              currentIndex={currentIndex}
              onClickNext={nextImage}
              onClickPrev={previousImage}
              onClose={closeImageViewer}
            />
          )}
        </div>
      </div>
      {Boolean(qcBikeDetails.length) && (
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          {isShowButton() &&
            !match.path.includes('viewdetails') &&
            (isApprove() ? (
              <Fragment>
                <Button
                  color="success"
                  type="button"
                  className={classNames(
                    'rounded no-margin documentQcbutton',
                    styles.btnClass
                  )}
                  onClick={() => updateDocQcPayload('COND_APPROVED')}
                >
                  {' '}
                  Approve
                </Button>
                <Button
                  color="warning"
                  type="button"
                  className={classNames(
                    'rounded no-margin documentQcbutton',
                    styles.disputeBtn
                  )}
                  onClick={handleOpenDispute}
                >
                  {' '}
                  Dispute
                </Button>
              </Fragment>
            ) : (
              <Fragment>
                <Button
                  color="danger"
                  type="button"
                  className={classNames(
                    'rounded no-margin documentQcbutton',
                    styles.btnClass
                  )}
                  onClick={handleOpen}
                >
                  Reject
                </Button>
                <Button
                  color="warning"
                  type="button"
                  className={classNames(
                    'rounded no-margin documentQcbutton',
                    styles.disputeBtn
                  )}
                  onClick={handleOpenDispute}
                >
                  Dispute
                </Button>
              </Fragment>
            ))}
        </div>
      )}
      {isDialogOpen && (
        <RejectDialog
          open={isDialogOpen}
          onClose={handleClose}
          onRejectDocuments={rejectDocQcPayload}
          reasonList={props.location.state.reasonList}
        />
      )}
      {isDisputeOpen && (
        <DisputeDialog
          open={isDisputeOpen}
          onClose={handleClose}
          onRejectDocuments={disputeDocQcPayload}
        />
      )}
    </div>
  );
}

export default connect()(DocumentQcDetailsTab);

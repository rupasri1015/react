import React, { Fragment, useState, useEffect } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import pullAt from 'lodash/pullAt';
import { Button, Input } from 'reactstrap';

import Radio from '@material-ui/core/Radio';
import {
  uploadMultiImages,
  updateDocumentQcBikeStatus,
  getQcBikeDocuments,
} from '../../core/services/documentQcServices';
import ImageViewer from '../../shared/components/ImageViewer';
import { setNotification } from '../../redux/actions/notificationAction';
import { showLoader, hideLoader } from '../../redux/actions/loaderAction';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { connect } from 'react-redux';
import NoResultsFound from '../../shared/components/NoResultFound';
import { getUserID } from '../../core/services/rbacServices';
import RejectDialog from './components/RejectDialog';
import DisputeDialog from './components/DisputeDialog';
import VehicleDetails from './components/VehicleDetails';
import VehicleImages from '../DocumentQCViewOnly/components/VehicleImages';
import FileUploadInput from '../../shared/components/form/UploadImgnPdf';

import ImageSlider from '../../shared/components/ImageSlider';

import uploadIcon from '../../shared/img/icons/upload.svg';
import removeicon from '../../shared/img/icons/ic_remove.svg';
import dropDownIcon from '../../shared/img/icons/drop_down_2.svg';
import greenTicketIcon from '../../shared/img/icons/green_tick.svg';
import pendingIcon from '../../shared/img/icons/red_pending.svg';

import styles from './styles.module.scss';
import Bank, { BankVerificationDropDown } from './components/BankVerification';
import { useHistory } from 'react-router-dom';

let SLIDER_IMAGE_SETTINGS = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 3,
  className: 'date-slider',
  rows: 1,
};

const DocumentQcDetailsTab = (props) => {

  const { match, dispatch } = props;
  const [imageUrls, setImageUrls] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageOpen, setImageOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [approveStatus, setApproveStatus] = useState([]);
  const [qcBikeDetails, setQcBikeDetails] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [challanbikeDis, setChallanBikeDis] = useState('');
  const [vehicleDetail, setVehicleDetail] = useState([]);
  const [imageDocuments, setImageDocuments] = useState([]);
  const [challanTwo, setChallanTwo] = useState('');
  const [rtoCharges, setRtoCharges] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState({});

  const [openDocument, setOpenDocument] = useState({});
  const [openDoc1, setOpenDoc1] = useState(true)
  const [openDoc2, setOpenDoc2] = useState(true)
  const [openDoc3, setOpenDoc3] = useState(true)
  const [bankVerificationStatus,setBankVerificationStatus] = useState('')
  const [compareName,setCompareName] = useState(true)

  const [finVal,setFinVal] = useState(null)
  const [inVal,setInVal] = useState(null)
  const [rcType,setRcType] = useState(null)
  const history = useHistory()

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

  const yesNoOptions = [
    { label: 'Yes', value: true }, { label: 'No', value: false }
  ]
  const classes = useStyles();

  const refreshRazorpay =(leadId) => {
    documentQcBikeDetailes(leadId)
  }

  const documentQcBikeDetailes = (leadId) => {
    dispatch(showLoader());
    getQcBikeDocuments(leadId, 'QCMAIN').then((apiResponse) => {
      if (apiResponse.isValid) {
        setRtoCharges(apiResponse.rtoCharges);
        setQcBikeDetails(apiResponse.qcBikeDoc);
        setApproveStatus(
          apiResponse.qcBikeDoc.map((doc) => ({
            status: doc.docStatus
              ? doc.docStatus === 'APPROVE'
                ? 'Approve'
                : 'Pending'
              : null,
            id: doc.docID,
            docMissingAmountRequired:
              doc.docmissingPriceCollect === 'YES' ? true : false,
            docAmount: doc.docmissing_price_value,
            mandatory: doc.mandatory,
            approveConditional:
              (doc.docDisplayName && doc.docDisplayName === 'RC') ||
                doc.docDisplayName === 'ADDRESSORID'
                ? true
                : false,
          }))
        );
        setChallanBikeDis(apiResponse.challanCharges);
        setChallanTwo(apiResponse.vehicleDetails.bikeChallanQc2);
        setVehicleDetail(apiResponse.vehicleDetails);
        setFinVal(apiResponse.vehicleDetails.bikeFinance ? yesNoOptions[0].label: yesNoOptions[1].label )
        setInVal(apiResponse.vehicleDetails.insurance ? yesNoOptions[0].label: yesNoOptions[1].label)
        setRcType(apiResponse.vehicleDetails.bikeRcType)
        setImageDocuments(apiResponse.inspsParams);
      } else {
        dispatch(setNotification('danger', 'Error', apiResponse.message));
      }
      dispatch(hideLoader());
    });
  };

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

  const onChangeOfInput = (e, id) => {
    const regexp = /^[0-9\b]+$/;

    const doc = approveStatus.find((doc) => doc.id === id);
    if (doc) {
      const newApprovedStatus = approveStatus.filter((doc) => doc.id !== id);
      if (e.target.value === '' || regexp.test(e.target.value)) {
        doc.docAmount = e.target.value;
        setApproveStatus([...newApprovedStatus, doc]);
      }
    }
  };

  const onChangeOfChallanInput = (e) => {
    const regexp = /^[0-9\b]+$/;
    if (e.target.value === '' || regexp.test(e.target.value)) {
      setChallanTwo(e.target.value);
    }
  };

  const _setRtoCharges = (e) => {
    const regexp = /^[0-9\b]+$/;
    if (e.target.value === '' || regexp.test(e.target.value)) {
      setRtoCharges(e.target.value);
    }
  };

  const fileChangedHandler = (files, id) => {
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

  const rejectDocQcPayload = (rejectPayload) => {
    const payload = {
      finalDocStatus: 'REJECTED',
      leadId: match.params.leadId,
      type: 'QCMAIN',
      updatedBy: getUserID(),
      ...rejectPayload,
      rtoCharges,
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
      leadId: match.params.leadId,
      type: 'QCMAIN',
      updatedBy: getUserID(),
      ...rejectPayload,
      bikeChallanQc2: challanTwo,
      bikeChallan: challanTwo,
      challanCharges: challanTwo
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
      const { status, id, urls, docMissingAmountRequired, docAmount } = doc;
      if (id === '6') {
        return {
          status,
          docId: id,
          imageUrl: urls,
        };
      } else if (urls || docMissingAmountRequired) {
        if (urls && docMissingAmountRequired) {
          return {
            status,
            docId: id,
            docMissingPrice: docAmount,
            imageUrl: urls,
          };
        } else if (urls) {
          return {
            status,
            docId: id,
            imageUrl: urls,
          };
        } else if (docMissingAmountRequired) {
          return {
            status,
            docId: id,
            docMissingPrice: docAmount,
          };
        }
      } else return { status, docId: id };
    });

    if (payload.bikeChallanQc2 === '') {
      dispatch(
        setNotification('danger', 'Error', 'Please Enter Challan Price')
      );
    } else if (payload.images.some((g) => g.docMissingPrice === '')) {
      dispatch(
        setNotification(
          'danger',
          'Error',
          'Please Enter ALL Document Deduction Price'
        )
      );
    } else {
      setIsDisputeOpen(true);
    }
  };

  const updateDocQcPayload = (finalDocStatus) => {
    const payload = {
      finalDocStatus,
      leadId: match.params.leadId,
      type: 'QCMAIN',
      updatedBy: getUserID(),
      bikeChallanQc2: challanTwo,
      bikeChallan: challanTwo,
      challanCharges: challanTwo,
      reasonId: 0,
      rtoCharges,
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
      const { status, id, urls, docMissingAmountRequired, docAmount } = doc;
      if (id === '6') {
        return {
          status,
          docId: id,
          imageUrl: urls,
        };
      } else if (urls || docMissingAmountRequired) {
        if (urls && docMissingAmountRequired) {
          return {
            status,
            docId: id,
            docMissingPrice: docAmount,
            imageUrl: urls,
          };
        } else if (urls) {
          return {
            status,
            docId: id,
            imageUrl: urls,
          };
        } else if (docMissingAmountRequired) {
          return {
            status,
            docId: id,
            docMissingPrice: docAmount,
          };
        }
      } else return { status, docId: id };
    });

    if (payload.bikeChallanQc2 === '') {
      dispatch(
        setNotification('danger', 'Error', 'Please Enter Challan Price')
      );
    } else if (payload.images.some((g) => g.docMissingPrice === '')) {
      dispatch(
        setNotification(
          'danger',
          'Error',
          'Please Enter ALL Document Deduction Price'
        )
      );
    } else {
      updateDocumentQcDetails(payload);
    }
  };

  const disputeDocQcPayloadDialog = (rejectPayload) => {
    const payload = {
      finalDocStatus: 'DISPUTE',
      leadId: match.params.leadId,
      type: 'QCMAIN',
      updatedBy: getUserID(),
      ...rejectPayload,
      bikeChallanQc2: challanTwo,
      bikeChallan: challanTwo,
      challanCharges: challanTwo,
      reasonId: 0,
      rtoCharges,
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
      const { status, id, urls, docMissingAmountRequired, docAmount } = doc;
      if (id === '6') {
        return {
          status,
          docId: id,
          imageUrl: urls,
        };
      } else if (urls || docMissingAmountRequired) {
        if (urls && docMissingAmountRequired) {
          return {
            status,
            docId: id,
            docMissingPrice: docAmount,
            imageUrl: urls,
          };
        } else if (urls) {
          return {
            status,
            docId: id,
            imageUrl: urls,
          };
        } else if (docMissingAmountRequired) {
          return {
            status,
            docId: id,
            docMissingPrice: docAmount,
          };
        }
      } else return { status, docId: id };
    });
    updateDocumentQcDetails(payload);
  };

  const updateDocumentQcDetails = (payload) => {
    dispatch(showLoader());
    updateDocumentQcBikeStatus(payload).then((apiResponse) => {
      if (apiResponse.isValid) {
        dispatch(setNotification('success', 'Success', apiResponse.message));
        props.history.push('/documentQc/QC2');
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

  const isShowButton = () => {
    if (!approveStatus.length) return false;
    const status = approveStatus.filter(
      (doc) => doc.mandatory === 'TRUE' && doc.status === null
    );
    return status.length === 0;
  };

  const handleBankStatus = (bankStatus) => {
    setBankVerificationStatus(bankStatus)
  }

  const handleCompareName = (isSameName) => {
    setCompareName(isSameName)
  }

  const isApprove = () => {
    const status = approveStatus.filter(
      (doc) =>
        doc.mandatory === 'TRUE' &&
        (doc.status === 'Pending' || doc.status === null)
    );
    return status.length === 0 && bankVerificationStatus === "APPROVED";
  };

  const getValueForRadio = (id) => {
    const value = approveStatus.filter((doc) => doc.id === id);
    if (value.length) return value[0].status;
    return null;
  };

  const refreshVehicleData = (leadId) => {
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
  const handleClose = () => {
    setIsDialogOpen(false);
    setIsDisputeOpen(false);
  };

  const handleOpen = () => {
    setIsDialogOpen(true);
  };

  const getDocAmount = (id) => {
    const doc = approveStatus.find((doc) => doc.id === id);
    if (doc) return doc.docAmount;
    return 0;
  };

  const onChallanChange = (e) => {
    const regexp = /^[0-9\b]+$/;
    if (e.target.value === '' || regexp.test(e.target.value)) {
      setChallanTwo(e.target.value);
    }
  };

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

  const renderBasicVehicleInfo = () => {
    return (
      <div className={styles.documents}>
        <div
          style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 600 }}
        >
          Basic Vehicle Info
        </div>
        <div
          style={{
            maxWidth: '520px',
            // height: '177',
            borderRadius: '5px',
            flexDirection: 'column',
            marginBottom: '20px',
            display:'block',
            border: `${openDoc3 ? 'none' : '1px solid lightgray'}`,
            boxShadow: 'none',
          }}
          className="tab-container"
        >
          <VehicleImages
            openDocument={openDoc3}
            setOpenDocument={setOpenDoc3}
            vehicleDocs={imageDocuments} />
        </div>
        <div
          style={{
            maxWidth: '520px',
            // height: '290',
            borderRadius: '5px',
            flexDirection: 'column',
            marginBottom: '20px',
            display: 'block',
            border: `${openDoc2 ? 'none' : '1px solid lightgray'}`,
            boxShadow: 'none',
          }}
          className="tab-container"
        >
          <VehicleDetails
            openDocument={openDoc2}
            setOpenDocument={setOpenDoc2}
            vehicle={vehicleDetail}
            refreshData={refreshVehicleData}
            isEdit={match.path.includes('bikedetails')}
            cityId={props.location.state && props.location.state.cityId && props.location.state.cityId}
            handleFinVal = {handleFinVal}
            handleInsureVal = {handleInsureVal}
            handleRcVal = {handleRcVal}
          />
        </div>
        <div
          style={{
            maxWidth: '520px',
            // height: '290',
            borderRadius: '5px',
            flexDirection: 'column',
            marginBottom: '20px',
            display: 'block',
            border: `${openDoc1 ? 'none' : '1px solid lightgray'}`,
            boxShadow: 'none',
          }}
          className="tab-container"
        >
          <BankVerificationDropDown 
          openDocument={openDoc1} 
          setOpenDocument={setOpenDoc1} 
          vehicle ={vehicleDetail}
          refreshData= {refreshVehicleData}
          isEdit={match.path.includes('bikedetails')}
          handleStatus = {handleBankStatus}
          handleCompareName = {handleCompareName}
          refreshRazorpay = {refreshRazorpay}
          fundAccountType ={history.location.state.fundAccType}
          accountStatus = {history.location.state.accountStatus}
          />
        </div>
      </div>
    );

  };

  // const renderBasicVehicle =() =>{
  //   return (
  //     <div className={styles.documents}>
  //       <div
  //         style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 600}}
  //       >
  //         Basic Vehicle Info
  //       </div>
  //       {qcBikeDetails.map((item) => {
  //         return (
  //           <renderBasicVehicleInfo/>
  //         )
  //       })}
  //     </div>
  //   )
  // }

  const renderFiles = (id) => {
    if (!uploadedFiles[id] || !uploadedFiles[id].length > 0) return null;

    return (
      <ImageSlider
        files={uploadedFiles[id]}
        onRemoveClick={handleRemoveFile}
        onImageClick={openImageViewer}
        id={id}
        imageStyles={{ height: '80px', width: '80px', borderRadius: '6px' }}
        className={styles.filesClassName}
        containerClassName={styles.filesContainerClassName}
        containerStyles={{
          width: '100%',
        }}
        removeIconClass={styles.removeIconClass}
        removeicon={removeicon}
        SLIDER_IMAGE_SETTINGS={SLIDER_IMAGE_SETTINGS}
      />
    );
  };

  const approvalStatus = (item) => {
    return (
      <div style={{ display: 'flex', marginBottom: '7px' }}>
        <span style={{ fontSize: '14px' }}>Approval status</span>
        <RadioGroup
          style={{ marginLeft: '90px' }}
          name={item.docDisplayName}
          value={getValueForRadio(item.docID) || ''}
          onChange={(event) =>
            handleRadioButtonChange(event.target.value, item.docID, item)
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
    );
  };

  const renderDocumentMissingPrice = (item) => {
    if (
      item.docmissingPriceCollect === 'NO' ||
      item.docDisplayName === 'CHALLAN'
    )
      return null;

    return (
      <div
        className="flex"
        style={{ marginBottom: '20px', alignItems: 'center' }}
      >
        <span style={{ fontSize: '14px' }}>Document missing price</span>
        <Input
          value={getDocAmount(item.docID)}
          onChange={(e) => onChangeOfInput(e, item.docID)}
          placeholder={
            item.docmissing_price_value === 0
              ? 'Enter Price'
              : item.docmissing_price_value
          }
          style={{
            width: '175px',
            height: '30px',
            marginLeft: '35px',
          }}
          disabled={!match.path.includes('bikedetails')}
        />
      </div>
    );
  };

  const documentsReceived = (item) => {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ width: '50%', fontWeight: 600 }}>Documents Received</div>
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
              imageStyles={{
                float: 'right',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
              }}
              showOnlyImage={true}
              minWidth={0}
              id={item.docID}
            />
          </div>
        )}
      </div>
    );
  };

  const uploadedAndSelectedImages = (item) => {
    return (
      <div
        className="docs"
        style={{ paddingTop: '6px', display: 'flex', flexDirection: 'column' }}
      >
        <div
          className="flex"
          id={item.docID}
          style={{ padding: '6px 0 10px 0px' }}
        >
          {item.imageUrl.length && (
            <ImageSlider
              files={item.imageUrl}
              onRemoveClick={handleRemoveFile}
              onImageClick={openImageViewer}
              id={item.id}
              imageStyles={{
                height: '80px',
                width: '80px',
                borderRadius: '6px',
              }}
              className={styles.filesClassName}
              containerClassName={styles.filesContainerClassName}
              containerStyles={{
                width: '100%',
              }}
              removeIconClass={styles.removeIconClass}
              removeicon={removeicon}
              SLIDER_IMAGE_SETTINGS={SLIDER_IMAGE_SETTINGS}
              selectedFromComputer={false}
            />
          )}
        </div>
        {renderFiles(item.docID)}
      </div>
    );
  };

  const deduction = (item, label, value, onChange) => {
    if (item.docDisplayName !== 'CHALLAN') return null;

    return (
      <div
        className="flex"
        style={{ marginBottom: '20px', alignItems: 'center' }}
      >
        <span style={{ fontSize: '14px', width: '150px' }}>{label}</span>
        <Input
          value={value}
          onChange={(e) => onChange(e)}
          disabled={!match.path.includes('bikedetails')}
          style={{
            width: '175px',
            height: '30px',
            marginLeft: '54px',
          }}
        />
      </div>
    );
  };

  const renderItemDetails = (item) => {
    return (
      <div style={{ padding: '15px' }}>
        {approvalStatus(item)}
        {renderDocumentMissingPrice(item)}
        {deduction(item, 'Challan Deduction', challanTwo, onChallanChange)}
        {deduction(item, 'Rto Charges', rtoCharges, _setRtoCharges)}
        {documentsReceived(item)}
        {uploadedAndSelectedImages(item)}
      </div>
    );
  };

  const renderDocumentsDetails = (item) => {
    let docName =
      item.docDisplayName === 'DELIVERY_CHALLAN'
        ? 'Delivery Challan'
        : item.docDisplayName;
    docName =
      item.docDisplayName === 'TRANSFERED_RC' ? 'Transfered RC' : docName;

    docName = item.docDisplayName === 'RTO_RECEIPT' ? 'Rto Receipt' : docName;
    const selectedDoc = approveStatus.filter((i) => i.id === item.docID)[0];

    const statusIcon =
      selectedDoc.status === 'Pending' ? pendingIcon : greenTicketIcon;
    if (!openDocument[item.docDisplayName])
      return (
        <div
          className={styles.dropDownContainer}
          onClick={() => setOpenDocument({ [item.docDisplayName]: true })}
        >
          <span style={{ fontSize: 15 }}>
            <span style={{ fontSize: 15, textTransform: 'capitalize' }}>
              {docName.toLowerCase()}
            </span>
            {item.mandatory === 'TRUE' && (
              <span style={{ marginLeft: 6, fontSize: 18, color: 'red' }}>
                *
              </span>
            )}
          </span>
          <div className="flex">
            <img
              src={statusIcon}
              alt="open"
              className={styles.documentStatusIcon}
            />
            <img
              src={dropDownIcon}
              alt="open"
              className={styles.dropdownIcon}
            />
          </div>
        </div>
      );

    return (

      <div
        style={{
          border: '1px solid lightgray',
          borderRadius: '6px',
          marginBottom: '20px',
        }}
        id={item.docDisplayName}
      >
        <div
          className={styles.expandedDropDown}
          onClick={() => setOpenDocument({ [item.docDisplayName]: false })}
        >
          <span style={{ fontSize: 15 }}>
            <span style={{ fontSize: 15, textTransform: 'capitalize' }}>
              {docName.toLowerCase()}
            </span>
            {item.mandatory === 'TRUE' && (
              <span style={{ marginLeft: 6, fontSize: 18, color: 'red' }}>
                *
              </span>
            )}
          </span>
          <div className="flex">
            <img
              src={statusIcon}
              alt="open"
              className={styles.documentStatusIcon}
            />
            <img
              src={dropDownIcon}
              alt="open"
              className={styles.dropdownIcon}
            />
          </div>
        </div>
        {renderItemDetails(item)}
      </div>
    );
  };

  const renderDocuments = () => {
    return (
      <div className={styles.documents}>
        <div
          style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 600 }}
        >
          Documents
        </div>
        {qcBikeDetails.map((item) => {
          return renderDocumentsDetails(item);
        })}
      </div>
    );
  };

  const renderDetails = () => {
    if (!qcBikeDetails.length) return <NoResultsFound />;

    return (
      <div className={styles.container}>
        {renderBasicVehicleInfo()}
        {renderDocuments()}
      </div>
    );
  };

  if (!approveStatus.length) return null;

  return (
    <Fragment>
      <div style={{ fontSize: 20, color: 'black', fontWeight: 500 }}>
        Documents
      </div>
      {renderDetails()}
      {Boolean(qcBikeDetails.length) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '20px 0',
          }}
        >
          {isShowButton() &&
          !match.path.includes('viewdetails') &&
            (isApprove() ? (
              <Fragment>
                <Button
                  color="success"
                  type="button"
                  className="rounded no-margin"
                  disabled={!compareName}
                  onClick={() => updateDocQcPayload('APPROVED')}
                >
                  {' '}
                  Approve
                </Button>
                <Button
                  color="warning"
                  type="button"
                  className={classNames('rounded no-margin', styles.disputeBtn)}
                  onClick={() => disputeDocQcPayload('DISPUTE')}
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
                  disabled={!compareName}
                  className={classNames('rounded no-margin', styles.btnClass)}
                  onClick={handleOpen}
                >
                  Reject
                </Button>
                <Button
                  color="warning"
                  type="button"
                  className={classNames(
                    'rounded no-margin ',
                    styles.disputeBtn
                  )}
                  onClick={() => disputeDocQcPayload('DISPUTE')}
                >
                  {' '}
                  Dispute
                </Button>
              </Fragment>
            ))}
        </div>
      )}
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
      {isDialogOpen && (
        <RejectDialog
          open={isDialogOpen}
          onClose={handleClose}
          reasonList={props.location.state.reasonList}
          onRejectDocuments={rejectDocQcPayload}
        />
      )}
      {isDisputeOpen && (
        <DisputeDialog
          open={isDisputeOpen}
          onClose={handleClose}
          onRejectDocuments={disputeDocQcPayloadDialog}
        />
      )}
    </Fragment>
  );
};

export default connect()(DocumentQcDetailsTab);

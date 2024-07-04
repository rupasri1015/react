import React, { useState } from 'react';
import Viewer from 'react-viewer';

import styles from '../../DocumentQcBikeDetails/styles.module.scss'
import uploadIcon from '../../../shared/img/icons/upload.svg';
import removeicon from '../../../shared/img/icons/ic_remove.svg';
import dropDownIcon from '../../../shared/img/icons/drop_down_2.svg';
import greenTicketIcon from '../../../shared/img/icons/green_tick.svg';
import pendingIcon from '../../../shared/img/icons/red_pending.svg';
import DocumentQcBikeDetails from '../../DocumentQcBikeDetails';

const getParams = (params, value, key) => {
  if (params) {
    const dataParams = params.filter((param) => param.title === value);
    if (dataParams.length) {
      return dataParams[0][key];
    }
    return [];
  }
  return [];
};

const VehicleImages = ({openDocument,setOpenDocument, userDocs, vehicleDocs, kycDocs, deliveryNotes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [isImageOpen, setImageOpen] = useState(false);

  const openImageViewer = (imagesData, index, key, caption) => {
    if (Array.isArray(imagesData)) {
      const imgs = imagesData.map((image) => ({
        src: image[key],
        caption: image[caption],
      }));
      setImages(imgs);
    } else {
      setImages([{ src: imagesData, caption: caption }]);
    }
    setCurrentIndex(index);
    setImageOpen(true);
  };

  const closeImageViewer = () => {
    setImageOpen(false);
    setCurrentIndex(0);
  };

  const nextImage = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const previousImage = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const imageClick = () => {
    if (currentIndex === images.length - 1) return;
    nextImage();
  };

  const statusIcon = false ? pendingIcon : greenTicketIcon
    if (openDocument)
    return (
      <div
        className={styles.dropDownContainer}
        onClick={() => setOpenDocument(!openDocument)}
      >
        <span style={{ fontSize: 15 }}>
          <span style={{ fontSize: 15, textTransform: 'capitalize' }}>
            Vehicle Images
          </span>
          {true && (
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
    <div>
      <div 
        className={styles.expandedDropDown}
        onClick={() => setOpenDocument(!openDocument)}
      >
        <span style={{ fontSize: 15 }}>
          <span
                style={{
                    padding: '8px 15px',
                    background: '#FFDEC7',
                    width: '220px',
                    color: '#98360C',
                    letterSpacing: '0.05ch',
                    borderTopLeftRadius: '5px',
                }}
            >
                <span style={{ fontWeight: 600, fontSize: '14px' }}>Vehicle Images</span>
            </span>
          {true && (
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
      {/* <div
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
          Vehicle Images
        </span>
      </div> */}
      <div className="doc-container">
        <div className="docs">
          {getParams(vehicleDocs, 'ADD PHOTOS', 'inspectionDetails').length
            ? getParams(vehicleDocs, 'ADD PHOTOS', 'inspectionDetails').map(
                (vehicle, index) => (
                  <div
                    className="doc-preview"
                    style={{ height: '84px', width: '72px' }}
                    key={vehicle.leadParameterValue}
                    onClick={() =>
                      openImageViewer(
                        getParams(
                          vehicleDocs,
                          'ADD PHOTOS',
                          'inspectionDetails'
                        ),
                        index,
                        'leadParameterValue',
                        'leadParameterName'
                      )
                    }
                  >
                    <img
                      src={vehicle.leadParameterValue}
                      alt={vehicle.leadParameterName}
                    />
                  </div>
                )
              )
            : 'NA'}
        </div>
      </div>

      <Viewer
        visible={isImageOpen}
        images={images}
        activeIndex={currentIndex}
        onClose={closeImageViewer}
      />
    </div>
  );
};

export default VehicleImages;

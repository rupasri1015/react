import React, { useState } from 'react';
import Viewer from 'react-viewer';

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

const VehicleImages = ({ vehicleDocs }) => {
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
      setImages([{ src: imagesData, caption }]);
    }
    setCurrentIndex(index);
    setImageOpen(true);
  };

  const closeImageViewer = () => {
    setImageOpen(false);
    setCurrentIndex(0);
  };

  return (
    <div>
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
          Vehicle Images
        </span>
      </div>
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

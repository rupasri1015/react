import React from 'react';
import classNames from 'classnames';
import Slider from 'react-slick';

import removeIcon from '../../img/icons/ic_remove_white.svg';
import nextArrow from '../../img/icons/right-chevron.png';
import prevArrow from '../../img/icons/left-chevron.png';

import './slider-calander.scss';
import styles from './styles.module.scss';

const NextArrow = ({ onClick, className }) => (
  <div className={`${className} next-arrow-slider`} onClick={onClick}>
    <img style={{ height: '20px', width: '20px' }} src={nextArrow} alt="Next" />
  </div>
);

const PrevArrow = ({ onClick, className }) => (
  <div className={`${className} prev-arrow-slider`} onClick={onClick}>
    <img
      style={{ height: '20px', width: '20px' }}
      src={prevArrow}
      alt="Previous"
    />
  </div>
);

const ImageSlider = (props) => {
  const {
    files,
    id,
    imageStyles,
    className,
    containerClassName,
    onRemoveClick,
    onImageClick,
    removeicon,
    removeIconClass,
    SLIDER_IMAGE_SETTINGS,
    containerStyles,
    selectedFromComputer = true,
  } = props;

  const _onImageClick = (param1, param2, param3, isUrl) => {
    const imageList = isUrl ? files : files.map((f) => URL.createObjectURL(f));
    return onImageClick(imageList, param2, param3);
  };

  const getFileThumbnails = (item, index) => {
    if (item.type.includes('image'))
      return (
        <div key={index} className={classNames('col-sm-2', className)}>
          <div className={styles.imageOuter}>
            <img
              style={{
                height: '60px',
                position: 'relative',
                cursor: 'pointer',
                ...imageStyles,
              }}
              src={URL.createObjectURL(item)}
              alt={item.name}
              onClick={() => _onImageClick(item, index, '', false)}
            />
            <img
              style={{ height: '25px', width: '25px' }}
              className={classNames(styles.removeIcon, removeIconClass)}
              src={removeicon ? removeicon : removeIcon}
              alt={'remove'}
              onClick={() => onRemoveClick({ item, index, id })}
            />
          </div>
        </div>
      );
  };

  const getUrlThumbNails = (item, index) => {
    return (
      <div key={index} className={classNames('col-sm-2', className)}>
        <div className={styles.imageOuter}>
          <div
            key={item.id}
            style={{
              height: '80px',
              width: '80px',
              cursor: 'pointer',
              marginRight: '10px',
            }}
            onClick={() => _onImageClick(item, index, '', true)}
          >
            <img
              src={item}
              alt={item.docDisplayName}
              style={{ height: '100%', borderRadius: '6px' }}
            />
          </div>
        </div>
      </div>
    );
  };

  const getImages = () => {
    return files.map((item, index) => {
      return getFileThumbnails(item, index);
    });
  };

  const getUrlImages = () => {
    return files.map((item, index) => {
      return getUrlThumbNails(item, index);
    });
  };

  return (
    <div style={containerStyles} className={classNames(containerClassName)}>
      <Slider
        {...SLIDER_IMAGE_SETTINGS}
        nextArrow={<NextArrow />}
        prevArrow={<PrevArrow />}
      >
        {selectedFromComputer ? getImages() : getUrlImages()}
      </Slider>
    </div>
  );
};

export default ImageSlider;

import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';

import Backup from '@material-ui/icons/Backup';

const Upload = (props) => {
  const {
    onFileChange,
    multiple,
    accept,
    name,
    nameWithoutIcon,
    disabled,
    buttonClass,
    leftIcon,
    minWidth = 115,
    id,
    showText = true,
    showOnlyImage = false,
    imageStyles,
  } = props;

  const uploadRef = createRef();

  const onFileSelection = (event) => {
    if (onFileChange) {
      if (
        accept === 'image/*, application/pdf' ||
        accept === 'application/pdf, image/*'
      ) {
        onFileChange(Object.values(event.target.files), id);
      }
    }
  };

  const renderButtonName = () => {
    if (nameWithoutIcon) {
      return <>{nameWithoutIcon || 'Upload'}</>;
    }

    if (leftIcon)
      return (
        <>
          <img
            src={leftIcon}
            alt="!"
            style={{ height: '20px', width: '20px' }}
          />
          {showText ? name || 'Upload' : ''}
        </>
      );
    return (
      <>
        {name || 'Upload'}
        <Backup style={{ fontSize: 17 }} />
      </>
    );
  };

  return (
    <div style={{ display: 'inline-block', minWidth }}>
      {!showOnlyImage && (
        <button
          className={classname('icon-btn small danger', buttonClass)}
          disabled={disabled}
          type="button"
          onClick={() => uploadRef.current.click()}
        >
          {renderButtonName()}
        </button>
      )}
      {showOnlyImage && (
        <img
          src={leftIcon}
          alt="!"
          style={{ height: '20px', width: '20px', ...imageStyles }}
          onClick={() => uploadRef.current.click()}
        />
      )}
      <input
        onChange={onFileSelection}
        onClick={(event) => (event.target.value = null)}
        type="file"
        style={{ display: 'none' }}
        ref={uploadRef}
        accept={accept}
        multiple={multiple}
      />
    </div>
  );
};

Upload.propTypes = {
  onFileChange: PropTypes.func,

  multiple: PropTypes.bool,
  disabled: PropTypes.bool,

  accept: PropTypes.string,
  name: PropTypes.string,
  nameWithoutIcon: PropTypes.string,
  buttonClass: PropTypes.string,
};

export default Upload;

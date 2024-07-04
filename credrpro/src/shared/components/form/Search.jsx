import React, { forwardRef } from 'react';
import {
  SearchIcon,
  SearchIconWhite,
  CloseIconBlack,
} from '../../../core/utility/iconHelper';
import classname from 'classnames';

const SearchField = forwardRef(
  (
    {
      onSearch,
      value,
      onEnter,
      className,
      searchFieldClass,
      style,
      onClick,
      withButton,
      onClearInput,
      icon,
      ...rest
    },
    ref
  ) => {
    const handleEnter = (event) => {
      if (event.key === 'Enter' && onEnter) onEnter(event.target.value);
    };

    return (
      <div
        className={classname('search-field-container', className)}
        style={style}
      >
        <input
          type="text"
          className={classname('search-field', searchFieldClass)}
          value={value}
          ref={ref}
          onChange={(e) => onSearch(e.target.value)}
          onKeyPress={handleEnter}
          {...rest}
        />

        {withButton && value && (
          <div title="Clear" className="clearable" onClick={onClearInput}>
            <img src={CloseIconBlack} style={{ height: 11 }} alt="Clear" />
          </div>
        )}
        {withButton ? (
          <button className="search-button" onClick={onClick}>
            <img style={{ width: 16 }} src={SearchIconWhite} alt="Search" />
          </button>
        ) : (
          <img
            src={icon ? icon : SearchIcon}
            className="search-icon"
            alt="search-icon"
          />
        )}
      </div>
    );
  }
);

export default SearchField;

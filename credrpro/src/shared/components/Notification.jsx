import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class BasicNotification extends PureComponent {
  static propTypes = {
    color: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
  };

  static defaultProps = {
    color: '',
    title: '',
  };

  render() {
    const { color, title, message } = this.props;

    return (
      <div className={`notification notification--${color}`}>
        <h5 className="notification__title bold-text">{title}</h5>
        <p className="notification__message">{message}</p>
      </div>
    );
  }
}
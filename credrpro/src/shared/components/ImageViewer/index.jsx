import React, { Component } from 'react';
import BackDrop from '@material-ui/core/Backdrop';
import ImageZoom from './components/ImageZoom';
import ClearIcon from '@material-ui/icons/Clear';

const closeIconStyles = {
  color: 'white',
  float: 'right',
  margin: 10,
  cursor: 'pointer',
  position: 'absolute',
  top: 0,
  right: 0,
};

export default class ImageViewer extends Component {
  constructor(props) {
    super(props);
    this.handleKeyboardInput = this.handleKeyboardInput.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrev = this.gotoPrev.bind(this);
    this.handleImageError = this.handleImageError.bind(this);
    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.state = {
      imageLoaded: false,
      isError: false,
      src: props.images[props.currentIndex].src,
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyboardInput);
  }

  componentDidUpdate(prevProps) {
    const { currentIndex, images } = this.props;
    if (prevProps.currentIndex !== currentIndex) {
      if (
        prevProps.images[prevProps.currentIndex].src ===
        images[currentIndex].src
      ) {
        this.setState({ src: '' }, () => {
          this.setState({ src: images[currentIndex].src });
        });
      } else {
        this.setState({ src: images[currentIndex].src });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyboardInput);
  }

  handleKeyboardInput(event) {
    const keyCode = event.keyCode;
    if (keyCode === 37 || keyCode === 33 || keyCode === 38) {
      this.gotoPrev(event);
      return true;
    } else if (keyCode === 39 || keyCode === 34 || keyCode === 40) {
      this.gotoNext(event);
      return true;
    } else if (keyCode === 27 || keyCode === 32) {
      this.props.onClose();
      return true;
    }
    return false;
  }

  gotoPrev(event) {
    if (this.props.currentIndex === 0) return;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ imageLoaded: false }, () => {
      this.props.onClickPrev();
    });
  }

  gotoNext(event) {
    if (this.props.currentIndex === this.props.images.length - 1) return;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ imageLoaded: false }, () => {
      this.props.onClickNext();
    });
  }

  handleImageLoad(event) {
    this.setState({ imageLoaded: true });
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  handleImageError(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ imageLoaded: true, isError: true });
  }

  render() {
    const { currentIndex, images, isOpen, onClose } = this.props;
    const { isError, imageLoaded, src } = this.state;
    return (
      <BackDrop open={isOpen} classes={{ root: 'image-viewer' }}>
        <ClearIcon
          onClick={onClose}
          style={closeIconStyles}
          titleAccess="Close"
        />
        <div className="image-viewer-conatiner">
          {Boolean(images.length) && (
            <ImageZoom
              src={src}
              title={images[currentIndex].caption}
              imageLength={images.length}
              currentIndex={currentIndex}
              onClickNext={this.gotoNext}
              onClickPrev={this.gotoPrev}
              onImageLoaded={this.handleImageLoad}
              onImageError={this.handleImageError}
              isLoaded={imageLoaded}
              isError={isError}
            />
          )}
        </div>
      </BackDrop>
    );
  }
}

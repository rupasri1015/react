import React, { Component, Fragment } from 'react'
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import ZoomOutIcon from '@material-ui/icons/ZoomOut'
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap'
import BrokenImageIcon from '@material-ui/icons/BrokenImage'
import CircularProgress from '@material-ui/core/CircularProgress'
import { RotateRight } from '@material-ui/icons'

export default class ImageZoom extends Component {
  state={
    imageRotation : 0
  }
 
  rotateImage = ()=> {
    const rotation = this.state.imageRotation
  this.setState({imageRotation : rotation+90 })
  }
  render() {
    const {
      src,
      title,
      imageLength,
      currentIndex,
      onClickNext,
      onClickPrev,
      onImageLoaded,
      onImageError,
      isError,
      isLoaded
    } = this.props
    return (
      <Fragment>
        <div style={{ display: Boolean(isError || !isLoaded) ? 'none' : 'block' }}>
          <TransformWrapper>
            {({ zoomIn, zoomOut, resetTransform }) => (
              <Fragment>
                <div className="viewer-controls">
                  <div className="control prev" >
                    {
                      currentIndex !== 0 &&
                      <ArrowBackIosIcon
                        onClick={onClickPrev}
                        titleAccess="Previous"
                        style={{ fontSize: 50 }}
                      />
                    }
                  </div>
                  <div>
                    <div className="tools">
                      <button title="Zoom In" onClick={zoomIn}><ZoomInIcon /></button>
                      <button title="Zoom Out" onClick={zoomOut}><ZoomOutIcon /></button>
                      <button title="Reset Zoom" onClick={resetTransform}><ZoomOutMapIcon /></button>
                      <button title="RotateImage" onClick={this.rotateImage}><RotateRight /></button>
                    </div>
                    <TransformComponent className="test">
                      <img
                        src={src}
                        alt="Doc"
                        className="image-preview"
                        onLoad={onImageLoaded}
                        onError={onImageError}
                        style={{rotate:`${this.state.imageRotation}deg`}}
                      />
                    </TransformComponent>
                    <div className="footer-details">
                      <div className="title">{title}</div>
                      <div className="title">{`${currentIndex + 1}/${imageLength}`}</div>
                    </div>
                  </div>
                  <div className="control" >
                    {
                      currentIndex !== (imageLength - 1) &&
                      <ArrowForwardIosIcon
                        onClick={onClickNext}
                        titleAccess="Next"
                        style={{ fontSize: 50 }}
                      />
                    }
                  </div>
                </div>
              </Fragment>
            )
            }
          </TransformWrapper>
        </div>
        {
          !isLoaded &&
          <CircularProgress />
        }
        {
          isError &&
          <div className="image-error"><BrokenImageIcon /> Image Cannot Be Loaded.</div>
        }
      </Fragment>
    )
  }
}
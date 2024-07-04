import React from 'react';
import classnames from 'classnames';

// Acts as a place holder
import FranchiseBanner from '../../../../../shared/img/brand/franchise.jpg'

import styles from './styles.module.scss';

const ProfileBanner = (props) => {
    const { profileDetails, uploadedProfileBanner, handleBackGroundBanner } = props;

    const divStyle = {
        backgroundImage: profileDetails && profileDetails.length
          ? profileDetails[0].backgroundImage != null
            ? 'url(' + profileDetails[0].backgroundImage + ')'
            : 'url(' + FranchiseBanner + ')'
          : uploadedProfileBanner && uploadedProfileBanner.length
            ? 'url(' + uploadedProfileBanner + ')'
            :'url(' + FranchiseBanner + ')',
        width: '100%',
        height: '350px',
        float: 'left',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      };

    return (
        <div className={styles.profileContainer}>
          <div style={divStyle}></div>
          {/* <div className={styles.backImgOverlay}> */}

            {/* <label className={styles.backgroundUpdate}>
              <i className="fa fa-camera backgroundCamera"></i>

              <span className={classnames("ml-2", styles.updateFont)}>Update profile banner</span>

              <input
                type="file"
                className={styles.imageDisplay}
                onChange={(e) => {
                  handleBackGroundBanner(e, 'banner');
                }}
              />
            </label> */}
          {/* </div> */}
        </div>
    );


}

export default ProfileBanner;

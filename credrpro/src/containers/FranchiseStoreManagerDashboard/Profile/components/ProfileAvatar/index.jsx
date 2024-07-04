import React from 'react';

import defaultAvatar from '../../../../../shared/img/brand/credrImg.jpeg'

import styles from './styles.module.scss';

const ProfileAvatar = (props) => {
    const { profileDetails, uploadedProfileAvatar, loading, handleProfileAvatar } = props;

    return (
        <div className={styles.imgContainer}>
            <img
                alt="franchise-profile-avatar"
                src={
                    profileDetails && profileDetails.length
                    ? profileDetails[0].profileImage != null
                        ? profileDetails[0].profileImage
                        : defaultAvatar
                    : uploadedProfileAvatar && uploadedProfileAvatar.length
                        ? uploadedProfileAvatar
                        : defaultAvatar
                    }
                className={styles.avatar}
            />
            {/* <div className={styles.overlay}>
                <label className={styles.profileImgUpdate}>
                <i
                    className={
                        loading
                            ? 'fa fa-spin fa-spinner'
                            : 'fa fa-camera cameraIcon'
                    }
                ></i>{' '}
                <span className={styles.updateImageFont}>update</span>
                <input
                    type="file"
                    className={styles.profileDisplay}
                    onChange={(e) => {
                        handleProfileAvatar(e, 'avatar');
                    }}
                ></input>
                </label>
            </div> */}
        </div>
    );
}

export default ProfileAvatar;

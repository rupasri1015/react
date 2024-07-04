import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ProfileBanner from './components/ProfileBanner';
import ProfileAvatar from './components/ProfileAvatar';
import ProfileDetails from './components/ProfileDetails';
import EditProfileDialog from './components/EditProfileDialog';

import { uploadProfileImage, fetchProfile, updateProfile } from '../../../redux/actions/franchiseStoreProfile';

import styles from './styles.module.scss';

const FranchiseProfile = (props) => {
    const [isOpen, toggleEditModal] = useState(false);

    const dispatch = useDispatch();

    const { uploadedProfileBanner, uploadedProfileAvatar, profile } = useSelector(state => state.franchiseStoreProfile)

    useEffect(() => {
      dispatch(fetchProfile())
    }, [dispatch])


    const _toggleEditModal = ({ open }) => {
      toggleEditModal(open);
    }

    /**
     * profile image can be both profile banner, profile avatar.
     * type - this defines whether user modified avatar or banner
     */
    const handleProfileImage = (event, type) => {
        var backgroundImg = event.target.files[0];

        const formdata = new FormData();
        formdata.append('file', backgroundImg);

        // Upload image to S3
        dispatch(uploadProfileImage({ formdata, type }));
    };

    const handleProfileUpdate = (updatedData) => {
      dispatch(updateProfile(updatedData));
      toggleEditModal(false);
    }

    return (
        <div className={styles.container}>
            <ProfileBanner uploadedProfileBanner={uploadedProfileBanner} handleBackGroundBanner={handleProfileImage} />
            <ProfileAvatar uploadedProfileAvatar={uploadedProfileAvatar}  handleProfileAvatar={handleProfileImage} />
            <ProfileDetails profileDetails={profile} toggleEditModal={_toggleEditModal} />
            <EditProfileDialog isOpen={isOpen} profileDetails={profile} closeEditModal={_toggleEditModal} handleProfileUpdate={handleProfileUpdate} />
        </div>
    );

};

export default FranchiseProfile;

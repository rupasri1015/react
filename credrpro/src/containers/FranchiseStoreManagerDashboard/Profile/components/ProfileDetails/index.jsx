import React from 'react';
import { size } from 'lodash'
import classNames from 'classnames';

import styles from './styles.module.scss';

const ProfileDetails = (props) => {
    const { profileDetails, toggleEditModal } = props;

    return (
        <div className={styles.container}>
            <div className="profileName text-center mt-2">
            {size(profileDetails)
                ? profileDetails.name === (undefined || null)
                ? 'Name'
                : profileDetails.name
                : 'Name'}
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="col-sm-6 float-left text-right">
                    <span>Store Sales Manager Mobile Number1. : </span>
                    </div>
                    <div className="col-sm-6 float-left">
                    <b>
                        {size(profileDetails)
                        ? profileDetails.mobileNo
                        : 'Store Sales Manager Mobile Number1'}
                    </b>
                    </div>
                </div>
                <div className="col-sm-12">
                    <div className="col-sm-6 float-left text-right">
                    {size(profileDetails) ? (
                        profileDetails.alternateMobileNo ===
                        (undefined || null) ? (
                        <div></div>
                        ) : (
                        <span>Store Sales Manager Mobile Number2. : </span>
                        )
                    ) : (
                        <div></div>
                    )}
                    </div>
                    <div className="col-sm-6 float-left">
                    <b>
                        {size(profileDetails) ? (
                        profileDetails.alternateMobileNo
                        ) : (
                        <div></div>
                        )}
                    </b>
                    </div>
                </div>
                <div className="col-sm-12">
                    <div className="col-sm-6 float-left text-right">
                    {size(profileDetails) ? (
                        profileDetails.whatsUpNo ===
                        (undefined || null) ? (
                        <div></div>
                        ) : (
                        <span>WhatsApp Mobile No. : </span>
                        )
                    ) : (
                        <div></div>
                    )}
                    </div>
                    <div className="col-sm-6 float-left">
                    <b>
                        {' '}
                        {size(profileDetails) ? (
                        profileDetails.whatsUpNo
                        ) : (
                        <div></div>
                        )}
                    </b>
                    </div>
                </div>
                <div className="col-sm-12">
                    <div className="col-sm-6 float-left text-right">
                    {size(profileDetails) ? (
                        profileDetails.ownerNumber ===
                        (undefined || null) ? (
                        <div></div>
                        ) : (
                        <span>Owner Mobile No. : </span>
                        )
                    ) : (
                        <div></div>
                    )}
                    </div>
                    <div className="col-sm-6 float-left">
                    <b>
                        {' '}
                        {size(profileDetails) ? (
                        profileDetails.ownerNumber
                        ) : (
                        <div></div>
                        )}
                    </b>
                    </div>
                </div>
                <div className="col-sm-12">
                    <div className="col-sm-6 float-left text-right">
                    {size(profileDetails) ? (
                        profileDetails.email ===
                        (undefined || null) ? (
                        <div></div>
                        ) : (
                        <span>Email : </span>
                        )
                    ) : (
                        <div></div>
                    )}
                    </div>
                    <div className="col-sm-6 float-left">
                    <b>
                        {' '}
                        {size(profileDetails) ? (
                        profileDetails.email
                        ) : (
                        <div></div>
                        )}
                    </b>
                    </div>
                </div>
                <div className="col-sm-12 ">
                    <div className="col-sm-6 float-left text-right">
                    {size(profileDetails) ? (
                        profileDetails.officialMail ===
                        (undefined || null) ? (
                        <div></div>
                        ) : (
                        <span>Official Email : </span>
                        )
                    ) : (
                        <div></div>
                    )}
                    </div>
                    <div className="col-sm-6 float-left">
                    <b>
                        {' '}
                        {size(profileDetails) ? (
                        profileDetails.officialMail
                        ) : (
                        <div></div>
                        )}
                    </b>
                    </div>
                </div>
                <div className="col-sm-12">
                <div className="col-sm-6 float-left text-right">
                {size(profileDetails) ? (
                    profileDetails.address ===
                    (undefined || null) ? (
                    <div></div>
                    ) : (
                    <span>Address : </span>
                    )
                ) : (
                    <div></div>
                )}
                </div>
                <div className="col-sm-6 float-left">
                <b>
                    {' '}
                    {size(profileDetails) ? (
                    profileDetails.address
                    ) : (
                    <div></div>
                    )}
                </b>
                </div>
            </div>
            </div>
            {/* <button
                type="button"
                className={classNames("btn btn-sm mt-4", styles.updateButton)}
                onClick={() => {
                    toggleEditModal({ open: true });
                }}
            >
                <i className="fa fa-pencil mr-1"></i>Update Info
            </button> */}
        </div>
    );
}

export default ProfileDetails;

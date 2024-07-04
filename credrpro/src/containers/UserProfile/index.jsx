import React, { Component, Fragment, useEffect } from 'react'
import { getFirstName, getLastName, getEmail, getAltNumber, getImage, getDob, saveUserInfo } from '../../core/services/userInfoStorageServices'
import { getUserID ,getHomePage} from '../../core/services/rbacServices'
import { updateProfile } from '../../core/services/miscServices'
import { showLoader, hideLoader } from '../../redux/actions/loaderAction'
import { setNotification } from '../../redux/actions/notificationAction'
import UpdateProfile from './components/UpdateProfile'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'


const initialState = {
  firstName: getFirstName(),
  lastName: getLastName(),
  email: getEmail(),
  alternateMobile: getAltNumber(),
  dob: getDob(),
}

class Update extends Component {

  submitFormData = (data) => {
    const { dispatch, history, location } = this.props
    data.userId = getUserID()
    updateProfile(data)
      .then(apiResponse => {
        if (apiResponse.isValid) {
          saveUserInfo(apiResponse.updatedUserData)
          // this.props.dispatch(setNotification('success', 'Success', 'Profile Updated Successfully'))
          // history.push('/updateprofile');
          if (location.state == 'undefined' || location.state == null) {
            history.push(getHomePage());
            dispatch(setNotification('success', 'Success', apiResponse.message))

          } else {
            let url = location.state.prevLocation
            history.push(url);
            dispatch(setNotification('success', 'Success', apiResponse.message))

          }


        }
        else {
          dispatch(setNotification('danger', 'Error', apiResponse.message))

        }
      })
  }
  render() {
    return (
      <Fragment>
        {
          console.log('check')
        }
        <UpdateProfile
          initialState={initialState}
          onSubmitForm={this.submitFormData}
        />
      </Fragment>

    );
  }
}
export default connect()(Update);
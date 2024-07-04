import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import LogInForm from './components/LogInForm';
import { connect } from 'react-redux';
import { CredRProLogo } from '../../core/utility/iconHelper';
import { setNotification } from '../../redux/actions/notificationAction';
import {
  login,
  isValid,
  saveUserDetails,
  fetchStoreAddress,
  saveStoreDetails,
} from '../../core/services/authenticationServices';
import { saveToken } from '../../core/services/tokenStorageServices';
import {
  getHomePage,
  getRole,
  getUserName,
  getUserID,
  getCityID,
  getMobile,
  RBAC_LINK
} from '../../core/services/rbacServices';
import { saveUserInfo } from '../../core/services/userInfoStorageServices'
import { showLoader, hideLoader } from '../../redux/actions/loaderAction';
import jwtDecode from 'jwt-decode';
import Mixpanel from '../../shared/components/MixPannel';

class LogIn extends PureComponent {
  componentDidMount() {
    const { history } = this.props;
    if (isValid() && getHomePage()) {
      this.loginSucess();
      history.push(getHomePage());
    } else {
      history.push('/');
    }
  }

  loginSucess = () => {
    Mixpanel.identify(getUserID());
    Mixpanel.track('Successful login');
    Mixpanel.people.set({
      $first_name: getUserName(),
      $type: getRole(),
    });
    if (process.env.NODE_ENV === 'production') {
      const FS = window.FS;
      if (FS) {
        const userData = {
          displayName: `${getUserName()} (${getRole()})`,
          userRole_str: getRole(),
          userId_str: String(getUserID()),
          userMobileNumber_str: String(getMobile()),
          userName_str: getUserName(),
          application_str: 'PRO',
        };
        if (getCityID()) {
          userData.userCityId_str = String(getCityID());
        } else {
          userData.userCityId_str = 'Central';
        }
        FS.identify(getUserID(), userData);
      }
    }
  };

  loginFailure = () => {
    Mixpanel.track('Login Failure');
  };

  handleLogin = async (credentials) => {
    const { history, dispatch } = this.props;
    dispatch(showLoader());
    login(credentials).then(async (apiResponse) => {
      const { token, message, userMaster } = apiResponse;
      if (apiResponse.isValid) {
        const userDetails = {
          userType: userMaster,
          userId: userMaster.roleId,
          userName: userMaster.firstName,
          storeId: userMaster.storeId,
          storeName: userMaster.storeName,
          cityId: userMaster.cityId,
        };
        saveUserDetails(userDetails);
        saveUserInfo(userMaster)
        try {
          const decoded = jwtDecode(token);
          const { userName } = decoded;
          saveToken(token);

          if (getHomePage()) {
            history.push(getHomePage());
            this.loginSucess();
            dispatch(
              setNotification(
                'success',
                message,
                `Welcome ${userName} to CredR Pro`
              )
            );
            dispatch(hideLoader());
          } else {
            this.loginFailure();
            dispatch(
              setNotification(
                'danger',
                'Access Denied',
                `User dont have access to PRO`
              )
            );
            dispatch(hideLoader());
          }
          if (RBAC_LINK.franchiseStoreManagerRoutes.includes(getRole())) {
            const storeDetailsResp = await fetchStoreAddress(userMaster.storeId);
            const { storeDetailsbyStoreId } = storeDetailsResp;
            const storeDetails = {
              storeName: storeDetailsbyStoreId[0].storeName,
              storeId: storeDetailsbyStoreId[0].storeID,
              storeRefName: storeDetailsbyStoreId[0].storeRefName,
              phoneNumber: storeDetailsbyStoreId[0].storePhNumber,
              addr1: storeDetailsbyStoreId[0].storeAddress1,
              addr2: storeDetailsbyStoreId[0].storeAddress2,
              city: storeDetailsbyStoreId[0].storeCityName,
              email: storeDetailsbyStoreId[0].storeEmail || '',
            };
            saveStoreDetails(storeDetails);
          }
        } catch {
          this.loginFailure();
          dispatch(setNotification('danger', 'Error', 'Invalid Token String'));
          dispatch(hideLoader());
        }
      } else {
        this.loginFailure();
        dispatch(setNotification('danger', 'Error', message));
        dispatch(hideLoader());
      }
    });
  };

  render() {
    return (
      <div className="account">
        <div className="account__wrapper">
          <div className="account__card">
            <div className="account__head">
              <img src={CredRProLogo} alt="Pro Logo" />
            </div>
            <LogInForm onSubmit={this.handleLogin} />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect()(LogIn));

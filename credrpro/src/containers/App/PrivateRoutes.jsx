import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import { isValid } from '../../core/services/authenticationServices'

const PrivateRoutes = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    isValid()
      ? <Component {...props} />
      : <Redirect to="/login" />
  )} />
)

export default PrivateRoutes
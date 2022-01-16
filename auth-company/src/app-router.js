import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { PrivateRoute } from './utils/components/private-route';
import LoginPage from './auth/components/login-page/login-page';
import { AdminPage } from './admin/components/admin-page/admin-page';
import { EmployeePage } from './employee/components/employee-page/employee-page';

export const AppRouter = ({ isAuth }) => {
  return (
    <Switch>
      <Route path="/" exact>
        <LoginPage />
      </Route>
      <PrivateRoute path="/admin" isAuth={isAuth}>
        <AdminPage />
      </PrivateRoute>
      <PrivateRoute path="/employee" isAuth={isAuth}>
        <EmployeePage />
      </PrivateRoute>
    </Switch>
  )
}

AppRouter.propTypes = {
  isAuth: PropTypes.bool
}

AppRouter.defaultProps = {
  isAuth: false
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { AppRouter }
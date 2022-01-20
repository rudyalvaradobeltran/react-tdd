import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { PrivateRoute } from './utils/components/private-route';
import LoginPage from './auth/components/login-page/login-page';
import { AdminPage } from './admin/components/admin-page/admin-page';
import { EmployeePage } from './employee/components/employee-page/employee-page';

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <LoginPage />
        </Route>
        <PrivateRoute path="/admin" allowRoles={['admin']}>
          <AdminPage />
        </PrivateRoute>
        <PrivateRoute path="/employee">
          <EmployeePage />
        </PrivateRoute>
      </Switch>
    </Router>
  )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { AppRouter }
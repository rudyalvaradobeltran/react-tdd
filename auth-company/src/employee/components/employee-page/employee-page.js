import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { AuthContext } from '../../../utils/contexts/auth-context';
import { UserLayout } from '../../../utils/components/user-layout';

export const EmployeePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <UserLayout user={user}>
      <Typography component="h1" variant="h5">
        Employee page
      </Typography>
      {user.role === 'admin' && <Button type="button">Delete</Button>}
    </UserLayout>
  )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  EmployeePage
}
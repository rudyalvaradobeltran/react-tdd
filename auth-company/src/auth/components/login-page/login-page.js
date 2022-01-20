import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../../../utils/contexts/auth-context';
import { Redirect } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import { login } from '../../services/index';
import { validateEmail, validatePassword } from '../../../utils/helpers';

const LoginPage = ({ onSuccessLogin }) => {
  const {handleSuccessLogin, user} = useContext(AuthContext)
  const [emailValidationMessage, setEmailValidationMessage] = useState('');
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
  const [formValues, setFormValues] = useState({email: '', password: ''});
  const [isFetching, setIsFetching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const {email, password} = formValues;
    const isEmailEmpty = !email;
    const isPasswordEmpty = !password;
    if (isEmailEmpty) {
      setEmailValidationMessage('The email is required');
    }
    if (isPasswordEmpty) {
      setPasswordValidationMessage('The password is required');
    }
    return isEmailEmpty || isPasswordEmpty;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (validateForm()) {
      return;
    }
    const {email, password} = formValues;
    try {
      setIsFetching(true);
      const response = await login({email, password});
      if (!response.ok) {
        throw response;
      }
      const { user: {role, username} } = await response.json();
      handleSuccessLogin({ role, username });
    } catch (error) {
      const data = await error.json();
      setErrorMessage(data.message);
      setIsOpen(true);
    } finally {
      setIsFetching(false);
    }
  }

  const handleChange = ({target: {value, name}}) => {
    setFormValues({...formValues, [name]: value});
  }

  const handleBlurEmail = () => {
    if (!validateEmail(formValues.email)) {
      setEmailValidationMessage('The email is invalid');
      return;
    }
    setEmailValidationMessage('');
  }

  const handleBlurPassword = () => {
    if (!validatePassword(formValues.password)) {
      setPasswordValidationMessage('The password must contain at least 8 characters, one upper case letter, one number and one special character')
      return
    }

    setPasswordValidationMessage('')
  }

  const handleClose = () => setIsOpen(false);

  if (!isFetching && user.role === 'admin') {
    return <Redirect to="/admin" />;
  }

  if (!isFetching && user.role === 'employee') {
    return <Redirect to="/employee" />;
  }

  return (
    <>
      <h1>Login page</h1>
      {isFetching && <CircularProgress data-testid="loading-indicator" />}
      <form onSubmit={handleSubmit}>
        <TextField
          label="email"
          id="email"
          name="email"
          required
          helperText={emailValidationMessage}
          onChange={handleChange}
          value={formValues.email}
          onBlur={handleBlurEmail}
          error={!!emailValidationMessage}
        />
        <TextField
          label="password"
          id="password"
          type="password"
          name="password"
          required
          helperText={passwordValidationMessage}
          onChange={handleChange}
          value={formValues.password}
          onBlur={handleBlurPassword}
          error={!!passwordValidationMessage}
        />
        <Button disabled={isFetching} type="submit">Send</Button>
      </form>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        open={isOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        message={errorMessage}
      />
    </>
  );
};

LoginPage.propTypes = {
  onSuccessLogin: PropTypes.func,
}

LoginPage.defaultProps = {
  onSuccessLogin: () => {},
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { LoginPage };

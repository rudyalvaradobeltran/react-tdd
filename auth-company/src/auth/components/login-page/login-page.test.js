import React from 'react';
import { screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import LoginPage from './login-page';
import { handlers, handleInvalidCredentials } from '../../../mocks/handlers';
import { renderWithRouter, fillInputs, getSendButton } from '../../../utils/tests';
import { AuthContext } from '../../../utils/contexts/auth-context';

const passwordValidationMessage = 'The password must contain at least 8 characters, one upper case letter, one number and one special character';

const getPasswordInput = () => screen.getByLabelText(/password/i);

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

beforeEach(() =>
  renderWithRouter(
    <AuthContext.Provider
      value={{ handleSuccessLogin: jest.fn(), user: {role: ''} }}
    >
      <LoginPage />
    </AuthContext.Provider>,
  ),
)

describe('When login page is mounted', () => {
  it('must display the login title', () => {
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });
  it('must have a form with the following fields: email, password and a submit button', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });
});

describe('When the user leaves empty fields and clicks the submit button', () => {
  it('display required messages as the format: "The [field name] is required"', async () => {
    expect(screen.queryByText(/the email is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/the password is required/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(screen.getByText(/the email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/the password is required/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: /send/i })).not.toBeDisabled());
  });
});

describe('When the user fills the fields and clicks the submit button', () => {
  it('must not display the required messages"', async () => {
    fillInputs();
    fireEvent.click(getSendButton());
    expect(screen.queryByText(/the email is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/the password is required/i)).not.toBeInTheDocument();
    await waitFor(() => expect(getSendButton()).not.toBeDisabled());
  });
});

describe('When the user fills and blur the email input with invalid email, and then focus and change with valid value', () => {
  it('must not display a validation message', () => {
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid.email' } });
    fireEvent.blur(emailInput);
    expect(screen.getByText(/the email is invalid/i)).toBeInTheDocument();
    fireEvent.change(emailInput, { target: { value: 'john.doe@test.com' } });
    fireEvent.blur(emailInput);
    expect(screen.queryByText(/the email is invalid/i)).not.toBeInTheDocument();
  });
});

describe('When the user fills and blur the password input with a value with 7 character length', () => {
  it(`must display the validation message "${passwordValidationMessage}"`, () => {
    fireEvent.change(getPasswordInput(), { target: { value: 'Bla!123' } });
    fireEvent.blur(getPasswordInput());
    expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument();
  });
});

describe('When the user fills and blur the password input with a value without one upper case character', () => {
  it(`must display the validation message "${passwordValidationMessage}"`, () => {
    fireEvent.change(getPasswordInput(), { target: { value: 'bla!1234' } });
    fireEvent.blur(getPasswordInput());
    expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument();
  });
});

describe('When the user fills and blur the password input with a value without one number', () => {
  it(`must display the validation message "${passwordValidationMessage}"`, () => {
    fireEvent.change(getPasswordInput(), { target: { value: 'Bla!bla!' } });
    fireEvent.blur(getPasswordInput());
    expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument();
  });
});

describe('When the user fills and blur the password input without one special character and then change it with a valid value and blur again', () => {
  it('must not display the validation message', () => {
    fireEvent.change(getPasswordInput(), { target: { value: 'Bla12345' } });
    fireEvent.blur(getPasswordInput());
    expect(screen.getByText(passwordValidationMessage)).toBeInTheDocument();
    fireEvent.change(getPasswordInput(), { target: { value: 'Bla_123!' } });
    fireEvent.blur(getPasswordInput());
    expect(screen.queryByText(passwordValidationMessage)).not.toBeInTheDocument();
  });
});

describe('When the user submit the login form with valid data', () => {
  it('must disable the submit button while the form page is fetching the data', async () => {
    fillInputs();
    fireEvent.click(getSendButton());
    expect(getSendButton()).toBeDisabled();
    await waitFor(() => expect(getSendButton()).not.toBeDisabled());
  });
  it('must be a loading indicator at the top of the form while it is fetching', async () => {
    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    fillInputs();
    fireEvent.click(getSendButton());
    expect(screen.queryByTestId('loading-indicator')).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'));
  });
});

describe('When the user submit the login form with valid data and there is an unexpected server error', () => {
  it('must display the error message "Unexpected error, please try again" from the api', async () => {
    server.use(
      rest.post('/login', (req, res, ctx) =>
        res(
          ctx.status(500),
          ctx.json({ message: 'Unexpected error, please try again' }),
        ),
      ),
    );
    expect(
      screen.queryByText(/unexpected error, please try again/i),
    ).not.toBeInTheDocument();
    fillInputs();
    fireEvent.click(getSendButton());
    expect(
      await screen.findByText(/unexpected error, please try again/i),
    ).toBeInTheDocument();
  });
});

describe('When the user submit the login form with valid data and there is an invalid credentials error', () => {
  it('must display the error message "The email or password are not correct" from the api', async () => {
    const wrongEmail = 'wrong.email@gob.cl';
    const wrongPassword = 'wrongPass!1';
    server.use(handleInvalidCredentials({ wrongEmail, wrongPassword }));
    fillInputs({ email: wrongEmail, password: wrongPassword });
    fireEvent.click(getSendButton());
    expect(
      await screen.findByText(/the email or password are not correct/i),
    ).toBeInTheDocument();
  });
});
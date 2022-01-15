import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import LoginPage from './login-page';

beforeEach(() => render(<LoginPage />));

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
  });
});

describe('When the user fills the fields and clicks the submit button', () => {
  it('must not display the required messages"', async () => {
    screen.getByLabelText(/email/i).value = 'John.doe@test.com';
    screen.getByLabelText(/password/i).value = 'mySecurePassword666';
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(screen.queryByText(/the email is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/the password is required/i)).not.toBeInTheDocument();
  });
});

describe('when the user fills and blur the email input with invalid email', () => {
  it('must display a validation message', () => {
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid.email' } });
    fireEvent.blur(screen.getByLabelText(/email/i));
    expect(screen.getByText(/the email is invalid/i)).toBeInTheDocument();
  });
});
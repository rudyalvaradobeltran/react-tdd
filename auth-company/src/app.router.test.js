import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { 
  renderWithAuthProvider,
  goTo,
  fillInputs,
  getSendButton
} from './utils/tests';
import { AppRouter } from './app-router';
import { handlers } from './mocks/handlers';
import { ADMIN_EMAIL, EMPLOYEE_EMAIL } from './consts';

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe('When the user is not authenticated and enters on admin page', () => {
  it('must be redirected to login page', () => {
    goTo('/admin');
    renderWithAuthProvider(<AppRouter />);
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });
});

describe('When the user is not authenticated and enters on employee page', () => {
  it('must be redirected to login page', () => {
    goTo('/employee');
    renderWithAuthProvider(<AppRouter />);
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });
});

describe('When the admin is authenticated in login page', () => {
  it('must be redirected to admin page', async () => {
    renderWithAuthProvider(<AppRouter />)
    fillInputs({email: ADMIN_EMAIL})
    fireEvent.click(getSendButton())
    expect(await screen.findByText(/admin page/i)).toBeInTheDocument()
    expect(await screen.findByText(/john doe/i)).toBeInTheDocument()
  });
});

describe('When the admin goes to employees page', () => {
  it('must have access', () => {
    goTo('/admin');
    renderWithAuthProvider(<AppRouter />, { isAuth: true, role: 'admin' });
    fireEvent.click(screen.getByText(/employee/i));
    expect(screen.getByText(/^employee page/i)).toBeInTheDocument();
  });
});

describe('When the employee is authenticated in login page', () => {
  it('must be redirected to employee page', async () => {
    renderWithAuthProvider(<AppRouter />);
    fillInputs({ email: EMPLOYEE_EMAIL });
    fireEvent.click(getSendButton());
    expect(await screen.findByText(/employee page/i)).toBeInTheDocument();
  });
});

describe('When the employee goes to admin page', () => {
  it('must redirect to employee page', () => {
    goTo('/admin');
    renderWithAuthProvider(<AppRouter />, { isAuth: true, role: 'employee' });
    expect(screen.getByText(/employee page/i)).toBeInTheDocument();
  });
});
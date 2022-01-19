import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { renderWithRouter } from './utils/tests';
import { AppRouter } from './app-router';
import { handlers } from './mocks/handlers';

const getSendButton = () => screen.getByRole('button', { name: /send/i });

const server = setupServer(...handlers);

const fillInputs = ({ email = 'john.doe@test.com', password = 'mySecurePassword666' } = {}) => {
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: password } });
}

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe('When the user is not authenticated and enters on admin page', () => {
  it('must be redirected to login page', () => {
    renderWithRouter(<AppRouter />, { route: '/admin' });
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });
});

describe('When the user is not authenticated and enters on employee page', () => {
  it('must be redirected to login page', () => {
    renderWithRouter(<AppRouter />, { route: '/employee' });
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });
});

describe('When the user is authenticated and enters into the admin page', () => {
  it('must be redirected to admin page', async () => {
    renderWithRouter(<AppRouter isAuth />, { route: '/admin' });
    expect(screen.getByText(/admin page/i)).toBeInTheDocument();
  });
});

describe('When the admin is authenticated in login page', () => {
  it('must be redirected to admin page', async () => {
    renderWithRouter(<AppRouter />);
    fillInputs({ email: 'admin@email.com' });
    fireEvent.click(getSendButton());
    expect(await screen.findByText(/admin page/i)).toBeInTheDocument();
  });
});



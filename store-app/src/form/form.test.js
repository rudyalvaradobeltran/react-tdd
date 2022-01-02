import React from 'react';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Form } from './form';
import {
  CREATED_STATUS,
  ERROR_SERVER_STATUS,
  INVALID_REQUEST_STATUS
} from '../consts/httpStatus';

const server = setupServer(
  rest.post('/products', (req, res, ctx) => {
    const { name, size, type } = req.body;
    if (name && size && type) {
      return res(ctx.status(CREATED_STATUS));
    }
    return res(ctx.status(ERROR_SERVER_STATUS));
  }),
);

beforeAll(() => server.listen());
afterAll(() => server.close());
beforeEach(() => render(<Form />));
afterEach(() => server.resetHandlers());

describe('when the form is mounted', () => {
  it('there must be a create product form page', () => {
    expect(screen.getByRole('heading', { name: /create product/i }), )
      .toBeInTheDocument();
  });

  it('form must have fields: name, size, type[options]', () => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByText(/electronic/i)).toBeInTheDocument();
    expect(screen.getByText(/furniture/i)).toBeInTheDocument();
    expect(screen.getByText(/clothing/i)).toBeInTheDocument();
  });

  it('submit button should exist', () => {
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});

describe('when the user submits the form without values', () => {
  it('should display validation messages', async () => {
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/the type is required/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/the type is required/i)).toBeInTheDocument();
    await waitFor(() => 
      expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled(),
    );
  });
});

describe('when the user blurs an empty field', () => {
  it('should display a validation error message for input name', () => {
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument();
    fireEvent.blur(screen.getByLabelText(/name/i), { target: { name: 'name', value: '' } });
    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument();
  });
  it('should display a validation error message for input size', () => {
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument();
    fireEvent.blur(screen.getByLabelText(/size/i), { target: { name: 'size', value: '' } });
    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument();
  });
});

describe('when the user submits the form', () => {
  it('submit button should be disabled until the request is done', async() => {
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    await waitFor(() => 
      expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled(),
    );
  });
  it('form must display message and clean fields', async() => {
    const nameInput = screen.getByLabelText(/name/i);
    const sizeInput = screen.getByLabelText(/size/i);
    const typeInput = screen.getByLabelText(/type/i);
    fireEvent.change(nameInput, {
      target: { name: 'name', value: 'my product' } 
    });
    fireEvent.change(sizeInput, {
      target: { name: 'name', value: '10' } 
    });
    fireEvent.change(typeInput, {
      target: { name: 'name', value: 'Electronic' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => 
      expect(screen.getByText(/product stored/i)).toBeInTheDocument(),
    );
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/size/i)).toHaveValue('');
    expect(screen.getByLabelText(/type/i)).toHaveValue('');
  });
});

describe('when the user submits form and server returns error', () => {
  it('the form must display error message', async() => {
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => 
      expect(screen.getByText(/unexpected error, please try again/i)).toBeInTheDocument(),
    );
  });
});

describe('when the user submits form and server returns invalid request error', () => {
  it('the form must display error message', async() => {
    server.use(
      rest.post('/products', (req, res, ctx) => {
        return res(
          ctx.status(INVALID_REQUEST_STATUS),
          ctx.json({ message: 'Form invalid, type, size and type are required' }),
        )
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => 
      expect(
        screen.getByText(/form invalid, type, size and type are required/i)
      ).toBeInTheDocument(),
    );
  });
});

describe('when the user submits form and server returns invalid request error', () => {
  it('the form must display error message', async() => {
    server.use(
      rest.post('/products', (req, res) => res.networkError('Failed to connect'),
    ));
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => 
      expect(
        screen.getByText(/connection error, please try later/i)
      ).toBeInTheDocument(),
    );
  });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import Helloworld from './Helloworld';

test('renders hello world', () => {
  render(<Helloworld />)
  const title = screen.getByText(/hello world/i);
  expect(title).toBeInTheDocument();
});
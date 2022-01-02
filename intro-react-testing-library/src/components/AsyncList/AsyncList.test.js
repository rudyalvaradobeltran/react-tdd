import React from 'react';
import { render, screen } from '@testing-library/react';
import AsyncList from './AsyncList';

test('show the food data', async () => {
  render(<AsyncList />);
  const hamburger = await screen.findByText(/hamburger/i);
  expect(hamburger).toBeInTheDocument();
});
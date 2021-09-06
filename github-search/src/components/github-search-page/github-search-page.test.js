/* eslint-disable jest/valid-expect */
import React from "react";
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import GithubSearchPage from './github-search-page';

beforeEach(() => render(<GithubSearchPage />));

describe('when GithubSearchPage is mounted', () => {
  it('must display title', () => {
    expect(screen.getByText(/github repositories list/i)).toBeInTheDocument();
  });
  it('must be a textfield: filter by', () => {
    expect(screen.getByLabelText(/filter by/i)).toBeInTheDocument();
  });
  it('must be search button', () => {
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });
  it('must be an initial message', () => {
    expect(screen.getByText(/please provide a search option and click in the search button/i))
      .toBeInTheDocument();
  });
});

describe('when user does a search', () => {
  const fireClickSearch = () => fireEvent.click(screen.getByRole('button', { name: /search/i }));

  it('search button must be disabled until search is done', async () => {
    expect(screen.getByRole('button', { name: /search/i })).not.toBeDisabled();
    fireClickSearch();
    expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();
    await waitFor(() => 
      expect(screen.getByRole('button', { name: /search/i })).not.toBeDisabled()
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
  it('data should be displayed as a sticky table', async () => {
    fireClickSearch();
    await waitFor(() => 
      expect(screen.queryByText(
        /please provide a search option and click in the search button/i,
      )).not.toBeInTheDocument()
    );
  });
  it('must be table headers: repository, stars, forks, open issues and updated at', async () => {
    fireClickSearch();
    const table = await screen.findByRole('table');
    const tableHeaders = within(table).getAllByRole('columnheader');
    expect(tableHeaders).toHaveLength(5);
    const [repository, stars, forks, openIssues, updatedAt] = tableHeaders;
    expect(repository).toHaveTextContent(/repository/i);
    expect(stars).toHaveTextContent(/stars/i);
    expect(forks).toHaveTextContent(/forks/i);
    expect(openIssues).toHaveTextContent(/open issues/i);
    expect(updatedAt).toHaveTextContent(/updated at/i);
  });
  it('each table result must contain: avatar, name, stars, updated at, forks, open issues '+
    'and a link that opens a new tab', async () => {
    fireClickSearch();
    const table = await screen.findByRole('table');
    const withinInTable = within(table);
    const tableCells = withinInTable.getAllByRole('cell');
    const [repository, stars, forks, openIssues, updatedAt] = tableCells;
    expect(within(tableCells[0]).getByRole('img', { name: /test/i }));
    expect(tableCells).toHaveLength(5);
    expect(repository).toHaveTextContent(/test/i); 
    expect(stars).toHaveTextContent(/5/i); 
    expect(forks).toHaveTextContent(/10/i); 
    expect(openIssues).toHaveTextContent(/100/i); 
    expect(updatedAt).toHaveTextContent(/10-10-2021/i); 
    expect(withinInTable.getByText(/test/i).closest('a')).toHaveAttribute(
      'href', 'localhost:3000/test'
    );
  });
});
/* eslint-disable jest/valid-expect */
import React from "react";
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import GithubSearchPage from './github-search-page';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const makeFakeResponse = (total_count, incomplete_results, items) => ({
  "total_count": total_count,
  "incomplete_results": incomplete_results,
  "items": items
});

const makeFakeRepo = () => ({
  "id": 363502853,
  "name": "scraping-falabella",
  "owner": {
    "avatar_url": "https://avatars.githubusercontent.com/u/72688964?v=4",
  },
  "html_url": "https://github.com/rudyalvaradobeltran/scraping-falabella",
  "updated_at": "2021-05-01",
  "stargazers_count": 0,
  "forks_count": 0,
  "open_issues_count": 0
});

const server = setupServer(
  rest.get('/search/repositories', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(makeFakeResponse(1, false, [makeFakeRepo()]))
    );
  }),
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

beforeEach(() => render(<GithubSearchPage />));

const fireClickSearch = () => fireEvent.click(screen.getByRole('button', { name: /search/i }));

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
    const avatarImg = within(repository).getByRole('img', { name: makeFakeRepo().name });
    expect(avatarImg).toBeInTheDocument();
    expect(tableCells).toHaveLength(5);
    expect(repository).toHaveTextContent(makeFakeRepo().name);
    expect(stars).toHaveTextContent(makeFakeRepo().stargazers_count); 
    expect(forks).toHaveTextContent(makeFakeRepo().forks_count); 
    expect(openIssues).toHaveTextContent(makeFakeRepo().open_issues_count); 
    expect(updatedAt).toHaveTextContent(makeFakeRepo().updated_at); 
    expect(withinInTable.getByText(makeFakeRepo().name).closest('a')).toHaveAttribute(
      'href', makeFakeRepo().html_url
    );
    expect(avatarImg).toHaveAttribute('src', makeFakeRepo().owner.avatar_url);
  });

  it('must display total results number of search and current number of results', async () => {
    fireClickSearch();
    await screen.findByRole('table');
    expect(screen.getByText(/1-1 of 1/)).toBeInTheDocument();
  });

  it('must display size of page with options: 30, 50, 100, default is 30', async () => {
    fireClickSearch();
    await screen.findByRole('table');
    expect(screen.getByLabelText(/rows per page/i)).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByLabelText(/rows per page/i));
    const listbox = screen.getByRole('listbox', { name: /rows per page/i });
    const options = within(listbox).getAllByRole('option');
    const [option30, option50, option100] = options;
    expect(option30).toHaveTextContent(/30/);
    expect(option50).toHaveTextContent(/50/);
    expect(option100).toHaveTextContent(/100/);
  });

  it('must be next and previous pagination buttons', async () => {
    fireClickSearch();
    await screen.findByRole('table');
    const previousButton = screen.getByRole('button', { name: /previous page/i });
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
    expect(previousButton).toBeInTheDocument();
    expect(previousButton).toBeDisabled();
  });
});

describe('when user does a search without results', () => {
  it('must show an empty state message', async () => {
    server.use(
      rest.get('/search/repositories', (req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json(makeFakeResponse(0, false, []))
        )
      )
    );
    fireClickSearch();
    await waitFor(() => 
      expect(screen.getByText(/your search has no results/i)).toBeInTheDocument()
    );
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  });
});
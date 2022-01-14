/* eslint-disable jest/valid-expect */
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within
} from "@testing-library/react";
import GithubSearchPage from "./github-search-page";
import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  getReposListBy,
  makeFakeResponse,
  makeFakeError,
  makeFakeRepo,
} from "../../__fixtures__/repos";

const fakeResponse = makeFakeResponse({ totalCount: 1 });

const fakeRepo = makeFakeRepo();

fakeResponse.items = [fakeRepo];

const server = setupServer(
  rest.get("/search/repositories", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(fakeResponse));
  })
);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

beforeEach(() => render(<GithubSearchPage />));

const fireClickSearch = () =>
  fireEvent.click(screen.getByRole("button", { name: /search/i }));

describe("when GithubSearchPage is mounted", () => {
  it("must display title", () => {
    expect(screen.getByText(/github repositories list/i)).toBeInTheDocument();
  });
  it("must be a textfield: filter by", () => {
    expect(screen.getByLabelText(/filter by/i)).toBeInTheDocument();
  });
  it("must be search button", () => {
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });
  it("must be an initial message", () => {
    expect(
      screen.getByText(
        /please provide a search option and click in the search button/i
      )
    ).toBeInTheDocument();
  });
});

describe("when user does a search", () => {
  it("search button must be disabled until search is done", async () => {
    expect(screen.getByRole("button", { name: /search/i })).not.toBeDisabled();
    fireEvent.change(screen.getByLabelText(/filter by/i), {
      target: { value: "test" },
    });
    expect(screen.getByRole("button", { name: /search/i })).not.toBeDisabled();
    fireClickSearch();
    expect(screen.getByRole("button")).toBeDisabled();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /search/i })).not.toBeDisabled()
    );
  });
  it("data should be displayed as a sticky table", async () => {
    fireClickSearch();
    await waitFor(() =>
      expect(
        screen.queryByText(
          /please provide a search option and click in the search button/i
        )
      ).not.toBeInTheDocument()
    );
  });
  it("must be table headers: repository, stars, forks, open issues and updated at", async () => {
    fireClickSearch();
    const table = await screen.findByRole("table");
    const tableHeaders = within(table).getAllByRole("columnheader");
    expect(tableHeaders).toHaveLength(5);
    const [repository, stars, forks, openIssues, updatedAt] = tableHeaders;
    expect(repository).toHaveTextContent(/repository/i);
    expect(stars).toHaveTextContent(/stars/i);
    expect(forks).toHaveTextContent(/forks/i);
    expect(openIssues).toHaveTextContent(/open issues/i);
    expect(updatedAt).toHaveTextContent(/updated at/i);
  });
  it(
    "each table result must contain: avatar, name, stars, updated at, forks, open issues " +
      "and a link that opens a new tab",
    async () => {
      fireClickSearch();
      const table = await screen.findByRole("table");
      const withinInTable = within(table);
      const tableCells = withinInTable.getAllByRole("cell");
      const [repository, stars, forks, openIssues, updatedAt] = tableCells;
      const avatarImg = within(repository).getByRole("img", {
        name: makeFakeRepo().name,
      });
      expect(avatarImg).toBeInTheDocument();
      expect(tableCells).toHaveLength(5);
      expect(repository).toHaveTextContent(makeFakeRepo().name);
      expect(stars).toHaveTextContent(makeFakeRepo().stargazers_count);
      expect(forks).toHaveTextContent(makeFakeRepo().forks_count);
      expect(openIssues).toHaveTextContent(makeFakeRepo().open_issues_count);
      expect(updatedAt).toHaveTextContent(makeFakeRepo().updated_at);
      expect(
        withinInTable.getByText(makeFakeRepo().name).closest("a")
      ).toHaveAttribute("href", makeFakeRepo().html_url);
      expect(avatarImg).toHaveAttribute("src", makeFakeRepo().owner.avatar_url);
    }
  );

  it("must display total results number of search and current number of results", async () => {
    fireClickSearch();
    await screen.findByRole("table");
    expect(screen.getByText(/1-1 of 1/)).toBeInTheDocument();
  });

  it("must display size of page with options: 30, 50, 100, default is 30", async () => {
    fireClickSearch();
    await screen.findByRole("table");
    expect(screen.getByLabelText(/rows per page/i)).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByLabelText(/rows per page/i));
    const listbox = screen.getByRole("listbox", { name: /rows per page/i });
    const options = within(listbox).getAllByRole("option");
    const [option30, option50, option100] = options;
    expect(option30).toHaveTextContent(/30/);
    expect(option50).toHaveTextContent(/50/);
    expect(option100).toHaveTextContent(/100/);
  });

  it("must be next and previous pagination buttons", async () => {
    fireClickSearch();
    await screen.findByRole("table");
    const previousButton = screen.getByRole("button", {
      name: /previous page/i,
    });
    expect(
      screen.getByRole("button", { name: /next page/i })
    ).toBeInTheDocument();
    expect(previousButton).toBeInTheDocument();
    expect(previousButton).toBeDisabled();
  });
});

describe("when user does a search without results", () => {
  it("must show an empty state message", async () => {
    server.use(
      rest.get("/search/repositories", (req, res, ctx) =>
        res(ctx.status(200), ctx.json(makeFakeResponse(0, false, [])))
      )
    );
    fireClickSearch();
    await waitFor(() =>
      expect(
        screen.getByText(/your search has no results/i)
      ).toBeInTheDocument()
    );
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});

describe("When the user types on filter by and does a search", () => {
  it("must display the related repos", async () => {
    const REPO_NAME = "laravel";
    const internalFakeResponse = makeFakeResponse();
    const expectedRepo = getReposListBy({ name: REPO_NAME })[0];
    server.use(
      rest.get("/search/repositories", (req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            ...internalFakeResponse,
            items: getReposListBy({ name: req.url.searchParams.get("q") }),
          })
        )
      )
    );
    fireEvent.change(screen.getByLabelText(/filter by/i), {
      target: { value: REPO_NAME },
    });
    fireClickSearch();
    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();
    const withinInTable = within(table);
    const tableCells = withinInTable.getAllByRole("cell");
    const [repository] = tableCells;
    expect(repository).toHaveTextContent(expectedRepo.name);
  });
});

describe("When there is an unprocessable entity from the backend (422)", () => {
  it("must display an alert message error with the message from the service", async () => {
    expect(screen.queryByText(/validation failed/i)).not.toBeInTheDocument();
    server.use(
      rest.get("/search/repositories", (req, res, ctx) =>
        res(ctx.status(422), ctx.json(makeFakeError()))
      )
    );
    fireClickSearch();
    expect(await screen.findByText(/validation failed/i)).toBeVisible();
  });
});

describe("When there is an unexpected error from the backend (500)", () => {
  it("must display an alert message error with the message from the service", async () => {
    expect(screen.queryByText(/unexpected error/i)).not.toBeInTheDocument();
    server.use(
      rest.get("/search/repositories", (req, res, ctx) =>
        res(ctx.status(500), ctx.json(makeFakeError({ message: 'Unexpected error' })))
      )
    );
    fireClickSearch();
    expect(await screen.findByText(/unexpected error/i)).toBeVisible();
  });
});

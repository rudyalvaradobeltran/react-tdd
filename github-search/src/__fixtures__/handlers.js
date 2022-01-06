import { getReposPerPage, makeFakeResponse } from './repos';

export const handlePaginated = (req, res, ctx) =>
  res(
    ctx.status(200),
    ctx.json({
      ...makeFakeResponse({totalCount: 10000}),
      items: getReposPerPage({
        perPage: Number(req.url.searchParams.get('per_page')),
        currentPage: req.url.searchParams.get('page'),
      }),
    }),
  )
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  handlePaginated
}
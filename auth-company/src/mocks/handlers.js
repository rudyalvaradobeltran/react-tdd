import { rest } from 'msw';

export const handlers = [
  rest.post('/login', (req, res, ctx) => {
    sessionStorage.setItem('is-authenticated', true);
    return res(ctx.status(200), ctx.json({ user: { role: 'admin' }}));
  }),
];

export const handleInvalidCredentials = ({ wrongEmail, wrongPassword }) => {
  return rest.post('/login', (req, res, ctx) => {
    const { email, password } = req.body;
    if (email === wrongEmail && password === wrongPassword) {
      return res(
        ctx.status(401),
        ctx.json({ message: 'The email or password are not correct' }),
      );
    }
    return res(ctx.status(200));
  });
}

const handleExports = { handlers, handleInvalidCredentials };

export default handleExports;
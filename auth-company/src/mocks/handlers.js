import { rest } from 'msw';

export const handlers = [
  rest.post('/login', (req, res, ctx) => {
    sessionStorage.setItem('is-authenticated', true);
    let role = '';
    const { email } = req.body;
    if (email === 'admin@email.com') {
      role = 'admin';
    }
    return res(ctx.status(200), ctx.json({ user: { role }}));
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
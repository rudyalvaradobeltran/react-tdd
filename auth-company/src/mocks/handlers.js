import { rest } from 'msw';
import {
  ADMIN_EMAIL,
  EMPLOYEE_EMAIL,
} from '../consts';

export const handlers = [
  rest.post('/login', (req, res, ctx) => {
    sessionStorage.setItem('is-authenticated', true);
    let role = '';
    const { email } = req.body;
    if (email === ADMIN_EMAIL) {
      role = 'admin';
    }
    if (email === EMPLOYEE_EMAIL) {
      role = 'employee'
    }
    return res(ctx.status(200), ctx.json({user: {role, username: 'John Doe'}}));
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

// eslint-disable-next-line import/no-anonymous-default-export
export default { handlers, handleInvalidCredentials };
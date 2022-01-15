import { rest } from 'msw';

export const handlers = [
  rest.post('/login', (req, res, ctx) => {
    sessionStorage.setItem('is-authenticated', true)
    // let role = '';
    // const { email } = req.body;
    // if (email === ADMIN_EMAIL) {
    //   role = ADMIN_ROLE
    // }
    // if (email === EMPLOYEE_EMAIL) {
    //   role = EMPLOYEE_ROLE
    // }
    // return res(ctx.status(200), ctx.json({user: {role, username: 'John Doe'}}))
    return res(ctx.status(200));
  }),
];

export const handlerInvalidCredentials = ({wrongPassword, wrongEmail}) =>
  rest.post('/login', (req, res, ctx) => {
    // const {email, password} = req.body

    // if (email === wrongEmail && password === wrongPassword) {
    //   return res(
    //     ctx.status(HTTP_INVALID_CREDENTIALS_STATUS),
    //     ctx.json({message: 'The email or password are not correct'}),
    //   )
    // }

    return res(ctx.status(200))
  });

const handleExports = { handlers, handlerInvalidCredentials };

export default handleExports;
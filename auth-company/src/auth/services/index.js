export const login = () => fetch('/login', { method: 'POST' });

// eslint-disable-next-line import/no-anonymous-default-export
export default { login };
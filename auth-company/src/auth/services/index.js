export const login = ({ email, password }) => 
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

// eslint-disable-next-line import/no-anonymous-default-export
export default { login };
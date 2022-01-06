/* eslint-disable import/no-anonymous-default-export */
const baseUrl = process.env.NODE_ENV === 'test' ? '' : process.env.REACT_APP_BASE_URL;

export const getRepos = ({ q, rowsPerPage }) => {
  return fetch(
    baseUrl+'/search/repositories?q='+q+'&page=1&per_page='+rowsPerPage
  );
}

export default {
  getRepos
}
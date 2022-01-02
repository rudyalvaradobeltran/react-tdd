/* eslint-disable import/no-anonymous-default-export */
const baseUrl = process.env.NODE_ENV === 'test' ? '' : process.env.REACT_APP_BASE_URL;

export const getRepos = () => 
  fetch(
    baseUrl+'/search/repositories?q=scraping-falabella&page=1&per_page=30'
  );

export default {
  getRepos
}
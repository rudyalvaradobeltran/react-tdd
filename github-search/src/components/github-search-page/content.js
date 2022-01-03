import React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  Box,
  TablePagination
} from '@material-ui/core'

const tableHeaders = ['Repository', 'Stars', 'Forks', 'Open Issues', 'Updated At']

const Content = ({ isSearchApplied, reposList }) => {
  if (isSearchApplied && reposList.length > 0) {
    return (
      <>
        <table>
          <thead>
            <tr>
              {tableHeaders.map((name) => (
                <th key={name}>{name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reposList.map(
              ({
                name,
                id,
                stargazers_count,
                forks_count,
                open_issues_count,
                updated_at,
                html_url,
                owner: {avatar_url},
              }) => (
                <tr key={id}>
                  <td>
                    <img width="70" src={avatar_url} alt={name} />
                    <a href={html_url}>{name}</a>
                  </td>
                  <td>
                    <a href="localhost:3000/test">{stargazers_count}</a>
                  </td>
                  <td>
                    <a href="localhost:3000/test">{forks_count}</a>
                  </td>
                  <td>
                    <a href="localhost:3000/test">{open_issues_count}</a>
                  </td>
                  <td>
                    <a href="localhost:3000/test">{updated_at}</a>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
        <TablePagination
          rowsPerPageOptions={[30, 50, 100]}
          component="div"
          count={1}
          rowsPerPage={30}
          page={0}
          onChangePage={() => {}}
          onChangeRowsPerPage={() => {}}
        />
      </>
    )
  }

  if (isSearchApplied && reposList.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={400}
      >
        <Typography>
          Your search has no results 
        </Typography>
      </Box>
    )
  }

  if (isSearchApplied && reposList.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={400}
      >
        <Typography>
          Your search has no results 
        </Typography>
      </Box>
    )
  }

  return (
    <Typography>
      Please provide a search option and click in the search button
    </Typography>
  )
}

export default Content

Content.propTypes = {
  isSearchApplied: PropTypes.bool.isRequired,
  reposList: PropTypes.arrayOf(PropTypes.object).isRequired
}
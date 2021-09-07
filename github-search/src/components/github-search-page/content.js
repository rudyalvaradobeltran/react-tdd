import React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  Box,
  TablePagination
} from '@material-ui/core'

const tableHeaders = ['Repository', 'Stars', 'Forks', 'Open Issues', 'Updated At']

const Content = ({ isSearchApplied }) => isSearchApplied ? (
  <>
    <table>
      <thead>
        <tr>
          {tableHeaders.map((header, index) => <th key={index}>{header}</th>)}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
          <img src="" alt="test" />
            <a href="localhost:3000/test">Test</a>
          </td>
          <td><a href="localhost:3000/test">5</a></td>
          <td><a href="localhost:3000/test">10</a></td>
          <td><a href="localhost:3000/test">100</a></td>
          <td><a href="localhost:3000/test">10-10-2021</a></td>
        </tr>
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
) : (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    height={400}
  >
    <Typography>
      Please provide a search option and click in the search button  
    </Typography>
  </Box>
)

export default Content

Content.propTypes = {
  isSearchApplied: PropTypes.bool.isRequired
}
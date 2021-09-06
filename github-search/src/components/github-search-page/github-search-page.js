import React, { useState } from 'react'
import {
  TextField,
  Typography,
  Button,
  Container,
  Grid,
  Box
} from '@material-ui/core'

const GithubSearchPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchApplied, setIsSearchApplied] = useState();

  const handleClick = async () => {
    setIsSearching(true);
    await Promise.resolve();
    setIsSearchApplied(true);
    setIsSearching(false);
  }

  const renderContent = () => isSearchApplied ? (
    <table>
      <thead>
        <tr>
          <th>
            Repository
          </th>
          <th>Stars</th>
          <th>Forks</th>
          <th>Open issues</th>
          <th>Updated at</th>
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

  return (
    <Container>
      <Typography
        variant="h3"
        component="h1"
      >
        Github repositories list
      </Typography>
      <Grid container spacing={2} justify="space-between">
        <Grid item md={6} xs={12}>
          <TextField
            id="filterBy"
            label="Filter by"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            disabled={isSearching}
            onClick={handleClick}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      { renderContent() }
    </Container>
  )
}

export default GithubSearchPage

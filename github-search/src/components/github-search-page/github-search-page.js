import React, { useState } from 'react'
import {
  TextField,
  Typography,
  Button,
  Container,
  Grid
} from '@material-ui/core'
import Content from './content'

const GithubSearchPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchApplied, setIsSearchApplied] = useState(false);

  const handleClick = async () => {
    setIsSearching(true);
    await Promise.resolve();
    setIsSearchApplied(true);
    setIsSearching(false);
  }

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

      <Content isSearchApplied={isSearchApplied} />
    </Container>
  )
}

export default GithubSearchPage

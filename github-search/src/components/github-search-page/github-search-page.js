import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  TextField,
  Typography,
  Button,
  Container,
  Grid
} from '@material-ui/core'
import Content from './content'
import { getRepos } from '../../services'

const GithubSearchPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchApplied, setIsSearchApplied] = useState(false);
  const [reposList, setReposList] = useState([]);
  const [searchBy, setSearchBy] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(30);

  const didMount = useRef(false);

  const handleSearch = useCallback(async () => {
    setIsSearching(true);
    const response = await getRepos({ q: searchBy, rowsPerPage });
    const data = await response.json();
    setReposList(data.items);
    setIsSearchApplied(true);
    setIsSearching(false);
  }, [rowsPerPage, searchBy])

  const handleChange = ({ target: { value }}) => setSearchBy(value);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    handleSearch();
  }, [handleSearch])

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
            value={searchBy}
            label="Filter by"
            onChange={handleChange}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            disabled={isSearching}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      <Content
        isSearchApplied={isSearchApplied}
        reposList={reposList}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />
    </Container>
  )
}

export default GithubSearchPage

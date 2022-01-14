import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  TextField,
  Typography,
  Button,
  Container,
  Grid,
  Snackbar
} from '@material-ui/core';
import Content from '../content';
import { getRepos } from '../../services';

const GithubSearchPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchApplied, setIsSearchApplied] = useState(false);
  const [reposList, setReposList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const didMount = useRef(false);
  const searchByInput = useRef(null);

  const handleSearch = useCallback(async () => {
    try {
      setIsSearching(true);
      const response = await getRepos({
        q: searchByInput.current.value,
        rowsPerPage,
        currentPage
      });
      if (!response.ok) {
        throw response;
      }
      const data = await response.json();
      setReposList(data.items);
      setTotalCount(data.total_count);
      setIsSearchApplied(true);
      setIsSearching(false);
    } catch (error) {
      const data = await error.json();
      setIsOpen(true);
      setErrorMessage(data.message);
    } finally {
      setIsSearching(false);
    }
  }, [rowsPerPage, currentPage]);

  const handleChangePage = (e, newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    handleSearch();
  }, [handleSearch]);

  return (
    <Container>
      <Typography variant="h3" component="h1">
        Github repositories list
      </Typography>
      <Grid container spacing={2} justify="space-between">
        <Grid item md={6} xs={12}>
          <TextField
            inputRef={searchByInput}
            fullwidth="true"
            label="Filter by"
            id="filterBy"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <Button
            fullwidth="true"
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
        handleChangePage={handleChangePage}
        totalCount={totalCount}
      />
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        open={isOpen}
        autoHideDuration={6000}
        onClose={() => setIsOpen(false)}
        message={errorMessage}
      />
    </Container>
  );
};

export default GithubSearchPage;

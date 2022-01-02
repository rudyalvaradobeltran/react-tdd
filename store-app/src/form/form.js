import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { saveProduct } from '../services/productServices';
import {
  CREATED_STATUS,
  ERROR_SERVER_STATUS,
  INVALID_REQUEST_STATUS
} from '../consts/httpStatus';

export const Form = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState({
    name: '',
    size: '',
    type: ''
  });

  const handleFetchErrors = async (error) => {
    if (error.status === ERROR_SERVER_STATUS) {
      setErrorMessage('Unexpected error, please try again');
      return;
    }
    if (error.status === INVALID_REQUEST_STATUS) {
      const data = await error.json();
      setErrorMessage(data.message);
      return;
    }
    setErrorMessage('Connection error, please try later');
  };

  const validateField = (name, value) => {
    setFormErrors((prevState) => ({...prevState, [name]: value.length ? '' : `The ${name} is required`}));
  }

  const validateForm = (name, size, type) => {
    validateField('name', name);
    validateField('size', size);
    validateField('type', type);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsSaving(true);
    const { name, size, type } = e.target.elements;
    validateForm(name.value, size.value, type.value);
    try{
      const response = await saveProduct({name: name.value, size: size.value, type: type.value});
      if (!response.ok) {
        throw response;
      }
      if (response.status === CREATED_STATUS) {
        e.target.reset();
        setIsSuccess(true);
      }
    }catch(error) {
      handleFetchErrors(error);
    }
    setIsSaving(false);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  return(
    <Container>
      <h1>Create product</h1>

      {isSuccess &&
       <p>Product stored</p> 
      }

      <p>{errorMessage}</p>

      <form onSubmit={handleSubmit}>
        <TextField
          label="name"
          name="name"
          id="name"
          onBlur={handleBlur}
          helperText={formErrors.name}
        />
        <TextField
          label="size"
          name="size"
          id="size"
          onBlur={handleBlur}
          helperText={formErrors.size}
        />
        <InputLabel htmlFor="type">Type</InputLabel>
        <Select
          native
          inputProps={{
            name: 'type',
            id: 'type',
          }}
        >
          <option aria-label="None" value="" />
          <option value="Electronic">Electronic</option>
          <option value="Furniture">Furniture</option>
          <option value="Clothing">Clothing</option>
        </Select>
        {formErrors.type.length &&
          <p>{formErrors.type}</p>
        }
        <Button disabled={isSaving} type="submit">Submit</Button>
      </form> 
    </Container>
  )
};

export default Form

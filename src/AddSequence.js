import React, {Component} from 'react';
import './App.css';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormGroup from "@material-ui/core/FormGroup";
import Button from "@material-ui/core/Button";
import {FormHelperText} from "@material-ui/core";

class AddSequence extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        name: {
          value: '',
          error: false,
          errorMessage: ''
        },
        description: {
          value: '',
          error: false,
          errorMessage: ''
        },
        sequence: {
          value: '',
          error: false,
          errorMessage: ''
        }
      },
      isDataValid: false
    }
  }

  handleChange = (event) => {
    const id = event.target.id;
    const value = event.target.value;

    // Value update
    this.setState((prevState) => {
      let data = {...prevState.data};
      data[id].value = value
      return {data};
    }, () => this.updateInputValidation(id, value));
  };

  updateInputValidation = (id, value) => {
    if (id === 'name') {
      this.nameValidation(value);
    } else if (id === 'description') {
      this.descriptionValidation(value);
    } else if (id === 'sequence') {
      this.sequenceValidation(value);
    }
  }

  nameValidation = (name) => {
    let error = false;
    let errorMessage = '';

    if (name === '') {
      error = true;
      errorMessage = 'Sequence name cannot be empty.';
    }

    this.setState((prevState) => {
      let data = {...prevState.data};
      data.name.error = error;
      data.name.errorMessage = errorMessage;
      return {data};
    }, this.updateIsDataValid);
  }

  descriptionValidation = (description) => {
    let error = false;
    let errorMessage = '';

    if (description === '') {
      error = true;
      errorMessage = 'Sequence description cannot be empty.';
    }

    this.setState((prevState) => {
      let data = {...prevState.data};
      data.description.error = error;
      data.description.errorMessage = errorMessage;
      return {data};
    }, this.updateIsDataValid);
  }

  sequenceValidation = (sequence) => {
    let error = false;
    let errorMessage = '';
    let re = new RegExp('^[ACGT]*$');

    if (sequence === '') {
      error = true;
      errorMessage = 'DNA sequence cannot be empty.';
    } else if (!re.test(sequence)) {
      error = true;
      errorMessage = 'DNA sequence may only contain valid characters (A, C, G, T)';
    }

    this.setState((prevState) => {
      let data = {...prevState.data};
      data.sequence.error = error;
      data.sequence.errorMessage = errorMessage;
      return {data};
    }, this.updateIsDataValid);
  };

  getFormData = () => ({
    name: this.state.data.name.value,
    description: this.state.data.description.value,
    sequence: this.state.data.sequence.value
  });

  updateIsDataValid = () => {
    let isDataValid = false;

    // Including empty checks for initial state
    if (this.state.data.name.value !== '' && !this.state.data.name.error
      && this.state.data.description.value !== '' && !this.state.data.description.error
      && this.state.data.sequence.value !== '' && !this.state.data.sequence.error) {
      isDataValid = true;
    }

    this.setState({isDataValid});
  };

  handleSubmit = () => {
    fetch('https://dna-sequence-tool-api.herokuapp.com/sequences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.getFormData())
    })
      .then(res => res.json())
      .then(
        () => {
          this.setState({
            isLoaded: true
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    return <FormGroup>
      <FormControl error={this.state.data.name.error}>
        <InputLabel>Sequence Name</InputLabel>
        <Input
          aria-describedby='name-helper-text'
          id='name'
          value={this.state.data.name.value}
          onChange={this.handleChange}
        />
        <FormHelperText id='name-helper-text'>{this.state.data.name.errorMessage}</FormHelperText>
      </FormControl>
      <FormControl error={this.state.data.description.error}>
        <InputLabel>Sequence Description</InputLabel>
        <Input
          aria-describedby='description-helper-text'
          id='description'
          value={this.state.data.description.value}
          onChange={this.handleChange}
        />
        <FormHelperText id='description-helper-text'>{this.state.data.description.errorMessage}</FormHelperText>
      </FormControl>
      <FormControl error={this.state.data.sequence.error}>
        <InputLabel>DNA Sequence</InputLabel>
        <Input
          aria-describedby='sequence-helper-text'
          id='sequence'
          value={this.state.data.sequence.value}
          onChange={this.handleChange}
        />
        <FormHelperText id='sequence-helper-text'>{this.state.data.sequence.errorMessage}</FormHelperText>
      </FormControl>
      <Button
        color='primary'
        disabled={!this.state.isDataValid}
        onClick={this.handleSubmit}
        type='submit'
        variant='contained'
      >
        Submit
      </Button>
    </FormGroup>
  }
}

export default AddSequence;

import React, {Component} from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormGroup from "@material-ui/core/FormGroup";
import Button from "@material-ui/core/Button";
import {FormHelperText} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import LinearProgress from "@material-ui/core/LinearProgress";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
  button: {
    margin: 5
  },
  formControl: {
    margin: 5
  },
  linearProgress: {
    margin: 5
  }
});

class AddSequence extends Component {
  constructor(props) {
    super(props);
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
      isDataValid: false,
      isLoading: false,
      successMessage: '',
      errorMessage: ''
    };
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
    this.setState({
      isLoading: true,
      successMessage: '',
      errorMessage: ''
    }, () => fetch('https://dna-sequence-tool-api.herokuapp.com/sequences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.getFormData())
    })
      .then(res => res.json())
      .then(
        (result) => {
          if (result.name) {
            this.setState({
              isLoading: false,
              successMessage: `${result.name} submitted successfully.`
            }, () => {
              console.log(this.state)
            });
          } else {
            this.setState({
              isLoading: false,
              errorMessage: result.errorMessage
            });
          }
        },
        () => {
          this.setState({
            isLoaded: false,
          });
        }
      ))
  }

  render() {
    const classes = this.props.classes;

    return (<FormGroup>
      {this.state.successMessage && <Alert severity="success">{this.state.successMessage}</Alert>}
      {this.state.errorMessage && <Alert severity="error">{this.state.errorMessage}</Alert>}
      <FormControl className={classes.formControl} error={this.state.data.name.error}>
        <InputLabel>Sequence Name</InputLabel>
        <Input
          aria-describedby='name-helper-text'
          id='name'
          multiline
          onChange={this.handleChange}
          value={this.state.data.name.value}
        />
        <FormHelperText id='name-helper-text'>{this.state.data.name.errorMessage}</FormHelperText>
      </FormControl>
      <FormControl className={classes.formControl} error={this.state.data.description.error}>
        <InputLabel>Sequence Description</InputLabel>
        <Input
          aria-describedby='description-helper-text'
          id='description'
          multiline
          onChange={this.handleChange}
          value={this.state.data.description.value}
        />
        <FormHelperText id='description-helper-text'>{this.state.data.description.errorMessage}</FormHelperText>
      </FormControl>
      <FormControl className={classes.formControl} error={this.state.data.sequence.error}>
        <InputLabel>DNA Sequence</InputLabel>
        <Input
          aria-describedby='sequence-helper-text'
          id='sequence'
          multiline
          onChange={this.handleChange}
          value={this.state.data.sequence.value}
        />
        <FormHelperText id='sequence-helper-text'>{this.state.data.sequence.errorMessage}</FormHelperText>
      </FormControl>
      <Button
        className={classes.button}
        color='primary'
        disabled={!this.state.isDataValid || this.state.isLoading}
        onClick={this.handleSubmit}
        type='submit'
        variant='contained'
      >
        Submit
      </Button>
      {this.state.isLoading && <LinearProgress className={classes.linearProgress}/>}
    </FormGroup>);
  }
}

AddSequence.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddSequence);
import React, {Component} from 'react';
import './App.css';
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";

const truncatedSequenceSize = 40;

const styles = theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  dialogContentText: {
    wordBreak: 'break-word'
  },
  table: {
    minWidth: 650,
  }
});

class Sequences extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idToSequence: {},
      isLoading: true,
      rows: [],
      modal: {
        isOpen: false,
        name: '',
        sequence: ''
      }
    };
  }

  componentDidMount() {
    fetch("https://dna-sequence-tool-api.herokuapp.com/sequences")
      .then(res => res.json())
      .then(
        (sequences) => {
          const rows = [...sequences];
          rows.map((row) => {
            if (row.sequence.length > truncatedSequenceSize) {
              row.preview = row.sequence.substring(0, truncatedSequenceSize) + '...';
            } else {
              row.preview = row.sequence;
            }

            return row;
          });

          const idToSequence = sequences.reduce((map, sequence) => {
            map[sequence.id] = sequence;
            return map;
          }, {});

          this.setState({
            idToSequence: idToSequence,
            isLoading: false,
            rows: rows,
          }, () => {
            console.log(this.state)
          });
        },
        () => {
          this.setState({
            isLoading: false,
          });
        }
      )
  }

  openModal = (event, id) => {
    this.setState((prevState) => ({
      modal: {
        isOpen: true,
        name: prevState.idToSequence[id].name,
        sequence: prevState.idToSequence[id].sequence
      }
    }));
  }

  closeModal = () => {
    this.setState((prevState) => ({
      modal: {
        isOpen: false,
        name: '',
        sequence: ''
      }
    }));
  }

  /**
   * Colors based on http://biomodel.uah.es/en/model4/dna/atgc.htm
   * @param sequence
   * @returns a list of one character, colored spans
   */
  colorSequence = (sequence) => (
    sequence.split('').map((char, index) => {
      if (char === 'A') {
        return (<span key={index} style={{color: '#5050ff'}}>{char}</span>);
      } else if (char === 'C') {
        return (<span key={index} style={{color: '#e00000'}}>{char}</span>);
      } else if (char === 'G') {
        return (<span key={index} style={{color: '#00c000'}}>{char}</span>);
      } else if (char === 'T') {
        return (<span key={index} style={{color: '#e6e600'}}>{char}</span>);
      }
    })
  );

  render() {
    const classes = this.props.classes;

    return (
      <div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="sequence table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Sequence</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.rows.map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  onClick={(event) => this.openModal(event, row.id)}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.preview}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          open={this.state.modal.isOpen}
          onClose={this.closeModal}
          scroll='paper'
          aria-labelledby="sequence-dialog-title"
          aria-describedby="sequence-dialog-description"
        >
          <DialogTitle id="sequence-dialog-title">{this.state.modal.name}</DialogTitle>
          <DialogContent dividers>
            <DialogContentText
              className={classes.dialogContentText}
              id="sequence-dialog-description"
            >
              {this.colorSequence(this.state.modal.sequence)}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>);
  }
}

Sequences.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Sequences);

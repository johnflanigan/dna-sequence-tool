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
import Modal from "@material-ui/core/Modal";

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
  paragraph: {
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
            if (row.sequence.length > 8) {
              row.preview = row.sequence.substring(0, 8) + '...';
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

  render() {
    const classes = this.props.classes;

    return (
      <div>
        <Modal
          aria-labelledby="sequence-modal-name"
          aria-describedby="sequence-modal-sequence"
          className={classes.modal}
          open={this.state.modal.isOpen}
          onClose={this.closeModal}
        >
          <div className={classes.paper}>
            <h2 id="sequence-modal-name">{this.state.modal.name}</h2>
            <p id="sequence-modal-sequence" className={classes.paragraph}>{this.state.modal.sequence}</p>
          </div>
        </Modal>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
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
      </div>);
  }
}

Sequences.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Sequences);

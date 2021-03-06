import React, {Component} from 'react';
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
import TableSortLabel from "@material-ui/core/TableSortLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import LinearProgress from "@material-ui/core/LinearProgress";

const truncatedSequenceSize = 40;

const styles = theme => ({
  dialog: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formControl: {
    margin: 5
  },
  linearProgress: {
    margin: 5
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
    tableLayout: 'fixed',
    wordBreak: 'break-word'
  },
  tableContainer: {
    margin: 5
  }
});

class Sequences extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idToSequence: {},
      isLoading: true,
      rows: [],
      dialog: {
        isOpen: false,
        name: '',
        sequence: ''
      },
      direction: 'asc',
      filter: ''
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
          });
        },
        () => {
          this.setState({
            isLoading: false,
          });
        }
      )
  }

  openDialog = (event, id) => {
    this.setState((prevState) => ({
      dialog: {
        isOpen: true,
        name: prevState.idToSequence[id].name,
        sequence: prevState.idToSequence[id].sequence
      }
    }));
  }

  closeDialog = () => {
    this.setState((prevState) => ({
      dialog: {
        isOpen: false,
        name: '',
        sequence: ''
      }
    }));
  }

  filterHandler = (event) => {
    this.setState({
      filter: event.target.value
    });
  }

  sortHandler = () => {
    this.setState((prevState) => {
      if (prevState.direction === 'desc') {
        return {direction: 'asc'};
      } else {
        return {direction: 'desc'};
      }
    });
  }

  /**
   * Colors based on https://www.biostars.org/p/171056/
   * @param sequence
   * @returns a list of one character, colored spans
   */
  colorSequence = (sequence) => (
    sequence.split('').map((char, index) => {
      if (char === 'A') {
        return (<span key={index} style={{color: '#b3321c'}}>{char}</span>);
      } else if (char === 'C') {
        return (<span key={index} style={{color: '#0a30b8'}}>{char}</span>);
      } else if (char === 'G') {
        return (<span key={index} style={{color: '#bdaf3b'}}>{char}</span>);
      } else if (char === 'T') {
        return (<span key={index} style={{color: '#54b83c'}}>{char}</span>);
      }
    })
  );

  ascendingNameComparator = (a, b) => {
    const lowerCaseNameA = a.name.toLowerCase();
    const lowerCaseNameB = b.name.toLowerCase();

    const result = lowerCaseNameA.localeCompare(lowerCaseNameB);

    // Break ties by considering case
    if (result === 0) {
      return a.name.localeCompare(b.name);
    } else {
      return result;
    }
  }

  getSortedAndFilteredRows = () => {
    // Perform in-place sorting
    if (this.state.direction === 'asc') {
      this.state.rows.sort(this.ascendingNameComparator);
    } else {
      this.state.rows.sort(this.ascendingNameComparator).reverse();
    }

    if (this.state.filter === '') {
      return this.state.rows;
    } else {
      return this.state.rows.filter((row) => row.name.toLowerCase().includes(this.state.filter.toLowerCase()));
    }
  }

  render() {
    const classes = this.props.classes;

    return (
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel>Search filter</InputLabel>
          <Input
            id='filter'
            onChange={this.filterHandler}
            value={this.state.filter}
          />
        </FormControl>
        <TableContainer className={classes.tableContainer} component={Paper}>
          <Table className={classes.table} aria-label="sequence table">
            <colgroup>
              <col style={{width: '25%'}}/>
              <col style={{width: '25%'}}/>
              <col style={{width: '50%'}}/>
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={true}
                    direction={this.state.direction}
                    onClick={this.sortHandler}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Sequence</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.getSortedAndFilteredRows().map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  onClick={(event) => this.openDialog(event, row.id)}
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
        {this.state.isLoading && <LinearProgress className={classes.linearProgress}/>}
        <Dialog
          open={this.state.dialog.isOpen}
          onClose={this.closeDialog}
          scroll='paper'
          aria-labelledby="sequence-dialog-title"
          aria-describedby="sequence-dialog-description"
        >
          <DialogTitle id="sequence-dialog-title">{this.state.dialog.name}</DialogTitle>
          <DialogContent dividers>
            <DialogContentText
              className={classes.dialogContentText}
              id="sequence-dialog-description"
            >
              {this.colorSequence(this.state.dialog.sequence)}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color='primary'
              onClick={this.closeDialog}
              variant='contained'
            >
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

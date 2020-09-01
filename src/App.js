import React, {Component} from 'react';
import Typography from "@material-ui/core/Typography";
import Drawer from '@material-ui/core/Drawer';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import AddIcon from '@material-ui/icons/Add';
import TableChartIcon from '@material-ui/icons/TableChart';
import AddSequence from "./AddSequence";
import Sequences from "./Sequences";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from 'prop-types';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
});

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addSequence: true,
      sequences: false,
    }
  }

  clickAddSequence = () => {
    this.setState(() => ({
      addSequence: true,
      sequences: false,
    }));
  };

  clickSequences = () => {
    this.setState(() => ({
      addSequence: false,
      sequences: true,
    }));
  };

  render() {
    const classes = this.props.classes;

    return (
      <div className={classes.root}>
        <CssBaseline/>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              DNA Sequence Tool
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <div className={classes.toolbar}/>
          <Divider/>
          <List>
            <ListItem
              button
              key='Add DNA Sequence'
              onClick={this.clickAddSequence}
              selected={this.state.addSequence}
            >
              <ListItemIcon><AddIcon/></ListItemIcon>
              <ListItemText primary='Add DNA Sequence'/>
            </ListItem>
            <ListItem
              button
              key='Sequences'
              onClick={this.clickSequences}
              selected={this.state.sequences}
            >
              <ListItemIcon><TableChartIcon/></ListItemIcon>
              <ListItemText primary='Sequences'/>
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar}/>
          {this.state.addSequence && <AddSequence/>}
          {this.state.sequences && <Sequences/>}
        </main>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);

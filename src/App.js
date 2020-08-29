import React from 'react';
import './App.css';
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Drawer from '@material-ui/core/Drawer';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import AddIcon from '@material-ui/icons/Add';
import TableChartIcon from '@material-ui/icons/TableChart';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormGroup from "@material-ui/core/FormGroup";
import Button from "@material-ui/core/Button";
import AddSequence from "./AddSequence";


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
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
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function App() {
  const classes = useStyles();

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
          <ListItem button key='Add DNA Sequence'>
            <ListItemIcon><AddIcon/></ListItemIcon>
            <ListItemText primary='Add DNA Sequence'/>
          </ListItem>
          <ListItem button key='Sequences' selected={true}>
            <ListItemIcon><TableChartIcon/></ListItemIcon>
            <ListItemText primary='Sequences'/>
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar}/>
        <AddSequence/>

        {/*<Typography paragraph>*/}
        {/*  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt*/}
        {/*  ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum*/}
        {/*  facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit*/}
        {/*  gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id*/}
        {/*  donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit*/}
        {/*  adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.*/}
        {/*  Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis*/}
        {/*  imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget*/}
        {/*  arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem*/}
        {/*  donec massa sapien faucibus et molestie ac.*/}
        {/*</Typography>*/}
        {/*<Typography paragraph>*/}
        {/*  Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla*/}
        {/*  facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac*/}
        {/*  tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat*/}
        {/*  consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed*/}
        {/*  vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In*/}
        {/*  hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et*/}
        {/*  tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin*/}
        {/*  nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas*/}
        {/*  accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.*/}
        {/*</Typography>*/}
      </main>
    </div>
  );
}

export default App;

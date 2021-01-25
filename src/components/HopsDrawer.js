import React, { useState } from "react";
import { Rout, Link, Route } from "react-router-dom";
import clsx from "clsx";
import { ThemeProvider } from "@material-ui/core";
import { makeStyles, useTheme, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import Switch from "@material-ui/core/Switch";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import TableChartIcon from "@material-ui/icons/TableChart";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import BeerTable from "./BeerTable.js";
import BreweryTable from "./BreweryTable.js";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbarDark: {
    backgroundColor: "#232323"
  },
  toolbarLight: {
    color: theme.palette.text.primary,
    backgroundColor: "#fafafa"
  },
  title: {
    flexGrow: 1
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
}));

const HopsDrawer = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [themeMode, setThemeMode] = useState(true);

  const icon = !themeMode ? <Brightness7Icon /> : <Brightness3Icon />;
  const light = {
    palette: {
      type: "light",
      primary: {
        dark: "#00695f",
        main: "#009688",
        light: "#33ab9f"
      },
      secondary: {
        light: "#4aedc4",
        dark: "#14a37f",
        main: "#1de9b6"
      }
    }
  };
  const dark = {
    palette: {
      type: "dark",
      primary: {
        dark: "#00695f",
        main: "#009688",
        light: "#33ab9f"
      },
      secondary: {
        light: "#4aedc4",
        dark: "#14a37f",
        main: "#1de9b6"
      }
    }
  };
  const appliedTheme = createMuiTheme(themeMode ? light : dark);
  const toolbarColor = !themeMode ? classes.toolbarDark : classes.toolbarLight;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <ThemeProvider theme={appliedTheme}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open
          })}
        >
          <Toolbar variant="dense" className={toolbarColor}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Hops Api
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="mode"
              onClick={() => setThemeMode(!themeMode)}
            >
              {icon}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List>
            {["Beers", "Breweries"].map((text, index) => (
              <ListItem button key={text} component={Link} to={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open
          })}
        >
          <div className={classes.drawerHeader} />
          <Route exact={true} path="/" render={() => <span>Details</span>} />
          <Route path="/Beers" component={BeerTable} />
          <Route path="/Breweries" component={BreweryTable} />
        </main>
      </ThemeProvider>
    </div>
  );
};

export default HopsDrawer;

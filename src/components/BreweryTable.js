import React, { useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Drawer from "@material-ui/core/Drawer";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name"
  },
  {
    id: "address",
    numeric: false,
    disablePadding: false,
    label: "Address"
  },
  { id: "phone", numeric: false, disablePadding: false, label: "Phone" }
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all breweries" }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.text.primary,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: "1 1 100%"
  }
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const {
    numSelected,
    toggleBreweryDrawer,
    selected,
    getBreweries,
    clearSelected
  } = props;

  const deleteBrewery = () => {
    selected.map(id => {
      let url = `http://localhost:8080/api/breweries/${id}`;
      return fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log("Success:", data);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    });
    getBreweries();
    clearSelected();
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Breweries
        </Typography>
      )}

      {numSelected > 0 ? (
        <IconButton title="Delete" aria-label="delete" onClick={deleteBrewery}>
          <DeleteIcon />
        </IconButton>
      ) : (
        <IconButton
          title="Add Brewery"
          aria-label="Add Brewery"
          onClick={toggleBreweryDrawer("Add", true, null)}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  toggleBreweryDrawer: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.string),
  getBreweries: PropTypes.func.isRequired,
  clearSelected: PropTypes.func.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));

const BreweryTable = () => {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  const [isBreweryDrawerOpen, setIsBreweryDrawerOpen] = React.useState(false);
  const [addUpdateButton, setAddUpdateButton] = React.useState("Add");
  const [currentRowId, setCurrentRowId] = React.useState(null);
  const [breweryDrawer, setBreweryDrawer] = React.useState({
    name: "",
    image: "",
    address: "",
    phone: ""
  });

  useEffect(() => {
    getBreweries();
  }, []);

  const toggleBreweryDrawer = (type, open, id) => event => {
    setIsBreweryDrawerOpen(open);
    if (type === "Add") {
      setAddUpdateButton("Add");
      setBreweryDrawer({
        name: "",
        image: "",
        address: "",
        phone: ""
      });
    } else if (type === "Edit") {
      setCurrentRowId(id);
      setAddUpdateButton("Update");
      rows
        .filter(x => x.id === id)
        .map(item => {
          setBreweryDrawer({
            name: item.name,
            image: item.image,
            address: item.address,
            phone: item.phone
          });
        });
    } else {
      setBreweryDrawer({
        name: "",
        image: "",
        address: "",
        phone: ""
      });
    }
  };

  const getBreweries = () => {
    axios
      .get("http://localhost:8080/api/breweries")
      .then(function(response) {
        setRows(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const clearSelected = () => {
    setSelected([]);
  };

  const addUpdateBrewery = obj => {
    let url =
      currentRowId === null
        ? "http://localhost:8080/api/breweries"
        : `http://localhost:8080/api/breweries/${currentRowId}`;
    let method = currentRowId === null ? "POST" : "PUT";
    return fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(obj)
    })
      .then(response => response.json())
      .then(data => {
        getBreweries();
        setIsBreweryDrawerOpen(false);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = event => {
    setDense(event.target.checked);
  };

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          toggleBreweryDrawer={toggleBreweryDrawer}
          selected={selected}
          getBreweries={getBreweries}
          clearSelected={clearSelected}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${row.id}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell
                        padding="checkbox"
                        style={{ maxWidth: 60, minWidth: 60 }}
                      >
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                          onClick={event => handleClick(event, row.id)}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell style={{ maxWidth: 300, minWidth: 100 }}>
                        {row.address}
                      </TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell
                        style={{
                          maxWidth: 80,
                          minWidth: 80,
                          textAlign: "right"
                        }}
                      >
                        <IconButton
                          title="Edit"
                          aria-label="edit"
                          onClick={toggleBreweryDrawer("Edit", true, row.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
      <Drawer
        anchor={"bottom"}
        open={isBreweryDrawerOpen}
        onClose={toggleBreweryDrawer(null, false, null)}
      >
        <Container fixed style={{ flex: 1, padding: 20 }}>
          <Grid container spacing={3}>
            <Grid container item xs={12} spacing={3}>
              <TextField
                required
                id="name"
                label="Name"
                value={breweryDrawer.name}
                style={{ width: "100%", marginBottom: 10 }}
                onChange={e =>
                  setBreweryDrawer({ ...breweryDrawer, name: e.target.value })
                }
              />
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <TextField
                id="image"
                label="Image"
                value={breweryDrawer.image}
                style={{ width: "100%", marginBottom: 10 }}
                onChange={e =>
                  setBreweryDrawer({ ...breweryDrawer, image: e.target.value })
                }
              />
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <TextField
                id="address"
                label="Address"
                value={breweryDrawer.address}
                style={{ width: "100%", marginBottom: 10 }}
                onChange={e =>
                  setBreweryDrawer({
                    ...breweryDrawer,
                    address: e.target.value
                  })
                }
              />
            </Grid>
            <Grid container item xs={12} spacing={3}>
              <TextField
                id="phone"
                label="Phone"
                value={breweryDrawer.phone}
                style={{ width: "100%", marginBottom: 10 }}
                onChange={e =>
                  setBreweryDrawer({
                    ...breweryDrawer,
                    phone: e.target.value
                  })
                }
              />
            </Grid>
            <Grid
              container
              item
              xs={12}
              spacing={3}
              style={{ marginTop: 10, marginBottom: 10 }}
            >
              <Button
                variant="contained"
                color="secondary"
                style={{ marginRight: 10 }}
                onClick={() => {
                  const obj = {
                    name: breweryDrawer.name,
                    image: breweryDrawer.image,
                    address: breweryDrawer.address,
                    phone: breweryDrawer.phone
                  };
                  addUpdateBrewery(obj);
                }}
              >
                {addUpdateButton} Brewery
              </Button>
              <Button
                variant="contained"
                onClick={toggleBreweryDrawer(null, false, null)}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Drawer>
    </div>
  );
};

export default BreweryTable;

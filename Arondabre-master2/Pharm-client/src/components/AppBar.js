import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

// Material-UI
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { logoutAction } from "../redux/actions/authActions";

const useStyles = makeStyles(() => ({
  appBar: {
    backgroundColor: "#3783bdff",
    marginBottom: 0,
  },
  title: {
    flex: 1,
    marginLeft: 30,
    marginBottom: 10,
    marginTop: 10,
    color: "black",
    textDecoration: "none",
  },
  buttonStyles: {
    color: "black",
    margin: "0 6px 0",
    display: "inline-block",
  },
  buttons: {
    marginRight: 40,
  },
  name: {
    fontWeight: "bold",
    fontSize: 30,
  },
}));

export default function AppBarPrimary() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const auth = useSelector((state) => state.auth);
  const {
    account = {},           // fallback to avoid undefined
    authenticated,
    firstName = "",
    lastName = "",
    address = null,
  } = auth;

  const role = account.role || null;

  const handleLogout = () => {
    dispatch(logoutAction(history));
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Link to="/" className={classes.title}>
          <Typography variant="h6" noWrap>
            <Button className={classes.name} variant="outlined">
              MEDISPHERE
            </Button>
          </Typography>
        </Link>

        {authenticated ? (
          role === "ROLE_SELLER" ? (
            <div className={classes.buttons}>
              <Typography className={classes.buttonStyles}>
                Seller Dashboard
              </Typography>
              <Link to="/seller/orders">
                <Button className={classes.buttonStyles}>Orders</Button>
              </Link>
              <Button
                onClick={handleLogout}
                className={classes.buttonStyles}
                variant="outlined"
              >
                Logout
              </Button>
            </div>
          ) : role === "ROLE_DOCTOR" ? (
            <div className={classes.buttons}>
              <Typography className={classes.buttonStyles}>
                Doctor Dashboard
              </Typography>
              <Link to="/doctor/appointment">
                <Button className={classes.buttonStyles}>Appointments</Button>
              </Link>
              <Link to="/doctor/patients">
                <Button className={classes.buttonStyles}>Patients</Button>
              </Link>
              <Button
                onClick={handleLogout}
                className={classes.buttonStyles}
                variant="outlined"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className={classes.buttons}>
              <Typography className={classes.buttonStyles}>
                WELCOME 👤 {firstName} {lastName}
              </Typography>
              <Link to="/orders">
                <Button className={classes.buttonStyles}>Orders</Button>
              </Link>
              <Link to={{ pathname: "/cart", state: { address: address } }}>
                <Button className={classes.buttonStyles}>Cart</Button>
              </Link>
              <Button
                onClick={handleLogout}
                className={classes.buttonStyles}
                variant="outlined"
              >
                Logout
              </Button>
            </div>
          )
        ) : (
          <div className={classes.buttons}>
            <Link to="/login">
              <Button className={classes.buttonStyles} variant="outlined">
                LOGIN
              </Button>
            </Link>
            <Link to="/register">
              <Button className={classes.buttonStyles} variant="outlined">
                REGISTER
              </Button>
            </Link>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

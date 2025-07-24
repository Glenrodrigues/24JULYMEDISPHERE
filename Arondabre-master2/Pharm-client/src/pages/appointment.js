import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import openSocket from "socket.io-client";

import { getOrders, socketStatusUpdate } from "../redux/actions/dataActions";
import OrderCard from "../components/OrderCard";

// Material-UI
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    backgroundColor: "#f4f7f8",
    minHeight: "90vh",
  },
  title: {
    fontWeight: "bold",
    fontSize: "1.8rem",
    marginBottom: theme.spacing(3),
    color: "#2e7d32",
    marginLeft: theme.spacing(4),
  },
  noOrdersText: {
    fontSize: "1.2rem",
    textAlign: "center",
    marginTop: theme.spacing(8),
    color: "#555",
  },
}));

const Appointments = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { orders, loading } = useSelector((state) => state.data);
  const {
    account: { role },
    _id,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getOrders());

    const socket = openSocket(process.env.REACT_APP_SERVER_URL);
    socket.emit("add-user", { userId: _id });

    socket.on("orders", (data) => {
      if (data.action === "update") {
        dispatch(socketStatusUpdate(data.order));
      }
      if (data.action === "create") {
        dispatch(getOrders());
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, _id]);

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Appointment History
      </Typography>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <CircularProgress color="primary" />
        </div>
      ) : orders && orders.length > 0 ? (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order._id}>
              <OrderCard order={order} role={role} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography className={classes.noOrdersText}>
          You have no appointments yet.
        </Typography>
      )}
    </div>
  );
};

export default Appointments;

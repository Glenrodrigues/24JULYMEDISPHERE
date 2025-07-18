import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

//material-ui
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import HomeStart from "../components/HomeStart";
import SearchBar from "../components/SearchBar";
import Spinner from "../util/spinner/spinner";
import PharmacyContent from "../components/PharmacyContent";



const useStyles = makeStyles(() => ({
  center: {
    textAlign: "center",
  },
  SearchBar: {
    margin: "24px 0 28px 360px",
  },
}));

const Home = () => {
  const classes = useStyles();
  const { loading } = useSelector((state) => state.data);
  const {
    account: { role },
    authenticated,
  } = useSelector((state) => state.auth);
  const [locationStatus, setLocationStatus] = useState(
    localStorage.getItem("location") ? true : false
  );

  // let latlng = localStorage.getItem("latlng");

  // if (latlng) {
  //   const latlngArray = latlng.split(", ");
  //   dispatch(fetchPharmacyByAddress(latlngArray[0], latlngArray[1]));
  // }

  let PharmacyMarkup = loading ? <Spinner /> : <PharmacyContent />;
  return (
    <>
      {authenticated && role === "ROLE_SELLER" ? (
        <Redirect to="/seller/dashboard" />
      ) : authenticated && role === "ROLE_DOCTOR" ? (
        <Redirect to="/doctor/dashboard" />
      ):(
        <>
          <HomeStart />
          <Grid container direction="column">
            <Grid item>
              <Typography variant="h5" className={classes.center} noWrap>

                              
                Your Medicine, delivered with MEDISPPHERE&nbsp;&nbsp;
                <span style={{ fontSize: 40 }}>💉⚕️</span>
              </Typography>
            </Grid>
            <Grid item className={classes.SearchBar}>
              <SearchBar page="home" action={setLocationStatus} />
            </Grid>
            <Grid item container>
              <Grid item xs={false} sm={1} />
              <Grid item xs={12} sm={10}>
                {locationStatus ? (
                  PharmacyMarkup
                ) : (
                  <Typography variant="body1" className={classes.center} noWrap>
                    Enter your location to view nearby Pharmacy
                  </Typography>
                )}
              </Grid>
              <Grid item xs={false} sm={1} />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default Home;

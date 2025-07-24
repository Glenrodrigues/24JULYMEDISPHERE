import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";

import { getDoctorList } from "../redux/actions/authActions";
import BackgroundImage from "../images/med1.jpg";

const useStyles = makeStyles((theme) => ({
  backgroundWrapper: {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    minHeight: "55vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4),
  },
  contentBox: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: theme.spacing(4),
    borderRadius: 10,
    width: "90%",
    maxWidth: 1000,
  },
  title: {
    fontSize: 36,
    fontWeight: 600,
    color: "#157a21",
    marginBottom: theme.spacing(2),
    textAlign: "center",
  },
  formControl: {
    minWidth: 200,
    marginBottom: theme.spacing(2),
  },
  searchButton: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  doctorCard: {
    padding: theme.spacing(2),
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  doctorGrid: {
    marginTop: theme.spacing(3),
  },
}));

const DoctorBookingPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  const doctorList = useSelector((state) => state.data.doctorList || []);
  const [searchInitiated, setSearchInitiated] = useState(false);

  const handleSearch = () => {
    if (selectedSpecialist) {
      dispatch(getDoctorList(selectedSpecialist));
      setSearchInitiated(true);
    }
  };

  const handleBookDoctor = (doc) => {
    alert(`Booked appointment with Dr. ${doc.name}`);
  };

  return (
    <div className={classes.backgroundWrapper}>
      <div className={classes.contentBox}>
        <Typography className={classes.title}>Book Your Doctor</Typography>

        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          <FormControl className={classes.formControl}>
            <InputLabel id="specialist-label">Select Specialist</InputLabel>
            <Select
              labelId="specialist-label"
              value={selectedSpecialist}
              onChange={(e) => setSelectedSpecialist(e.target.value)}
            >
              <MenuItem value="dentist">Dentist</MenuItem>
              <MenuItem value="cardio">Cardiologist</MenuItem>
              <MenuItem value="neuro">Neurologist</MenuItem>
              <MenuItem value="derma">Dermatologist</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            className={classes.searchButton}
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>

        <Grid container spacing={3} className={classes.doctorGrid}>
          {doctorList.length > 0 ? (
            doctorList.map((doc) => (
              <Grid item xs={12} sm={6} md={4} key={doc._id}>
                <Paper className={classes.doctorCard}>
                  <Typography variant="h6">Dr. {doc.name}</Typography>
                  <Typography variant="body2">Min Order: ₹{doc.minOrderAmount || 0}</Typography>
                  <Typography variant="body2">Speciality: {doc.tags}</Typography>

                  {/* <Typography variant="body2">Tags: {doc.tags}</Typography> */}
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ marginTop: 10 }}
                    onClick={() => handleBookDoctor(doc)}
                  >
                    Book
                  </Button>
                </Paper>
              </Grid>
            ))
          ) : searchInitiated ? (
            <Grid item xs={12}>
              <Typography>No doctors found for selected specialty.</Typography>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Typography>Select a specialty to search for doctors.</Typography>
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
};

export default DoctorBookingPage;

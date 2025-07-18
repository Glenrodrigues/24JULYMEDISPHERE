import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//redux
import { useDispatch, useSelector } from "react-redux";

//material-ui
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Spinner from "../util/spinner/spinner";
import PharmacyInfo from "../components/Pharmacyinfo";
import PharmacyItems from "../components/Pharmacyitems";
import SearchBar from "../components/SearchBar";


import { fetchPharmacy } from "../redux/actions/dataActions";

const useStyles = makeStyles((theme) => ({
  
  container: {
    backgroundColor: "#e0f2f1",
    marginTop: 80,
    height: "60vh",
    textAlign: "center",
  },
  typography: {
        fontSize: 20,
        fontFamily:['-apple-system']
  },

  typographys: {
    fontSize: 30,
    fontFamily:['Arial']
  },
  innerCont: {
    margin: "90px 50px 50px 50px",
  },
  resources: {
    margin: "60px 40px 10px 40px",
    fontsize:"90",
  },
  buttonStyleOne: {
    color: "white",
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: "#5a5c5a",
    },
  },
  buttonStyleTwo: {
    color: "white",
    backgroundColor: theme.palette.primary.main,
    marginLeft: 'auto',
    marginTop: 60,

    "&:hover": {
      backgroundColor: "#5a5c5a",
    },
  },
}));



export default function Pharmacy(props) {
  const classes = useStyles();
  const restId = props.location.state.restId;
  console.log(props,'pharmacy');
  const { loading } = useSelector((state) => state.data);
  const Pharmacy = useSelector((state) => state.data.Pharmacy);
  const { items } = useSelector((state) => state.data.Pharmacy);
  const dispatch = useDispatch();

  useEffect(() => {
    if (items) {
      setItemsState(items);
      setFilteredItemsState(items);
    }
  }, [items]);

  const [itemsState, setItemsState] = useState(items ? [] : null);
  const [filteredItemsState, setFilteredItemsState] = useState(
    items ? [] : null
  );

  const handleSearch = (value) => {
    // Variable to hold the original version of the list
    let currentList = [];
    // Variable to hold the filtered list before putting into state
    let newList = [];

    // If the search bar isn't empty
    if (value !== "") {
      // Assign the original list to currentList
      currentList = itemsState;

      // Use .filter() to determine which items should be displayed
      // based on the search terms
      newList = currentList.filter((item) => {
        // change current item to lowercase
        const lc = item.title.toLowerCase();
        // change search term to lowercase
        const filter = value.toLowerCase();
        // check to see if the current list item includes the search term
        // If it does, it will be added to newList. Using lowercase eliminates
        // issues with capitalization in search terms and search content
        return lc.includes(filter);
      });
    } else {
      // If the search bar is empty, set newList to original task list
      newList = itemsState;
    }
    // Set the filtered state based on what our rules added to newList
    setFilteredItemsState(newList);
  };

  useEffect(() => {
  
    console.log("in useEffect Pharmacy");
    dispatch(fetchPharmacy(restId));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <PharmacyInfo {...Pharmacy} />

          <Grid container direction="row" className={classes.container}>
            <Grid item xs={12} sm={4} className={classes.innerCont}>
            </Grid>
            <Grid item xs={12} sm={3} className={classes.innerCont}>
              <Typography variant="h4" component="p" style={{marginTop: 30}} className={classes.typographys}>
                Ask Your Pharmacist,
                <br/>
                Not the Internet 
              </Typography>
              <Typography variant="body1" component="p" style={{marginTop: 10}} className={classes.typography} align="center" >
                We have made our system simple as we can ,
                <br/>
                you can take picture of precription and place the Order
              </Typography>
              <Link to="/photo">
                <Button className={classes.buttonStyleTwo}  style={{ width: 300, padding: 15}}>UPLOAD YOUR PRECRIPTION</Button>
              </Link>
            </Grid>
          </Grid>

          <Grid container direction="row" style={{ marginTop: 40 }}>
            <Grid
              item
              xs={12}
              sm={8}
              style={{
                paddingLeft: "520px",
              }}
            >
              <Typography
                gutterBottom
                variant="h5"
                noWrap
                style={{ textAlign: "center" }}
              >
                Have Your Medicine At Your Door Steps&nbsp;&nbsp;
                <span role="img" aria-label="fries" style={{ fontSize: 40 }}>
                  🏥
                </span>
              </Typography>
              <Typography
                variant="body1"
                noWrap
                style={{ textAlign: "center" }}
              >
                Order from wide varieties of different available Items below
              </Typography>
              <br />
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              style={{ marginTop: 20, paddingLeft: 40 }}
            >
              
              <SearchBar page="items" handleSearch={handleSearch} />
            </Grid>
            <PharmacyItems items={filteredItemsState} />
          </Grid>
        </>
      )}
    </>
  );
}

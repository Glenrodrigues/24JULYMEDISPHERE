import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

//material-ui
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#d4d8d8ff",
    marginTop: 0,
    height: "32vh",
    textAlign: "center",
  },
  innerCont: {
    margin: "54px 40px 40px 40px",
  },
  resources: {
    margin: "60px 0px 40px 30px", 
  },
  buttonStyleOne: {
    color: "white",
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: "#0ea7d1ff",
    },
  },
  buttonStyleTwo: {
    color: "white",
    backgroundColor: theme.palette.primary.main,
    marginLeft: 10,
    marginTop: 8,
    "&:hover": {
      backgroundColor: "#0ea7d1ff",
    },
  },
}));

export default function Footer() {
  const { authenticated } = useSelector((state) => state.auth);
  const classes = useStyles();
  return (
    <Grid container direction="row" className={classes.container}>
      <Grid item xs={12} sm={4} className={classes.innerCont}>
        {authenticated ? (
          <>
            <Typography variant="h4" component="p" style={{fontSize: 20, fontWeight: 550,}}>
              MEDISPHERE FOR BUSINESS
            </Typography>
            <Typography variant="body1" component="p" style={{fontSize: 15,}}>
              Get more out of your business, without losing focus on what is
              most important — delighting your customers
            </Typography>
            <br />
            <Link to="/upload" style={{ textDecoration: 'none' }}>
              <Button className={classes.buttonStyleOne} style={{marginTop:'-10px'}} >PHARMACY</Button>
            </Link>

            <Link to="/addDoctor" style={{ textDecoration: 'none' }}>
              <Button className={classes.buttonStyleOne} style={{marginLeft: '30px', marginTop:'-10px'}} > DOCTOR </Button>
            </Link>
            
          </>
        
        ) : (
          <>
            <Typography variant="h4" component="p" style={{fontSize: 20, fontWeight: 550,}}>
              MEDISPHERE FOR BUSINESS
            </Typography>
            <Typography variant="body1" component="p" style={{fontSize: 15,}}>
              Get more out of your business, without losing focus on what is
              most important — delighting your customers
            </Typography>
            <br />
            <Link to="/upload" style={{ textDecoration: 'none' }}>
              <Button className={classes.buttonStyleOne} style={{marginTop:'-10px'}} >PHARMACY</Button>
            </Link>

            <Link to="/addDoctor" style={{ textDecoration: 'none' }}>
              <Button className={classes.buttonStyleOne} style={{marginLeft: '30px', marginTop:'-10px'}} > DOCTOR </Button>
            </Link>
            
          </>
        )}
      </Grid>
      <Grid item xs={12} sm={3} className={classes.innerCont} >
        <Typography variant="h5" component="p" style={{fontSize: 20, fontWeight: 550,}}>
          MEDISPHERE NewsLetter
        </Typography>
        <Typography variant="body1" component="p" style={{ marginBottom: 28,fontSize: 15 }}>
          Stay updated with new offers from MEDISPHERE
        </Typography>
        <TextField label="Your Email address" variant="outlined" />
        <Button className={classes.buttonStyleTwo}>SEND</Button>
      </Grid>
      <Grid item xs={12} sm={3} className={classes.resources}>
        <Typography variant="h5" component="p" style={{fontSize: 20, fontWeight: 550,}}>
          Resources/Stack Used
        </Typography>
        <Typography variant="body1" component="p" style={{ marginBottom: 0, fontweight:50,}}>
          - React Material UI Redux <br />
          - NodeJs <br />
          - Express <br />
          - MongoDB Atlas <br />
        </Typography>
      </Grid>
    </Grid>
  );
}

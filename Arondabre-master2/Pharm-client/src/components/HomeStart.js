import React from "react";

//material-ui
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

//import cover from "../images/med.jpg";
// import cover from "../images/caduceus.png";
import BackgroundImage from '../images/med1.jpg'

const useStyles = makeStyles((theme) => ({
  presentation: {
    display: "flex",
    width: "100%",
    margin: "auto",
    minHeight: "10vh",
    alignItems: "center",
    // eslint-disable-next-line
    ["@media (max-width:1024px)"]: {
      flexDirection: "column",
    },
  },
  background: {
    backgroundImage: `url(${BackgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 65.5%',
    height: '55vh',
    width: '100%'
  },
  introduction: {
    flex: 1,
    paddingLeft: 60,
    height: "340px",
  },
  safeFood: {
    marginTop: 10,
    fontSize: 44,
    fontWeight: 500,
  },
  delivery: {
    color: "#157a21",
    fontSize: 44,
    fontWeight: "bold",
    marginTop: -20,
    marginBottom: -15,
  },
  paragraph: {
    width: 400,
    fontSize: 14.5,
  },
  // cover: {
  //   flex: 1,
  //   display: "flex",
  //   justifyContent: "auto",
  //   height: "50vh",
  // },
  coverImg: {
    height: "auto",
    width: "auto",
  },
  ctaOrder: {
    fontSize: 18,
    backgroundColor: "dimgray",
    marginTop: 20,
  },
}));

const HomeStart = () => {
  const classes = useStyles();
  return (
    <div className={classes.background}>
    <section className={classes.presentation}>
      <div className={classes.introduction}>
        <Typography className={classes.safeFood} noWrap>
          DIGITAL
        </Typography>
        <Typography className={classes.delivery} noWrap>
          HEALTH
        </Typography>
        {/* <Typography variant="body2" className={classes.paragraph}>
          INTRODUCTION........
        </Typography> */}
        <Link to="/appointment">
          <Button className={classes.ctaOrder}>Book Appointments</Button>
        </Link>
      </div>
      {/* <div className={classes.cover}>
        <img src={cover} alt="safe-delivery" className={classes.coverImg} />
      </div> */}
      
    </section>
    </div>
  );
};

export default React.memo(HomeStart);

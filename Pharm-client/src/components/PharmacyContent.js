import React from "react";
import { useSelector } from "react-redux";

//M-UI
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import PharmacyCard from "./PharmacyCard";

const PharmacyContent = () => {
  const { Pharmacys } = useSelector((state) => state.data);
  const PharmacyArray = Pharmacys.Pharmacys;

  const getPharmacyCard = (PharmacyObj) => {
    return (
      <Grid item xs={12} sm={3} key={PharmacyObj._id}>
        <PharmacyCard {...PharmacyObj} />
      </Grid>
    );
  };
  return (
    <>
      <Typography
        gutterBottom
        variant="h6"
        color="textPrimary"
        component="p"
        noWrap
      >
        Order from nearest Pharmacy -
      </Typography>
      <br />
      <Grid container spacing={2}>
        {PharmacyArray ? (
          PharmacyArray.length > 0 ? (
            PharmacyArray.map((Pharmacy) => getPharmacyCard(Pharmacy))
          ) : (
            <p>
              No Pharmacy currently available in your area, come back Later.
            </p>
          )
        ) : (
          <p>No Pharmacy found, come back Later.</p>
        )}
      </Grid>
    </>
  );
};

export default PharmacyContent;

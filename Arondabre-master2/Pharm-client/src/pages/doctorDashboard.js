import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

// Custom hook
import useForm from "../hooks/forms";

// Components
import ItemDialog from "../components/ItemDialog";
import PharmacyInfo from "../components/Pharmacyinfo";
import PharmacyItems from "../components/Pharmacyitems";
import SearchBar from "../components/SearchBar";

// Redux action
import { addItem } from "../redux/actions/dataActions";

const useStyles = makeStyles((theme) => ({
  ...theme.spreadThis,
  button: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    width: "40%",
    margin: "40px 0 0 30%",
    "&:hover": {
      backgroundColor: "#5a5c5a",
    },
  },
}));

export default function SellerDashboard() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const sellerData = useSelector((state) => state.auth);
  const { items } = sellerData;

  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);

  const { inputs, handleInputChange } = useForm({
    title: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    if (items) {
      setAllItems(items);
      setFilteredItems(items);
    }
  }, [items]);

  const handleFileSelect = (event) => {
    setImage(event.target.files[0]);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    inputs.title = "";
    inputs.description = "";
    inputs.price = "";
    setImage(null);
    setOpen(false);
  };

  const handleSubmit = () => {
    if (!inputs.title || !inputs.price || !image) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    const itemData = new FormData();
    itemData.append("avatar", image);
    itemData.append("title", inputs.title);
    itemData.append("description", inputs.description);
    itemData.append("price", inputs.price);

    dispatch(addItem(itemData));
    handleClose();
  };

  const handleSearch = (value) => {
    if (!value) {
      setFilteredItems(allItems);
      return;
    }

    const filter = value.toLowerCase();
    const filtered = allItems.filter((item) =>
      item.title.toLowerCase().includes(filter)
    );
    setFilteredItems(filtered);
  };

  return (
    <>
      <PharmacyInfo {...sellerData} />

      <Grid container direction="row" style={{ marginTop: 40 }}>
        <Grid item xs={12} sm={1} />
        <Grid item xs={12} sm={6}>
          <Typography
            gutterBottom
            variant="h5"
            style={{ textAlign: "center", marginBottom: 30 }}
            noWrap
          >
            Add, Edit, Delete Items in your Pharma Page
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <SearchBar page="items" handleSearch={handleSearch} />
        </Grid>
        <Grid item xs={12} sm={1} />
        <PharmacyItems items={filteredItems} />
      </Grid>

      <Button fullWidth className={classes.button} onClick={handleOpen}>
        Add Item
      </Button>

      <ItemDialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        handleFileSelect={handleFileSelect}
        inputs={inputs}
        handleInputChange={handleInputChange}
      />
    </>
  );
}

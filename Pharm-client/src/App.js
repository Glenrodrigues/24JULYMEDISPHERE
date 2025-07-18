import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//redux
import { Provider } from "react-redux";
import store from "./redux/store";

import { SET_AUTHENTICATED } from "./redux/types";
import { logoutAction, getUserData } from "./redux/actions/authActions";

//axios
import axios from "./util/axios";

//jwt-decode
import jwtDecode from "jwt-decode";

//material-ui
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

//theme
import themeFile from "./util/theme";

//components
import AppBar from "./components/AppBar";
import Footer from "./components/Footer";

//util
import ScrollToTop from "./util/scrollToTop";

//restrict routes
import { AuthRoute, SellerRoute, UserRoute, DoctorRoute} from "./util/route";

//pages
import home from "./pages/home";
import error404 from "./pages/404";
import signup from "./pages/sign-up";
import login from "./pages/login";
import addPharmacy from "./pages/addPharmacy";
import Pharmacy from "./pages/Pharmacy";
import sellerDash from "./pages/sellerDashboard";
import cart from "./pages/cart";
import orders from "./pages/orders";

import doctorDash from "./pages/doctorDashboard";
import addDoctor from "./pages/addDoctor";

//faace  pages
import Photo from "./pages/photo";
import Upload from "./pages/upload";
import Upphoto from "./pages/upphoto";




const theme = createMuiTheme(themeFile);

const token = localStorage.jwt;

if (token) {
  const decodedToken = jwtDecode(token);
  // console.log(decodedToken);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutAction());
    window.location.href = "/login";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (

    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <AppBar />
          <ScrollToTop />
          <Switch>
            <Route exact path="/" component={home} />
            <AuthRoute exact path="/login" component={login} />
            <AuthRoute exact path="/register" component={signup} />
            <AuthRoute exact path="/addPharmacy" component={addPharmacy} />
            <AuthRoute exact path="/addDoctor" component={addDoctor} />
            <UserRoute exact path="/order/:restName" component={Pharmacy} />
            
            
            {/*changes*/}
            <UserRoute exact path="/photo" component={Photo} />
            <UserRoute exact path="/upload" component={Upload} />
            <UserRoute exact path="/upphoto" component={Upphoto} />

            


            <SellerRoute
              exact
              path="/seller/dashboard"
              component={sellerDash}
            />

            <DoctorRoute
              exact
              path="/doctor/dashboard"
              component={doctorDash}
            />
            <UserRoute exact path="/cart" component={cart} />
            <UserRoute exact path="/orders" component={orders} />
            <SellerRoute exact path="/seller/orders" component={orders} />
            <Route component={error404} />
          </Switch>
          <Footer />
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;

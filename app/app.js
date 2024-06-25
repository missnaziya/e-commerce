const express = require("express");
const fileUpload = require("express-fileupload");
var session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const { privacy, delivery, terms } = require("./controller/homepage");
const {
  getProductDetailPage,
  getProductsPage,
  setStoreId,
  getproductsajax,
  checkoutPage,
  getStores,
  getHomePage,
  cartdata,
} = require("./controller/order.js");
const {
  getLoginPage,
  getRegisterPage,
  userLogin,
  verify,
  getVerified,
} = require("./controller/login");
const {
  userLoginApi,
  getRegistrationApi,
  verifyApi,
  getVerifiedApi,
} = require("./api/login");
const {
  myaccountsApi,
  validatePromoApi,
  forgetpasswordApi,
  resetPasswordApi,
  saveAddressApi,
  deleteAddressApi,
  placeorderApi,
} = require("./api/accounts");
const {
  getHomePageApi,
  getProductsPageApi,
  getProductDetailPageApi,
  checkoutPageApi,
  getproductsajaxApi,
  getStoresApi,
} = require("./api/order");
const {
  myaccounts,
  placeorder,
  logout,
  dynamic_cart,
  mobile_dynamic_cart,
  forgetpassword,
  saveaddress,
  resetpassword,
  pass,
  validatePromo,
  deleteaddress,
} = require("./controller/accounts");
const { ISMOBILE } = require('./utils/config'); 

var router = express.Router();

const db = require("./routes/db");

var Request = require("request");
const { deliveryApi } = require("./api/homepage");

app.set("view engine", "ejs"); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, "public"))); // configure express to use public folder
app.use("/app-assets", express.static(__dirname + "/app-assets"));
app.use(fileUpload()); // configure fileupload

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

function ensureAuthenticated(req, res, next) {
  if (!req.session.Logged) {
    req.session.orignalurl = req.originalUrl;
    return res.redirect("/boozly/login");
  } else {
    next();
  }
}
// routes for the app

// router.get("/", getHomePage);
// router.post("/", getHomePage);
// router.post("/api/home", getHomePageApi);
// router.get("/api/home", getHomePageApi);
router.get("/", ISMOBILE ? getProductsPage : getHomePage);
router.post("/", ISMOBILE ? getProductsPage : getHomePage);
router.get("/api/home", ISMOBILE ? getProductsPageApi : getHomePageApi);
router.post("/api/home", ISMOBILE ? getProductsPageApi : getHomePageApi);


router.get("/privacy", privacy);
router.get("/terms", terms);

router.get("/delivery/:id", ensureAuthenticated, delivery);
router.get("/api/delivery", deliveryApi);

router.get("/getverified", getVerified);
router.post("/api/getverified", getVerifiedApi);

router.post("/cartdata", cartdata);
router.get("/verify/:id/:token", verify);
router.get("/api/verify/:id/:token", verifyApi);

//------------- Orders
router.post("/store", getStores);
router.get("/api/store", getStoresApi);

router.get("/checkout", ensureAuthenticated, checkoutPage);
router.get("/api/checkout", checkoutPageApi);

router.get("/finddrink", getProductsPage);
router.post("/finddrink", getProductsPage);
router.get("/api/finddrink", getProductsPageApi);
router.post("/api/finddrink", getProductsPageApi);

router.get("/drink-detail/:slug", getProductDetailPage);
router.post("/drink-detail/:slug", getProductDetailPage);
router.get("/api/drink-detail", getProductDetailPageApi);
router.post("/api/drink-detail", getProductDetailPageApi);

router.post("/ajaxdata", getproductsajax);
router.post("/api/ajaxdata", getproductsajaxApi);

router.post("/ajaxvariation", setStoreId);

//-------Login
router.get("/login", getLoginPage);
router.post("/login", userLogin);
router.post("/api/login", userLoginApi);

//-------Register
router.get("/register", getRegisterPage);
router.post("/register", getRegisterPage);
router.post("/api/register", getRegistrationApi);
//  -----------------------User Start-------------------------------------

router.get("/myaccounts", ensureAuthenticated, myaccounts);
router.post("/myaccounts", ensureAuthenticated, myaccounts);
router.get("/api/myaccounts", myaccountsApi);
router.post("/api/myaccounts", myaccountsApi);

router.post("/placeorder", ensureAuthenticated, placeorder);
router.post("/api/placeorder", placeorderApi);

router.get("/logout", ensureAuthenticated, logout);
router.post("/dynamic_cart", dynamic_cart);

router.post("/mobile_dynamic_cart", mobile_dynamic_cart);

router.post("/validatepromo", ensureAuthenticated, validatePromo);
router.post("/api/validatepromo", validatePromoApi);

router.get("/forgetpassword", forgetpassword);
router.post("/forgetpassword", forgetpassword);
router.get("/api/forgetpassword", forgetpasswordApi);
router.post("/api/forgetpassword", forgetpasswordApi);

router.get("/resetpassword/:id/:token", pass);
router.post("/resetpassword", resetpassword);
router.post("/api/resetpassword", resetPasswordApi);

router.post("/saveaddress", ensureAuthenticated, saveaddress);
router.post("/api/saveaddress", saveAddressApi);

router.get("/delete-address/:id", ensureAuthenticated, deleteaddress);
router.get("/api/delete-address/:id", deleteAddressApi);

// ------------------------User End----------------------------------------
module.exports = router;

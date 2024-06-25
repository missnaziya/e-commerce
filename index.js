const express = require("express");
const fileUpload = require("express-fileupload");
//const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const path = require("path");
var http = require("http");
var multer = require("multer");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
require("dotenv").config();
//var distance = require('google-distance-matrix');
var flash = require("connect-flash");
const app = express();
var md5 = require("md5");
var flash = require("req-flash");
var moment = require("moment");
var db = require("./app/routes/db");
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  ISMOBILE,
} = require("./app/utils/config.js");

global.group_id_passenger = 2;
global.dategmt = moment().utc().format("Y-M-D H:m:s");
global.tax = 10;
global.taxRatePercentage = 10;
global.deliver_charges = 0;
global.ISMOBILE = ISMOBILE;

// var a='09/04/2020'+' '+'8:00 AM'
// console.log(new Date(a))

knex = require("knex")({
  client: "mysql",
  connection: {
    host: process.env.DB_HOST || DB_HOST,
    user: process.env.DB_USER || DB_USER,
    password: process.env.DB_PASSWORD || DB_PASSWORD,
    database: process.env.DB_NAME || DB_NAME,
  },
});

function search(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].name === nameKey) {
      return myArray[i].value;
    }
  }
}

const port = 2605;
app.set("views", [__dirname + "/app/views"]);
// configure middleware
// app.set('port', process.env.port || port); // set express to use this port
app.use("/assets", express.static(__dirname + "/assets"));
//  app.set('views', __dirname + '/admin-pannel/views'); // set express to look in this folder to render our view
app.set("view engine", "ejs"); // configure template engine
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, "public"))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload
app.use("/backend", express.static(__dirname + "/backend"));
app.use(cookieParser());
app.use(
  session({
    name: "admin",
    cookie: { maxAge: 6000000 },
    secret: "djhxcvxfgshajfgjhgsjhfgsakjeauytsdfy",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use((req, res, next) => {
  if (req.session.Logged) {
    res.locals.user_id = req.session.user_id;
    res.locals.u_fname = req.session.u_fname;
    res.locals.u_email = req.session.u_email;
    res.locals.u_lname = req.session.u_lname;
    res.locals.u_phone = req.session.u_phone;
    res.locals.u_address = req.session.u_address;
  }
  next();
});

frontend = require("./app/app");

app.use("/boozly", frontend);

// app.use(redirectUnmatched);
// function redirectUnmatched(req, res) {
//   res.render("error_page.ejs");
// }

// set the app to listen on the port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

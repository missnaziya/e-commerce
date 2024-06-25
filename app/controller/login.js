var md5 = require("md5");
var dropdown = require("../model/dropdown");
var md5 = require("md5");
var dateTime = require("node-datetime");
var dt = dateTime.create();
var moment = require("moment-timezone");
var moment = require("moment");
var axios = require("axios");
const { APP_BASE_URL } = require("../utils/config.js");
const { getBase64 } = require("../utils/helper");

var token_gentime;
let gemail = "";
let gID = 0;

module.exports = {
  //-----------------------Login Page
  async verify(req, res) {
    // var secret = "fe1a1915a379f3be5394b64d14794932-1506868106675";
    // var payload = jwt.decode(req.params.token, secret);
    // var id = payload.id;
    // var token = req.params.token;

    // await knex("customers")
    //   .select("customers.*", "customers.customer_id as id", "cs.*")
    //   .leftJoin(
    //     "customer_addresses as cs",
    //     "cs.customer_id",
    //     "=",
    //     "customers.customer_id"
    //   )
    //   .where("customers.customer_id", id)
    //   .where("customers.is_delete", "0")
    //   .then(function (user) {
    //     if (user.length < 1) {
    //       req.flash(
    //         "FlashMsg",
    //         "Sorry, but we couldn’t find that email address in our records. Please try another."
    //       );
    //       res.redirect("/boozly/login");
    //     } else {
    //       var FirstName = user[0].fname;
    //       knex("customers")
    //         .update("is_verified", 1)
    //         .where("customer_id", id)
    //         .then(function (result) {
    //           res.render("myaccounts/verify.ejs", { fName: FirstName });
    //         });
    //     }
    //   });

    try {
      //   console.log("REQ:::", req.config);
      const { headers, method, url, params, query, body, session, cookies } =
        req;
      const { id, token } = params;
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const response = await axios({
        method,
        url: `${baseUrl}/boozly/api/verify/${id}/${token}`,
        // headers,
        // params,
        // paramsSerializer: (params) => {
        //   return qs.stringify(params, { arrayFormat: "repeat" });
        // },
        // data: body,
        // params: query,
        // session,
        // headers: {
        //   Cookie: Object.entries(cookies)
        //     .map(([key, value]) => `${key}=${value}`)
        //     .join("; "),
        // },
      });

      if (response.status === 200) {
        if (response.data.redirect) {
          res.redirect(response.data.redirect);
        }
        if (response.data.render) {
          res.render(response.data.render, response.data.data);
        }
      }
    } catch (error) {
      // console.log("Error::", error.message);
      if (error.response.status === 400 && error.response.data.redirect) {
        req.flash("FlashMsg", error.response.data.data.FlashMsg);
        res.redirect(error.response.data.redirect);
      }
      if (error.response.status === 400 && error.response.data.render) {
        res.render(error.response.data.render, error.response.data.data);
      }
    }
  },

  getLoginPage: (req, res) => {
    var cart = req.session.cart || [];
    res.render("login/login.ejs", {
      FlashMsg: req.flash("FlashMsg"),
      cart: cart,
      oldData: "",
      register: false,
    });
  },

  //------------- User Login
  userLogin: async (req, res) => {
    try {
      // gemail = req.body.email;
      // let email = req.body.email;
      // let pass = req.body.md5password;
      // //console.log(pass);
      // knex("customers")
      //   .select("customers.*", "customers.customer_id as id", "cs.*")
      //   .leftJoin(
      //     "customer_addresses as cs",
      //     "cs.customer_id",
      //     "=",
      //     "customers.customer_id"
      //   )
      //   .where("email", "=", email)
      //   .where("customers.is_delete", "0")
      //   .then(function (user) {
      //     if (user.length < 1) {
      //       req.flash(
      //         "FlashMsg",
      //         "Sorry, but we couldn’t find that email address in our records. Please try another."
      //       );
      //       res.redirect("/boozly/login");
      //     } else if (user[0].text_password != pass) {
      //       req.flash(
      //         "FlashMsg",
      //         "Sorry, but the password you have entered does not match our records. Please try again."
      //       );
      //       res.redirect("/boozly/login");
      //     } else if (user[0].is_verified != 1) {
      //       gID = user[0].id;
      //       var payload = {
      //         id: gID, // User ID from database
      //         email: gemail,
      //         token_gentime: dt.format("Y-m-d H:M:S"),
      //       };
      //       var response = sendEmailVerification(payload, email);
      //       if (response) {
      //         res.render("login/login.ejs", {
      //           FlashMsg: "Server Error Try after some time",
      //           err_msg: "",
      //           email_exist: "",
      //           oldData: "",
      //           register: false,
      //         });
      //       } else {
      //         res.render("login/getverified.ejs", { email });
      //       }
      //     } else {
      //       req.session.Logged = true;
      //       req.session.user_id = user[0].id;
      //       req.session.owner_id = user[0].user_id;
      //       req.session.u_email = user[0].email;
      //       req.session.u_fname = user[0].fname;
      //       req.session.u_lname = user[0].lname;
      //       req.session.u_phone = user[0].phone;
      //       req.session.u_address = user[0].address;
      //       req.session.stripeCustId = user[0].stripe_cust_id;
      //       if (req.session.orignalurl) {
      //         res.redirect(req.session.orignalurl);
      //       } else {
      //         res.redirect("/boozly");
      //       }
      //     }
      //   });

      let email = req.body.email;
      let pass = req.body.md5password;
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const data = {
        email: email,
        password: pass,
      };

      const response = await axios.post(`${baseUrl}/boozly/api/login`, data);

      if (response.status === 200) {

        const body = response.data;
        const user = body.user;

        res.cookie('Logged', true);
        res.cookie('user_id', user[0].id);
        res.cookie('owner_id', user[0].user_id);
        res.cookie('u_email', user[0].email);
        res.cookie('u_fname', user[0].fname);
        res.cookie('u_lname', user[0].lname);
        res.cookie('u_phone', user[0].phone);
        res.cookie('u_address', user[0].address);
        res.cookie('stripeCustId', user[0].stripe_cust_id);
      
      


        req.session.Logged = true;
        req.session.user_id = user[0].id;
        req.session.owner_id = user[0].user_id;
        req.session.u_email = user[0].email;
        req.session.u_fname = user[0].fname;
        req.session.u_lname = user[0].lname;
        req.session.u_phone = user[0].phone;
        req.session.u_address = user[0].address;
        req.session.stripeCustId = user[0].stripe_cust_id;
        if (req.session.orignalurl) {

          res.redirect(req.session.orignalurl);
        } else {
          if (ISMOBILE === "1") {
            res.redirect("/boozly/finddrink");
          } else {
            res.redirect("/boozly");
          }
        }
      }
    } catch (error) {
      if (error.response.status === 400 && error.response.data.redirect) {
        req.flash("FlashMsg", error.response.data.data.FlashMsg);
        res.redirect(error.response.data.redirect);
      }
      if (error.response.status === 400 && error.response.data.render) {
        res.render(error.response.data.render, error.response.data.data);
      }
    }
  },

  // ------------------------Register Page
  async getRegisterPage(req, res) {
    try {
      // if (req.method == "POST") {
      //   var exist;
      //   await knex("customers")
      //     .where("email", req.body["email"])
      //     .then(function (bots) {
      //       exist = bots;
      //     });
      //   var email = req.body["email"];
      //   if (exist.length > 0) {
      //     res.render("login/login.ejs", {
      //       FlashMsg:
      //         "Sorry, but that email address is already in use, please try another. Alternatively, if you think you may have already registered, you can try logging in.",
      //       oldData: req.body,
      //       register: true,
      //     });
      //   } else {
      //     var owner = {};
      //     var user_id;
      //     delete req.body.privacy;
      //     delete req.body.term;

      //     owner["api_key"] = md5(req.body["email"]);
      //     owner["group_id"] = 2;
      //     owner["username"] = req.body["email"];
      //     owner["password"] = md5(req.body["password"]);
      //     owner["u_name"] = req.body["fname"] + " " + req.body["lname"];
      //     owner["u_fname"] = req.body["fname"];
      //     owner["u_lname"] = req.body["lname"];
      //     owner["u_password"] = md5(req.body["password"]);
      //     owner["u_phone"] = " ";
      //     owner["ref_id"] = 0;
      //     owner["u_email"] = req.body["email"];
      //     owner["u_created"] = dategmt;
      //     owner["u_modified"] = dategmt;
      //     owner["u_street"] = "";
      //     owner["u_address"] = "";
      //     owner["u_city"] = "";
      //     owner["u_country"] = "";
      //     owner["u_zip"] = "";
      //     owner["active"] = 1;
      //     await knex("owners")
      //       .insert(owner)
      //       .then(function (result) {
      //         user_id = result[0];
      //       });

      //     req.body["name"] = req.body["fname"] + " " + req.body["lname"];
      //     req.body["created"] = dategmt;
      //     req.body["user_id"] = user_id;
      //     req.body["modified"] = dategmt;

      //     req.body["text_password"] = req.body["password"];
      //     req.body["password"] = md5(req.body["password"]);
      //     req.body["phone"] = " ";
      //     req.body["active"] = 1;
      //     req.body["is_delete"] = 0;
      //     await knex("customers")
      //       .insert([req.body])
      //       .then(function (result) {
      //         customer_id = result[0];
      //       });

      //     knex("customers")
      //       .select("customers.*", "customers.customer_id as id", "cs.*")
      //       .leftJoin(
      //         "customer_addresses as cs",
      //         "cs.customer_id",
      //         "=",
      //         "customers.customer_id"
      //       )
      //       .where("email", "=", req.body["email"])
      //       .then(function (user) {
      //         // req.session.Logged = true;
      //         // req.session.user_id = user[0].id;
      //         // req.session.owner_id = user[0].user_id;
      //         // req.session.u_email = user[0].email;
      //         // req.session.u_fname = user[0].fname;
      //         // req.session.u_lname = user[0].lname;
      //         // req.session.u_phone = user[0].phone;
      //         // req.session.u_address = user[0].address;

      //         if (user.length > 0) {
      //           var payload = {
      //             id: user[0].id, // User ID from database
      //             email: user[0].email,
      //             token_gentime: dt.format("Y-m-d H:M:S"),
      //           };

      //           var response = sendEmailVerification(payload, email);
      //           if (response) {
      //             res.render("login/login.ejs", {
      //               FlashMsg: "Server Error Try after some time",
      //               err_msg: "",
      //               email_exist: "",
      //               oldData: "",
      //               register: false,
      //             });
      //           } else {
      //             res.render("login/getverified.ejs", { email: email });
      //           }
      //         }

      //         //             // if (req.session.cart) {
      //         //             //     res.redirect('/boozly/checkout');
      //         //             // } else {

      //         //             //     res.redirect('/boozly');
      //         //             // }
      //       });
      //     //         // req.flash('FlashMsg', 'Congratulations, your account has been successfully created');
      //     //         // res.redirect('/boozly/login')
      //   }
      // } else {
      //   res.render("login/login.ejs", {
      //     FlashMsg: req.flash("FlashMsg"),
      //     oldData: "",
      //     register: true,
      //   });
      // }
      const data = { ...req.body };
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const response = await axios.post(`${baseUrl}/boozly/api/register`, data);
      if (response.status === 200) {
        if (response.data.redirect) {
          res.redirect(response.data.redirect);
        }
        if (response.data.render) {
          res.render(response.data.render, response.data.data);
        }
      }
    } catch (error) {
      if (error.response.status === 400 && error.response.data.redirect) {
        req.flash("FlashMsg", error.response.data.data.FlashMsg);
        res.redirect(error.response.data.redirect);
      }
      if (error.response.status === 400 && error.response.data.render) {
        res.render(error.response.data.render, error.response.data.data);
      }
    }
  },

  async getVerified(req, res) {
    // if (gID != 0 && gemail) {
    //   var payload = {
    //     id: gID, // User ID from database
    //     email: gemail,
    //     token_gentime: dt.format("Y-m-d H:M:S"),
    //   };

    //   var response = sendEmailVerification(payload, gemail);
    //   if (response) {
    //     res.render("login/getverified.ejs", {
    //       FlashMsg: "Server Error Try after some time",
    //       err_msg: "",
    //       email_exist: "",
    //       oldData: "",
    //       register: false,
    //     });
    //   } else {
    //     res.render("login/getverified.ejs", { email: gemail });
    //   }
    // } else {
    //   res.render("login/login.ejs", {
    //     FlashMsg: "Server Error Try after some time",
    //     err_msg: "",
    //     email_exist: "",
    //     oldData: "",
    //     register: false,
    //   });
    // }

    try {
      //   console.log("REQ:::", req.config);
      const { headers, method, url, params, query, body, session } = req;
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const base64String = await getBase64({
        headers,
        method,
        url,
        params,
        query,
        body,
        session,
      });
      const response = await axios({
        method: "POST",
        url: `${baseUrl}/boozly/api/getverified`,
        // headers,
        // params,
        // paramsSerializer: (params) => {
        //   return qs.stringify(params, { arrayFormat: "repeat" });
        // },
        data: { info: base64String },
        // params: query,
        // session,
      });

      console.log("Test1");

      if (response.status === 200) {
        if (response.data.redirect) {
          res.render(response.data.redirect);
        }
        if (response.data.render) {
          res.render(response.data.render, response.data.data);
        }
      }
    } catch (error) {
      if (error.response.status === 400 && error.response.data.redirect) {
        req.flash("FlashMsg", error.response.data.data.FlashMsg);
        res.redirect(error.response.data.redirect);
      }
      if (error.response.status === 400 && error.response.data.render) {
        res.render(error.response.data.render, error.response.data.data);
      }
    }
  },
};

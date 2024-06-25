const dropdown = require("../model/dropdown");
const md5 = require("md5");
const dateTime = require("node-datetime");
const dt = dateTime.create();
var moment = require("moment-timezone");
var moment = require("moment");
const jwt = require("jwt-simple");
const axios = require("axios");
var nodemailer = require("nodemailer");
const qs = require("qs");
const { APP_BASE_URL } = require("../utils/config.js");

const {
  NODEMAILER_HOST,
  NODEMAILER_PORT,
  NODEMAILER_PASSWORD,
  NODEMAILER_USER,
} = require("../utils/config.js");
const { getBase64 } = require("../utils/helper");

var token_gentime;
let transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST || NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT || NODEMAILER_PORT,
  secure: true, // upgrade later with STARTTLS
  debug: false,
  auth: {
    user: process.env.NODEMAILER_USER || NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD || NODEMAILER_PASSWORD,
    //    user:credential.send_user_mail,
    //    pass:credential.send_user_pass
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

module.exports = {
  // async getHomePage(req, res) {
  //     var pincode = req.cookies.pincode;
  //     var storeName = []
  //     var store_id = req.cookies.store_id || 1
  //     if (store_id) {
  //         await knex('stores').where('store_id', store_id).then(function(bots) {
  //             storeName = bots
  //         })
  //     }
  //     res.render('static/index.ejs', {
  //         pincode: pincode || '',
  //         FlashMsg: req.flash('FlashMsg'),
  //         storeName: storeName
  //     });
  // },

  //--------------GET ABOUT US PAGE
  privacy: (req, res) => {
    res.render("static/privacy.ejs");
  },

  //----------GET SEVICES US PAGE

  terms: (req, res) => {
    res.render("static/terms.ejs");
  },

  //----------GET CONTACT US PAGE
  async delivery(req, res) {
    //   var Id = req.session.user_id;
    //   var orderId = req.params.id;
    //   var data;
    //   var orders;
    //   await knex("customers")
    //     .select()
    //     .leftJoin(
    //       "customer_addresses as cs",
    //       "cs.customer_id",
    //       "=",
    //       "customers.customer_id"
    //     )
    //     .where("customers.customer_id", Id)
    //     .orderBy("cs.address_id", "desc")
    //     .then(function (bots) {
    //       data = bots[0];
    //     });
    //   var orderquery = knex("order_details as od")
    //     .select(
    //       "od.price as cost",
    //       "o.total_amount as total_cost",
    //       "o.*",
    //       "od.*",
    //       "s.*",
    //       "v.*",
    //       "p.*",
    //       "u.name as unit",
    //       "pkg.name as package"
    //     )
    //     .leftJoin("orders as o", "o.order_id", "=", "od.order_id")
    //     .leftJoin("products as p", "p.product_id", "=", "od.product_id")
    //     .leftJoin("stores as s", "o.store_id", "=", "s.store_id")
    //     .leftJoin("variations as v", "v.variation_id", "=", "od.variation_id")
    //     .leftJoin("units as u", "v.unit_id", "=", "u.id")
    //     .leftJoin("packages as pkg", "v.packaging_id", "=", "pkg.id")
    //     .where("o.customer_id", Id)
    //     .where("o.order_id", orderId)
    //     .orderBy("o.order_id", "desc");
    //   await orderquery.then(function (bots) {
    //     orders = bots;
    //   });
    //   var address;
    //   await knex("customers")
    //     .select()
    //     .leftJoin(
    //       "customer_addresses as cs",
    //       "cs.customer_id",
    //       "=",
    //       "customers.customer_id"
    //     )
    //     .where("customers.customer_id", Id)
    //     .orderBy("cs.address_id", "desc")
    //     .then(function (bots) {
    //       address = bots;
    //     });
    //   var result = orders.reduce(function (r, a) {
    //     if (a.is_delete != 1) {
    //       r[a.order_id] = r[a.order_id] || [];
    //       r[a.order_id].push(a);
    //     }
    //     return r;
    //   }, {});
    //   res.render("orders/delivery.ejs", {
    //     message: "",
    //     orders: result,
    //     data,
    //     address,
    //     orderId,
    //   });

    try {
      const { headers, method, url, params, query, body, session, cookies } =
        req;
      const info = {
        params,
        session,
      };
      const base64Info = await getBase64(info);
      // const orderId = req.params.id;
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const response = await axios({
        method,
        url: `${baseUrl}/boozly/api/delivery`,
        // headers,
        // params,
        // paramsSerializer: (params) => {
        //   return qs.stringify(params, { arrayFormat: "repeat" });
        // },
        // data: body,
        params: { info: base64Info },
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
        // req.flash("FlashMsg", error.response.data.data.FlashMsg);
        res.redirect(error.response.data.redirect);
      }
      if (error.response.status === 400 && error.response.data.render) {
        res.render(error.response.data.render, error.response.data.data);
      }
    }
  },
};

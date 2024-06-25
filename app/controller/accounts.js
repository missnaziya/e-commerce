const dropdown = require("../model/dropdown");
const md5 = require("md5");
const dateTime = require("node-datetime");
const dt = dateTime.create();
var moment = require("moment-timezone");
var moment = require("moment");
const jwt = require("jwt-simple");
const axios = require("axios");
const qs = require("qs");
const { STRIPE_SECRET_KEY, APP_BASE_URL, ISMOBILE } = require("../utils/config.js");

var stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY || STRIPE_SECRET_KEY
);

var nodemailer = require("nodemailer");
const {
  NODEMAILER_HOST,
  NODEMAILER_PORT,
  NODEMAILER_USER,
  NODEMAILER_PASSWORD,
} = require("../utils/config.js");
const { JWT_SECRET } = require("../utils/config.js");
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

function fomartTimeShow(h_24) {
  var h = ((h_24 + 11) % 12) + 1;
  return (h < 10 ? "0" : "") + h + ":00" + (h_24 < 12 ? "am" : "pm");
}

module.exports = {
  //----------GET ACCOUNTS US PAGE
  async myaccounts(req, res) {
    // var flashMessage = req.flash("FlashMsg");
    // var Id = req.session.user_id;
    // if (req.method == "POST") {
    //   var exist;
    //   await knex("customers")
    //     .where("password", md5(req.body["text_password"]))
    //     .where("text_password", req.body["text_password"])
    //     .where("customer_id", req.body["customer_id"])
    //     .then(function (bots) {
    //       exist = bots;
    //     });
    //   if (exist.length > 0) {
    //     await knex("customers")
    //       .where("email", req.body["email"])
    //       .whereNot("customer_id", req.body["customer_id"])
    //       .then(function (bots) {
    //         exist = bots;
    //       });
    //     if (exist.length > 0) {
    //       flashMessage =
    //         "Sorry, but that email address is already in use, please try another. Alternatively, if you think you may have already registered, you can try logging in.";
    //     } else {
    //       delete req.body.text_password;
    //       req.body["name"] = req.body["fname"] + " " + req.body["lname"];
    //       req.body["modified"] = dategmt;
    //       await knex("customers")
    //         .update(req.body)
    //         .where("customer_id", req.body["customer_id"])
    //         .then(function (bots) {
    //           data = bots[0];
    //         });
    //       var owner = {};
    //       owner["u_name"] = req.body["fname"] + " " + req.body["lname"];
    //       owner["u_fname"] = req.body["fname"];
    //       owner["u_lname"] = req.body["lname"];
    //       owner["u_phone"] = req.body["phone"];
    //       owner["u_email"] = req.body["email"];
    //       await knex("owners")
    //         .update(owner)
    //         .where("user_id", req.body["user_id"])
    //         .then(function (result) {});
    //     }
    //   } else {
    //     flashMessage =
    //       "Sorry, but the password you have entered does not match our records. Please try again.";
    //   }
    // }

    // var data;
    // var orders;
    // var ordersdetails;
    // var pastorders;
    // var pastordersdetails;
    // await knex("customers")
    //   .select()
    //   .leftJoin(
    //     "customer_addresses as cs",
    //     "cs.customer_id",
    //     "=",
    //     "customers.customer_id"
    //   )
    //   .where("customers.customer_id", Id)
    //   .orderBy("cs.address_id", "desc")
    //   .then(function (bots) {
    //     data = bots[0];
    //   });

    // var pastallorderquery = knex("orders as o")
    //   .select("o.*", "s.*", "o.total_amount as total_cost")
    //   .leftJoin("stores as s", "o.store_id", "=", "s.store_id")
    //   .where("o.customer_id", Id)
    //   .whereIn("order_status", [
    //     "new",
    //     "pending",
    //     "accept",
    //     "out_delivery",
    //     "ready",
    //     "arrive",
    //   ])
    //   .orderBy("o.order_id", "desc");
    // await pastallorderquery.then(function (bots) {
    //   orders = bots;
    // });

    // var orderallquery = knex("order_details as od")
    //   .select(
    //     "od.price as cost",
    //     "o.total_amount as total_cost",
    //     "o.*",
    //     "od.*",
    //     "s.*",
    //     "v.*",
    //     "p.*",
    //     "u.name as unit",
    //     "pkg.name as package"
    //   )
    //   .leftJoin("orders as o", "o.order_id", "=", "od.order_id")
    //   .leftJoin("products as p", "p.product_id", "=", "od.product_id")
    //   .leftJoin("stores as s", "o.store_id", "=", "s.store_id")
    //   .leftJoin("variations as v", "v.variation_id", "=", "od.variation_id")
    //   .leftJoin("units as u", "v.unit_id", "=", "u.id")
    //   .leftJoin("packages as pkg", "v.packaging_id", "=", "pkg.id")
    //   .where("o.customer_id", Id)
    //   .whereIn("order_status", [
    //     "new",
    //     "pending",
    //     "accept",
    //     "out_delivery",
    //     "ready",
    //     "arrive",
    //   ])
    //   .orderBy("o.order_date", "desc");
    // await orderallquery.then(function (bots) {
    //   ordersdetails = bots;
    // });

    // var pastallorderquery = knex("orders as o")
    //   .select("o.*", "s.*", "o.total_amount as total_cost")
    //   .leftJoin("stores as s", "o.store_id", "=", "s.store_id")
    //   .where("o.customer_id", Id)
    //   .whereIn("order_status", ["completed", "cancel", "delivered"])
    //   .orderBy("o.order_id", "desc");
    // await pastallorderquery.then(function (bots) {
    //   pastorders = bots;
    // });

    // var pastorderquery = knex("order_details as od")
    //   .select(
    //     "od.price as cost",
    //     "o.total_amount as total_cost",
    //     "o.*",
    //     "od.*",
    //     "s.*",
    //     "v.*",
    //     "p.*",
    //     "u.name as unit",
    //     "pkg.name as package"
    //   )
    //   .leftJoin("orders as o", "o.order_id", "=", "od.order_id")
    //   .leftJoin("products as p", "p.product_id", "=", "od.product_id")
    //   .leftJoin("stores as s", "o.store_id", "=", "s.store_id")
    //   .leftJoin("variations as v", "v.variation_id", "=", "od.variation_id")
    //   .leftJoin("units as u", "v.unit_id", "=", "u.id")
    //   .leftJoin("packages as pkg", "v.packaging_id", "=", "pkg.id")
    //   .where("o.customer_id", Id)
    //   .whereIn("order_status", ["completed", "cancel", "delivered"])
    //   .orderBy("o.order_date", "desc");

    // await pastorderquery.then(function (bots) {
    //   pastordersdetails = bots;
    // });

    // var address;

    // await knex("customers")
    //   .select()
    //   .leftJoin(
    //     "customer_addresses as cs",
    //     "cs.customer_id",
    //     "=",
    //     "customers.customer_id"
    //   )
    //   .where("customers.customer_id", Id)
    //   .orderBy("cs.address_id", "desc")
    //   .then(function (bots) {
    //     address = bots;
    //   });

    // var result = ordersdetails.reduce(function (r, a) {
    //   if (a.is_delete != 1) {
    //     r[a.order_id] = r[a.order_id] || [];
    //     var stillUtc = moment.utc(a.order_date).toDate();
    //     var local = moment(a.order_date).local().format("DD MMMM YYYY HH:mm a");
    //     a.order_date = local;
    //     r[a.order_id].push(a);
    //   }
    //   return r;
    // }, {});

    // var pastOrderResult = pastorders;
    // var openOrderResult = orders;
    // //pastOrderResult.ksort();
    // //console.log(pastorders);

    // var presult = pastordersdetails.reduce(function (r, a) {
    //   if (a.is_delete != 1) {
    //     r[a.order_id] = r[a.order_id] || [];
    //     var local = moment(a.order_date).local().format("DD MMMM YYYY HH:mm a");
    //     a.order_date = local;
    //     r[a.order_id].push(a);
    //   }
    //   return r;
    // }, {});

    // res.render("myaccounts/myaccounts.ejs", {
    //   FlashMsg: flashMessage,
    //   pastorders: presult,
    //   succesMsg: req.flash("succesMsg"),
    //   message: "",
    //   orders: result,
    //   data,
    //   address,
    //   pastOrderResult,
    //   openOrderResult,
    // });

    try {
      //   console.log("REQ:::", req.config);
      const { headers, method, url, params, query, body, session, cookies } =
        req;
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const base64Info = await getBase64({
        method,
        body,
        session,
      });

      let response = {};
      if (method === "GET") {
        response = await axios({
          method: "GET",
          url: `${baseUrl}/boozly/api/myaccounts`,
          params: { info: base64Info },
        });
      } else {
        response = await axios({
          method: "POST",
          url: `${baseUrl}/boozly/api/myaccounts`,
          data: {
            info: base64Info,
          },
          // params: query,
        });
      }
      if (response.status === 200) {
        if (response.data.redirect) {
          res.render(response.data.redirect);
        }
        if (response.data.render) {
          res.render(response.data.render, response.data.data);
        }
      }
    } catch (error) {
      console.log("Error::", error);
      if (error.response.status === 400 && error.response.data.redirect) {
        // req.flash("FlashMsg", error.response.data.data.FlashMsg);
        res.redirect(error.response.data.redirect);
      }
      if (error.response.status === 400 && error.response.data.render) {
        res.render(error.response.data.render, error.response.data.data);
      }
    }
  },

  //----------GET CHANGEPASSWORD  PAGE
  placeorder: async function (req, res) {
    // var Id = req.session.user_id;
    // var user_id = req.session.owner_id;
    // var cart = req.session.cart;
    // var order_details = {};
    // var store_id = req.cookies.store_id;
    // var subTotal = 0;
    // var brand_id;
    // var rkey;
    // var bkey;
    // var promoId = 0;
    // var promoRate = 0;
    // var promocode = "";
    // await knex
    //   .select("brand_id", "rkey")
    //   .from("stores")
    //   .where("store_id", store_id)
    //   .then(function (bots) {
    //     (brand_id = bots[0].brand_id), (rkey = bots[0].rkey);
    //   });
    // await knex
    //   .select("bkey")
    //   .from("brands")
    //   .where("brand_id", brand_id)
    //   .then(function (bots) {
    //     bkey = bots[0].bkey;
    //   });
    // await knex
    //   .select("promo_code", "promo_id", "promo_value")
    //   .from("promos")
    //   .where("promo_code", "=", req.body.formdata.promocode)
    //   .then(function (bots) {
    //     if (bots.length > 0) {
    //       promoRate = bots[0].promo_value;
    //       promocode = bots[0].promo_code;
    //       promoId = bots[0].promo_id;
    //     }
    //   });
    // cart.forEach(function (element) {
    //   subTotal += Number(element["total_price"]);
    // });
    // var taxRate = taxRatePercentage;
    // var promo_val = 0;
    // var tax = 0;
    // if (promoRate > 0) {
    //   promo_val = parseFloat(
    //     parseFloat(parseFloat(subTotal) * promoRate) / 100
    //   ).toFixed(2);
    // }
    // var tip = req.body.formdata.tip || 0;
    // var delivery = deliver_charges;
    // if (taxRate > 0) {
    //   tax = parseFloat(
    //     ((parseFloat(subTotal) - parseFloat(promo_val)) * taxRate) / 100
    //   ).toFixed(2);
    // }
    // var payAmt = parseFloat(
    //   parseFloat(subTotal) +
    //     parseFloat(tax) +
    //     parseFloat(delivery) +
    //     parseFloat(tip) -
    //     parseFloat(promo_val)
    // ).toFixed(2);
    // order_details["customer_id"] = Id;
    // order_details["user_id"] = user_id;
    // order_details["brand_id"] = brand_id;
    // order_details["rkey"] = rkey;
    // order_details["bkey"] = bkey;
    // order_details["store_id"] = store_id;
    // order_details["order_date"] = dategmt;
    // order_details["order_type"] = req.body.formdata.order_type;
    // if (req.body.formdata.order_type == "Pickup") {
    //   order_details["order_notes"] = req.body.formdata.c_note;
    // }
    // if (req.body.formdata.order_type == "Delivery") {
    //   order_details["order_notes"] = req.body.formdata.d_note;
    // }
    // order_details["order_status"] = "new";
    // order_details["payment_status"] = "Unpaid";
    // order_details["created"] = dategmt;
    // order_details["modified"] = dategmt;
    // order_details["address_id"] = req.body.formdata.addressId;
    // order_details["est_time"] = "";
    // order_details["payment_mode"] = "";
    // order_details["promo_id"] = promoId;
    // order_details["promo_code"] = promocode;
    // order_details["sub_total_amt"] = parseFloat(subTotal).toFixed(2);
    // order_details["added_tip"] = parseFloat(tip).toFixed(2);
    // order_details["delivery_cost"] = parseFloat(delivery).toFixed(2);
    // order_details["promo_amount"] = parseFloat(promo_val).toFixed(2);
    // order_details["tax_amt"] = parseFloat(tax).toFixed(2);
    // order_details["total_amount"] = parseFloat(payAmt).toFixed(2);
    // var order_id = 0;
    // var customerName = req.session.u_fname + " " + req.session.u_lname;
    // customerName = customerName.trim();
    // //--------------------------------
    // //console.log(req.session.stripeCustId);
    // if (
    //   false &&
    //   req.session.stripeCustId != null &&
    //   req.session.stripeCustId != "null" &&
    //   req.session.stripeCustId != ""
    // ) {
    //   stripe.charges
    //     .create({
    //       amount: order_details["total_amount"] * 100,
    //       description: "Boozly Order",
    //       currency: "GBP",
    //       customer: req.session.stripeCustId,
    //     })
    //     .then(async (charge) => {
    //       await knex("orders")
    //         .insert(order_details)
    //         .then(function (bot) {
    //           order_id = bot[0];
    //         });
    //       var orders = {};
    //       if (order_id) {
    //         for (let i = 0; i < cart.length; i++) {
    //           orders["order_id"] = order_id;
    //           orders["total_amount"] = cart[i].total_price;
    //           orders["quantity"] = cart[i].qty;
    //           orders["price"] = cart[i].value;
    //           orders["variation_id"] = cart[i].variation_id;
    //           orders["product_id"] = cart[i].product_id;
    //           orders["created"] = dategmt;
    //           orders["modified"] = dategmt;
    //           await knex("order_details")
    //             .insert(orders)
    //             .then(function (bots) {});
    //         }
    //       }
    //       (req.session.cart = []),
    //         (obj = {}),
    //         (obj["order_id"] = order_id),
    //         res.send(obj);
    //     })
    //     .catch((err) => {
    //       (obj = {}), (obj["error"] = err), res.send(obj);
    //     });
    // } else {
    //   await knex("orders")
    //     .insert(order_details)
    //     .then(function (bot) {
    //       order_id = bot[0];
    //     });
    //   var orders = {};
    //   if (order_id) {
    //     for (let i = 0; i < cart.length; i++) {
    //       orders["order_id"] = order_id;
    //       orders["total_amount"] = cart[i].total_price;
    //       orders["quantity"] = cart[i].qty;
    //       orders["price"] = cart[i].value;
    //       orders["variation_id"] = cart[i].variation_id;
    //       orders["product_id"] = cart[i].product_id;
    //       orders["created"] = dategmt;
    //       orders["modified"] = dategmt;
    //       await knex("order_details")
    //         .insert(orders)
    //         .then(function (bots) {});
    //     }
    //   }
    //   (req.session.cart = []),
    //     (obj = {}),
    //     (obj["order_id"] = order_id),
    //     res.send(obj);
    // }
    //req.flash('successMsg', 'Order Saved Successfully');
    //res.redirect('/boozly/myaccounts')
    try {
      //   console.log("REQ:::", req.config);
      const { headers, method, url, params, query, body, session, cookies } =
        req;
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const base64Info = await getBase64({
        body,
        session,
        cookies,
      });
      const response = await axios({
        method: "POST",
        url: `${baseUrl}/boozly/api/placeorder`,
        // headers,
        // params,
        // paramsSerializer: (params) => {
        // return qs.stringify(params, { arrayFormat: "repeat" });
        // },
        data: { info: base64Info },
        // params: query,
        // session,
        // headers: {
        // Cookie: Object.entries(cookies)
        // .map(([key, value]) => `${key}=${value}`)
        // .join("; "),
        // },
      });

      if (response.status === 200) {
        res.send(response.data);
      }
    } catch (error) {
      //   console.log("Error::", error);
      if (error.response.status === 400 && error.response.data.redirect) {
        // req.flash("FlashMsg", error.response.data.data.FlashMsg);
        res.redirect(error.response.data.redirect);
      }
      if (error.response.status === 400 && error.response.data.render) {
        res.render(error.response.data.render, error.response.data.data);
      }
    }
  },

  placeorderwithstripe: async function (req, res) {
    var Id = req.session.user_id;
    var user_id = req.session.owner_id;
    var cart = req.session.cart;
    var order_details = {};
    var store_id = req.cookies.store_id;
    var subTotal = 0;
    var brand_id;
    var rkey;
    var bkey;
    var promoId = 0;
    var promoRate = 0;
    var promocode = "";
    await knex
      .select("brand_id", "rkey")
      .from("stores")
      .where("store_id", store_id)
      .then(function (bots) {
        (brand_id = bots[0].brand_id), (rkey = bots[0].rkey);
      });
    await knex
      .select("bkey")
      .from("brands")
      .where("brand_id", brand_id)
      .then(function (bots) {
        bkey = bots[0].bkey;
      });
    await knex
      .select("promo_code", "promo_id", "promo_value")
      .from("promos")
      .where("promo_code", "=", req.body.formdata.promocode)
      .then(function (bots) {
        if (bots.length > 0) {
          promoRate = bots[0].promo_value;
          promocode = bots[0].promo_code;
          promoId = bots[0].promo_id;
        }
      });

    cart.forEach(function (element) {
      subTotal += Number(element["total_price"]);
    });
    var taxRate = taxRatePercentage;
    var promo_val = 0;
    var tax = 0;
    if (promoRate > 0) {
      promo_val = parseFloat(
        parseFloat(parseFloat(subTotal) * promoRate) / 100
      ).toFixed(2);
    }
    var tip = req.body.formdata.tip || 0;
    var delivery = deliver_charges;
    if (taxRate > 0) {
      tax = parseFloat(
        ((parseFloat(subTotal) - parseFloat(promo_val)) * taxRate) / 100
      ).toFixed(2);
    }
    var payAmt = parseFloat(
      parseFloat(subTotal) +
        parseFloat(tax) +
        parseFloat(delivery) +
        parseFloat(tip) -
        parseFloat(promo_val)
    ).toFixed(2);

    order_details["customer_id"] = Id;
    order_details["user_id"] = user_id;
    order_details["brand_id"] = brand_id;
    order_details["rkey"] = rkey;
    order_details["bkey"] = bkey;
    order_details["store_id"] = store_id;
    order_details["order_date"] = dategmt;
    order_details["order_type"] = req.body.formdata.order_type;

    if (req.body.formdata.order_type == "Pickup") {
      order_details["order_notes"] = req.body.formdata.c_note;
    }
    if (req.body.formdata.order_type == "Delivery") {
      order_details["order_notes"] = req.body.formdata.d_note;
    }
    order_details["order_status"] = "new";
    order_details["payment_status"] = "Unpaid";
    order_details["created"] = dategmt;
    order_details["modified"] = dategmt;
    order_details["address_id"] = req.body.formdata.addressId;
    order_details["est_time"] = "";
    order_details["payment_mode"] = "";

    order_details["promo_id"] = promoId;
    order_details["promo_code"] = promocode;

    order_details["sub_total_amt"] = parseFloat(subTotal).toFixed(2);
    order_details["added_tip"] = parseFloat(tip).toFixed(2);
    order_details["delivery_cost"] = parseFloat(delivery).toFixed(2);
    order_details["promo_amount"] = parseFloat(promo_val).toFixed(2);

    order_details["tax_amt"] = parseFloat(tax).toFixed(2);
    order_details["total_amount"] = parseFloat(payAmt).toFixed(2);
    var order_id = 0;

    var customerName = req.session.u_fname + " " + req.session.u_lname;
    customerName = customerName.trim();
    //--------------------------------
    //console.log(req.session.stripeCustId);
    if (
      req.session.stripeCustId != null &&
      req.session.stripeCustId != "null" &&
      req.session.stripeCustId != ""
    ) {
      stripe.charges
        .create({
          amount: order_details["total_amount"] * 100,
          description: "Boozly Order",
          currency: "GBP",
          customer: req.session.stripeCustId,
        })
        .then(async (charge) => {
          await knex("orders")
            .insert(order_details)
            .then(function (bot) {
              order_id = bot[0];
            });
          var orders = {};
          if (order_id) {
            for (let i = 0; i < cart.length; i++) {
              orders["order_id"] = order_id;
              orders["total_amount"] = cart[i].total_price;
              orders["quantity"] = cart[i].qty;
              orders["price"] = cart[i].value;
              orders["variation_id"] = cart[i].variation_id;
              orders["product_id"] = cart[i].product_id;
              orders["created"] = dategmt;
              orders["modified"] = dategmt;
              await knex("order_details")
                .insert(orders)
                .then(function (bots) {});
            }
          }
          (req.session.cart = []),
            (obj = {}),
            (obj["order_id"] = order_id),
            res.send(obj);
        })
        .catch((err) => {
          (obj = {}), (obj["error"] = err), res.send(obj);
        });
    } else {
      stripe.customers
        .create({
          email: req.session.u_email,
          source: req.body.stripeToken,
          name: customerName,
        })
        .then(async (customer) => {
          await knex("customers")
            .update("stripe_cust_id", customer.id)
            .where("customer_id", Id)
            .then(function (result) {
              req.session.stripeCustId = customer.id;

              return stripe.charges.create({
                amount: order_details["total_amount"] * 100,
                description: "Boozly Order",
                currency: "GBP",
                customer: customer.id,
              });
            });
        })
        .then(async (charge) => {
          await knex("orders")
            .insert(order_details)
            .then(function (bot) {
              order_id = bot[0];
            });
          var orders = {};
          if (order_id) {
            for (let i = 0; i < cart.length; i++) {
              orders["order_id"] = order_id;
              orders["total_amount"] = cart[i].total_price;
              orders["quantity"] = cart[i].qty;
              orders["price"] = cart[i].value;
              orders["variation_id"] = cart[i].variation_id;
              orders["product_id"] = cart[i].product_id;
              orders["created"] = dategmt;
              orders["modified"] = dategmt;
              await knex("order_details")
                .insert(orders)
                .then(function (bots) {});
            }
          }
          (req.session.cart = []),
            (obj = {}),
            (obj["order_id"] = order_id),
            res.send(obj);
        })
        .catch((err) => {
          (obj = {}), (obj["error"] = err), res.send(obj);
        });
    }

    //req.flash('successMsg', 'Order Saved Successfully');
    //res.redirect('/boozly/myaccounts')
  },

  //----------GET bookings  PAGEdd
  async dynamic_cart(req, res) {
    if (req.body.remove_cart) {
      if (req.body.remove_cart > -1) {
        req.session.cart.splice(req.body.remove_cart, 1);
      }
    } else if (req.body.qty_update) {
      var i = req.body.qty_update.cart_index;
      req.session.cart[i].qty = req.body.qty_update.qty;
      req.session.cart[i].total_price =
        Number(req.body.qty_update.qty) * Number(req.session.cart[i].value);
    } else if (req.body.data) {
      if (false && req.session.cart) {
        for (let r = 0; r < req.body.data[0].length; r++) {
          for (var i = 0; i < req.session.cart.length; i++) {
            if (
              req.session.cart[i].variation_id ===
              req.body.data[0][r].variation_id
            ) {
              req.session.cart.splice(i, 1);
            }
          }
        }
        for (let i = 0; i < req.body.data[0].length; i++) {
          req.session.cart.push(req.body.data[0][i]);
        }
      } else {
        req.session.cart = [];
        for (let i = 0; i < req.body.data[0].length; i++) {
          req.session.cart.push(req.body.data[0][i]);
        }
      }
    } else if (req.body.refresh_cart) {
    } else {
      req.session.cart = [];
    }

    var cart = req.session.cart || [];
    var total = 0;
    cart.forEach(function (element) {
      total += Number(element["total_price"]);
    });

    res.render("orders/vari.ejs", {
      cart: cart,
      total,
    });
  },

  async mobile_dynamic_cart(req, res) {
    var cart = req.session.cart || [];
    var total = 0;
    res.render("orders/mobilvari.ejs", {
      cart: cart,
      total,
    });
  },

  //----------GET CHANGEPASSWORD  PAGE
  async forgetpassword(req, res) {
    // if (req.method == "POST") {
    //   if (req.body.email !== undefined) {
    //     var emailAddress = req.body.email;
    //     var result;
    //     var query = knex("customers").where("email", emailAddress);

    //     await query.then(function (bots) {
    //       result = bots;
    //     });

    //     if (result.length > 0) {
    //       var payload = {
    //         id: result[0].customer_id, // User ID from database
    //         email: emailAddress,
    //         token_gentime: dt.format("Y-m-d H:M:S"),
    //       };

    //       var secret = "fe1a1915a379f3be5394b64d14794932-1506868106675";

    //       var token = jwt.encode(payload, secret);

    //       var mailOptions = {
    //         from: "hr@grepixit.com",
    //         to: emailAddress,
    //         cc: "vinner.2112@gmail.com",
    //         subject: "Change your password",
    //         // html: '<p>Click <a href="http://139.59.87.114:2105/boozly/resetpassword/' + payload.id + "/" + token + '">here</a> to reset your password</p>'
    //         html:
    //           '<html><head><link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600&display=swap" rel="stylesheet"></head><body><center><div class=""><div class="aHl"></div><div id=":oz" tabindex="-1"></div><div id=":ob" class="ii gt"><div id=":oc" class="a3s aXjCH msg-6654097468040732516"><u></u><div style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div style="min-width:100%;width:100%;background-color:#ffffff"><table class="m_-6654097468040732516email" style="width:100%;max-width:600px;margin-left:auto;margin-right:auto;padding-left:20px;padding-right:20px;padding-bottom:0px;color:#333332;line-height:1.4;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Ubuntu","Open Sans","Helvetica Neue",sans-serif;background:#ffffff"><tbody><tr><td style="min-width:100%;width:100%;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px"><div style="text-align:center"><img src="http://139.59.87.114:2105/assets/images/logo/01.png" alt="Boozly" width="200" style="width:200px;padding-top:30px;padding-bottom:30px"></div></td></tr></tbody></table></div><table class="m_-6654097468040732516email" style="width:100%;max-width:600px;margin-left:auto;margin-right:auto;padding-left:20px;padding-right:20px;padding-bottom:20px;color:#333332;line-height:1.4;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Ubuntu","Open Sans","Helvetica Neue",sans-serif;background:#ffffff"><tbody><tr><td style="min-width:100%;width:100%;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px"><h1 style="font-family: Quicksand, sans-serif;color:#333332;font-size:32px;font-weight:600;line-height:1.2;margin-bottom:20px;text-align:center;">Change your password.</h1><p style="margin-top:0;margin-bottom:20px;font-family: Quicksand, sans-serif;text-align:center;font-size: medium;font-style: normal;">We received a request to change your password for your Boozly account.</p><p style="margin-top:0;margin-bottom:20px;text-align:center"><a href="http://139.59.87.114:2105/boozly/resetpassword/' +
    //           payload.id +
    //           "/" +
    //           token +
    //           '" style="color:#ffffff;text-decoration:none;display:inline-block;height:38px;line-height:38px;padding-top:0;font-family: Quicksand, sans-serif;padding-right:24px;padding-bottom:0;padding-left:24px;border:0;outline:0;background-color:#fb524f;font-size:14px;font-style:normal;font-weight:600;text-align:center;white-space:nowrap;border-radius:4px;margin-top:35px;margin-bottom:35px">Change your password</a></p><div class="m_-6654097468040732516email-disclaimer" style="color:#b3b3b1;font-size:14px;text-align:center;margin-top:0px;margin-right:0;margin-bottom:50px;margin-left:0;font-family: Times;">If you did not make this request, you can safely ignore this email.</div></div></div></td></tr></tbody></table><div style="min-width:100%;width:100%;background-color:#ffffff"><table class="m_-6654097468040732516email" style="width:100%;max-width:600px;margin-left:auto;margin-right:auto;padding-left:20px;padding-right:20px;padding-bottom:20px;color:#333332;line-height:1.4;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Ubuntu","Open Sans","Helvetica Neue",sans-serif;background:#ffffff;background-color:#ffffff"><tbody><tr><td><div style="padding-top:15px;padding-right:0;padding-bottom:0;padding-left:0;margin-top:0px;color:rgba(0,0,0,0.68);font-size:12px;text-align:center;border-top:1px solid #8e8e8e;font-family: Times;">Sent by <a href="http://139.59.87.114:2105/boozly">Boozly</a>  Silicon Oasis Dubai, UAE <a href="javascript:void(0);">Privacy policy</a></div></td></tr></tbody></table></div><div class="yj6qo"></div><div class="adL"></div></div><div class="adL"></div></div></div><div id=":ou" class="ii gt" style="display:none"><div id=":ov" class="a3s aXjCH undefined"></div></div><div class="hi"></div></div></center></body></html>',
    //       };

    //       transporter.sendMail(mailOptions, function (error, info) {
    //         if (error) {
    //           console.log(error);
    //           res.render("login/forgetpassword.ejs", {
    //             message: "Server Error Try after some time " + error,
    //             err_msg: "",
    //             email_exist: "",
    //             oldData: "",
    //           });
    //         }
    //         if (info) {
    //           console.log(info);
    //           res.render("login/forgetpassword.ejs", {
    //             message: "Password reset link has been sent to your email",
    //             err_msg: "",
    //             email_exist: "",
    //             oldData: "",
    //           });
    //         }
    //       });
    //     } else {
    //       res.render("login/forgetpassword.ejs", {
    //         message: "Invalid Email ",
    //         err_msg: "",
    //         email_exist: "",
    //         oldData: "",
    //       });
    //     }
    //   }
    // } else {
    //   res.render("login/forgetpassword.ejs", { message: "" });
    // }

    try {
      //   console.log("REQ:::", req.config);
      const { headers, method, url, params, query, body, session } = req;
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const info = {
        method,
        body,
      };
      const base64Info = await getBase64(info);
      const response = await axios({
        method,
        url: `${baseUrl}/boozly/api/forgetpassword`,
        // headers,
        // params,
        // paramsSerializer: (params) => {
        //   return qs.stringify(params, { arrayFormat: "repeat" });
        // },
        // data: body,
        params: { info: base64Info },
        // session,
      });

      if (response.status === 200) {
        if (response.data.redirect) {
          res.render(response.data.redirect);
        }
        if (response.data.render) {
          res.render(response.data.render, response.data.data);
        }
      }
    } catch (error) {
      //   console.log("Error::", error);
      if (error.response.status === 400 && error.response.data.redirect) {
        // req.flash("FlashMsg", error.response.data.data.FlashMsg);
        res.redirect(error.response.data.redirect);
      }
      if (error.response.status === 400 && error.response.data.render) {
        res.render(error.response.data.render, error.response.data.data);
      }
    }
  },

  pass(req, res) {
    var dd = Date.now() - 1000 * 60 * 10;
    var secret = process.env.JWT_SECRET || JWT_SECRET;
    var payload = jwt.decode(req.params.token, secret);
    // console.log(payload)
    // console.log(Date.now(), 'fuhf', (Date.parse(payload.token_gentime)), 'fff', dd)
    // console.log(Date.now(), 'fuhf', payload.token_gentime, 'fff', dd)

    if (true) {
      res.render("login/password_reset.ejs", {
        id: payload.id,
        token: req.params.token,
      });
    } else {
      res.send("Not valid");
    }
  },

  async resetpassword(req, res) {
    // var secret = "fe1a1915a379f3be5394b64d14794932-1506868106675";
    // var user_id;
    // var payload = jwt.decode(req.body.token, secret);

    // await knex("customers")
    //   .update({
    //     text_password: req.body.password,
    //     password: md5(req.body.password),
    //   })
    //   .where("customer_id", payload.id)
    //   .then(function (bots) {});

    // await knex("customers")
    //   .where("customer_id", payload.id)
    //   .then(function (result) {
    //     user_id = result[0].user_id || 0;
    //   });

    // await knex("owners")
    //   .update({
    //     u_password: md5(req.body.password),
    //     password: md5(req.body.password),
    //   })
    //   .where("user_id", user_id)
    //   .then(function (bots) {});

    // req.flash("FlashMsg", "Your password has been successfully changed.");
    // res.redirect("/boozly/login");

    try {
      const { headers, method, url, params, query, body, session } = req;
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const info = {
        headers,
        method,
        url,
        params,
        query,
        body,
        session,
      };
      const base64Info = await getBase64(info);
      const response = await axios({
        method: "POST",
        url: `${baseUrl}/boozly/api/resetpassword`,
        // headers,
        // params,
        // paramsSerializer: (params) => {
        //   return qs.stringify(params, { arrayFormat: "repeat" });
        // },
        data: { info: base64Info },
        // params: query,
        // session,
      });

      if (response.status === 200) {
        if (response.data.redirect) {
          req.flash("FlashMsg", response.data.data.FlashMsg);
          res.redirect(response.data.redirect);
        }
        if (response.data.render) {
          res.render(response.data.render, response.data.data);
        }
      }
    } catch (error) {
      //   console.log("Error::", error);
      if (error.response.status === 400 && error.response.data.redirect) {
        // req.flash("FlashMsg", error.response.data.data.FlashMsg);
        res.redirect(error.response.data.redirect);
      }
      if (error.response.status === 400 && error.response.data.render) {
        res.render(error.response.data.render, error.response.data.data);
      }
    }
  },

  saveaddress: async function (req, res) {
    // let user_id = req.session.user_id;
    // var address = {};
    // var address_data = [];
    // if (req.body.address1) {
    //   address_data.push(req.body.address1);
    // }
    // if (req.body.address2) {
    //   address_data.push(req.body.address2);
    // }
    // if (req.body.city) {
    //   address_data.push(req.body.city);
    // }
    // if (req.body.post_code) {
    //   address_data.push(req.body.post_code);
    // }
    // if (req.body.country) {
    //   address_data.push(req.body.country);
    // }
    // address["address"] = address_data.toString();
    // address["customer_id"] = user_id;
    // address["created"] = dategmt;
    // address["modified"] = dategmt;
    // address["active"] = 1;
    // await knex("customer_addresses")
    //   .insert(address)
    //   .then(function (bots) {});

    // await knex("customers")
    //   .where("customer_id", user_id)
    //   .update("phone", req.body.phone)
    //   .then(function (bots) {});
    // if (req.query.loc) {
    //   req.flash("FlashMsg", "Address Added Successfully");
    //   res.redirect("/boozly/myaccounts");
    // } else {
    //   req.flash("FlashMsg", "Address Updated Successfully");
    //   res.redirect("/boozly/checkout");
    // }

    try {
      const { headers, method, url, params, query, body, session } = req;
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const info = {
        query,
        body,
        session,
      };
      const base64Info = await getBase64(info);
      const response = await axios({
        method: "POST",
        url: `${baseUrl}/boozly/api/saveaddress`,
        // headers,
        // params,
        // paramsSerializer: (params) => {
        //   return qs.stringify(params, { arrayFormat: "repeat" });
        // },
        data: { info: base64Info },
        // params: query,
        // session,
      });

      if (response.status === 200) {
        if (response.data.redirect) {
          req.flash("FlashMsg", response.data.data.FlashMsg);
          res.redirect(response.data.redirect);
        }
        if (response.data.render) {
          res.render(response.data.render, response.data.data);
        }
      }
    } catch (error) {
      console.log("Error::", error);
      if (error.response.status === 400 && error.response.data.redirect) {
        // req.flash("FlashMsg", error.response.data.data.FlashMsg);
        res.redirect(error.response.data.redirect);
      }
      if (error.response.status === 400 && error.response.data.render) {
        res.render(error.response.data.render, error.response.data.data);
      }
    }
  },

  //-------------------------Wallet Pgination
  async walletpagination(req, res) {
    var offset = req.query.start;
    var limit = req.query.length;
    var count;
    var c = knex("trans_usrs").where("user_id", req.session.user_id).count("");
    var results = knex("trans_usrs")
      .where("user_id", req.session.user_id)
      .select()
      .orderBy("trans_user_id", "desc")
      .limit(Number(limit))
      .offset(Number(offset));

    await c.then(function (bots) {
      count = bots[0]["count(*)"];
    });

    var result;
    await results.then(function (resu) {
      result = resu;
    });
    var obj = {};

    var d = [];
    for (let index = 0; index < result.length; index++) {
      var data = [];
      var id = result[index].trans_user_id;
      data.push("");
      data.push(id);
      data.push(new Date(result[index].created).toDateString().slice(4));
      data.push(result[index].trans_type);
      data.push(result[index].amount);
      data.push(result[index].current_bal);
      d.push(data);
    }
    (obj["draw"] = req.query.draw),
      (obj["recordsTotal"] = count),
      (obj["recordsFiltered"] = count),
      (obj["data"] = d);
    res.send(JSON.stringify(obj));
  },

  //------------------------Booking Pgination
  async bookingpagination(req, res) {
    var offset = req.query.start;
    var limit = req.query.length;
    var count;
    var c = knex("jobs").where("user_id", req.session.user_id).count("");
    var results = knex("jobs")
      .where("user_id", req.session.user_id)
      .select()
      .orderBy("job_id", "desc")
      .limit(Number(limit))
      .offset(Number(offset));
    await c.then(function (bots) {
      count = bots[0]["count(*)"];
    });

    var result;
    await results.then(function (resu) {
      result = resu;
    });
    var obj = {};

    var d = [];
    for (let index = 0; index < result.length; index++) {
      var data = [];

      var dateTime =
        Date.parse(new Date(result[index].job_date)) +
        Number(1000 * 60 * 60 * Number(5.5));
      var id = result[index].job_id;
      data.push("");
      data.push(id);
      data.push(new Date(result[index].job_date).toDateString().slice(4));
      data.push(new Date(dateTime).toLocaleTimeString());
      data.push(result[index].job_to_loc);
      data.push(result[index].job_status.toUpperCase());
      if (
        result[index].job_status == "ongoing" ||
        result[index].job_status == "request"
      ) {
        data.push(
          '<input id="myBtn" data-toggle="modal" data-target="#myModal' +
            id +
            '" class="btn btn-danger" type="submit" value="Cancel"><div class="modal fade formd" id="myModal' +
            id +
            '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content" id="subscribe-email-form" ><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel">Are you sure ?</h4></div><div class="modal-body"><div class="md-form"><i class="fas fa-pencil prefix grey-text"></i><label data-error="wrong" name="cancel_reason" data-success="right" value=""for="form' +
            id +
            '</label>">Reason for Cancel</label><textarea type="text" name="cancel_reason" id="form' +
            id +
            '" class="md-textarea form-control" rows="4"></textarea><input type="hidden" name="id" value="' +
            id +
            '"></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button class="btn btn-default btn-danger pay" data-dismiss="modal" onclick="form_submit(' +
            id +
            ')">Cancel job</button></div></div></div>'
        );
      } else {
        data.push("");
      }

      data.push(result[index].job_reason);
      d.push(data);
    }
    (obj["draw"] = req.query.draw),
      (obj["recordsTotal"] = count),
      (obj["recordsFiltered"] = count),
      (obj["data"] = d);
    res.send(JSON.stringify(obj));
  },

  validatePromo: async function (req, res) {
    // let valid = false;
    // let value = 0;
    // let id = 0;
    // await knex
    //   .select("promo_code", "promo_id", "promo_value")
    //   .from("promos")
    //   .where("promo_code", "=", req.body.promo)
    //   .then(function (bots) {
    //     if (bots.length > 0) {
    //       valid = true;
    //       value = bots[0].promo_value;
    //       id = bots[0].promo_id;
    //     }
    //   });
    // var obj = {};
    // obj["valid"] = valid;
    // obj["value"] = value;
    // obj["promo_id"] = id;
    // res.send(obj);
    try {
      const { headers, method, url, params, query, body, session } = req;
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const info = {
        headers,
        method,
        url,
        params,
        query,
        body,
        session,
      };
      const base64Info = await getBase64(info);
      const response = await axios({
        method: "POST",
        url: `${baseUrl}/boozly/api/validatepromo`,
        // headers,
        // params,
        // paramsSerializer: (params) => {
        //   return qs.stringify(params, { arrayFormat: "repeat" });
        // },
        data: { info: base64Info },
        // params: query,
        // session,
      });

      if (response.status === 200) {
        res.send(res.data);
      }
    } catch (error) {
      //   console.log("Error::", error);
      // if (error.response.status === 400 && error.response.data.redirect) {
      // req.flash("FlashMsg", error.response.data.data.FlashMsg);
      // res.redirect(error.response.data.redirect);
      // }
      // if (error.response.status === 400 && error.response.data.render) {
      // res.render(error.response.data.render, error.response.data.data);
      // }
    }
  },

  deleteaddress: async function (req, res) {
    // await knex("customer_addresses")
    //   .where("address_id", req.params.id)
    //   .del()
    //   .then(function (bots) {});
    // req.flash("FlashMsg", "Address Deleted Successfully");
    // res.redirect("/boozly/myaccounts");
    try {
      const { headers, method, url, params, query, body, session } = req;
      const { id } = params;
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const response = await axios({
        method,
        url: `${baseUrl}/boozly/api/delete-address/${id.trim()}`,
      });

      if (response.status === 200) {
        if (response.data.redirect) {
          req.flash("FlashMsg", response.data.data.FlashMsg);
          res.redirect(response.data.redirect);
        }
        if (response.data.render) {
          res.render(response.data.render, response.data.data);
        }
      }
    } catch (error) {
      // console.log("Error::", error);
      if (error.response.status === 400 && error.response.data.redirect) {
        // req.flash("FlashMsg", error.response.data.data.FlashMsg);
        res.redirect(error.response.data.redirect);
      }
      if (error.response.status === 400 && error.response.data.render) {
        res.render(error.response.data.render, error.response.data.data);
      }
    }
  },

  logout: (req, res) => {
    req.session.destroy(function () {
      res.clearCookie('Logged');
      res.clearCookie('user_id');
      res.clearCookie('owner_id');
      res.clearCookie('u_email');
      res.clearCookie('u_fname');
      res.clearCookie('u_lname');
      res.clearCookie('u_phone');
      res.clearCookie('u_address');
      res.clearCookie('stripeCustId');
      if (ISMOBILE === "1") {
        res.redirect("/boozly/finddrink");
      } else {
        res.redirect("/boozly");
      }
    });
  },
};

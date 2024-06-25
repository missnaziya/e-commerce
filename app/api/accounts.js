const md5 = require("md5");
const nodemailer = require("nodemailer");
const dateTime = require("node-datetime");
const dt = dateTime.create();
const jwt = require("jwt-simple");
var moment = require("moment-timezone");
var moment = require("moment");

const {
  NODEMAILER_HOST,
  NODEMAILER_PORT,
  NODEMAILER_USER,
  NODEMAILER_PASSWORD,
  JWT_SECRET,
} = require("../utils/config.js");
const { getInfoFromBase64 } = require("../utils/helper.js");

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
  async myaccountsApi(req, res) {
    var flashMessage = req.flash("FlashMsg");
    let { method, body, session } = await getInfoFromBase64(
      req.params.info || req.body.info || req.query.info
    );
    var customerId = session.user_id;
    if (method == "POST") {
      var exist;
      await knex("customers")
        .where("password", md5(body["text_password"]))
        .where("text_password", body["text_password"])
        .where("customer_id", customerId)
        .then(function (bots) {
          exist = bots;
        });
      if (exist.length > 0) {
        await knex("customers")
          .where("email", body["email"])
          .whereNot("customer_id", customerId)
          .then(function (bots) {
            exist = bots;
          });
        if (exist.length > 0) {
          flashMessage =
            "Sorry, but that email address is already in use, please try another. Alternatively, if you think you may have already registered, you can try logging in.";
        } else {
          delete body.text_password;
          delete body.customer_id;
          body["name"] = body["fname"] + " " + body["lname"];
          body["modified"] = dategmt;
          await knex("customers")
            .update(body)
            .where("customer_id", customerId)
            .then(function (bots) {
              data = bots[0];
            });
          var owner = {};
          owner["u_name"] = body["fname"] + " " + body["lname"];
          owner["u_fname"] = body["fname"];
          owner["u_lname"] = body["lname"];
          owner["u_phone"] = body["phone"];
          owner["u_email"] = body["email"];
          await knex("owners")
            .update(owner)
            .where("user_id", body["user_id"])
            .then(function (result) {});
        }
      } else {
        flashMessage =
          "Sorry, but the password you have entered does not match our records. Please try again.";
      }
    }

    var data;
    var orders;
    var ordersdetails;
    var pastorders;
    var pastordersdetails;
    await knex("customers")
      .select()
      .leftJoin(
        "customer_addresses as cs",
        "cs.customer_id",
        "=",
        "customers.customer_id"
      )
      .where("customers.customer_id", customerId)
      .orderBy("cs.address_id", "desc")
      .then(function (bots) {
        data = bots[0];
      });

    var pastallorderquery = knex("orders as o")
      .select("o.*", "s.*", "o.total_amount as total_cost")
      .leftJoin("stores as s", "o.store_id", "=", "s.store_id")
      .where("o.customer_id", customerId)
      .whereIn("order_status", [
        "new",
        "pending",
        "accept",
        "out_delivery",
        "ready",
        "arrive",
      ])
      .orderBy("o.order_id", "desc");
    await pastallorderquery.then(function (bots) {
      orders = bots;
    });

    var orderallquery = knex("order_details as od")
      .select(
        "od.price as cost",
        "o.total_amount as total_cost",
        "o.*",
        "od.*",
        "s.*",
        "v.*",
        "p.*",
        "u.name as unit",
        "pkg.name as package"
      )
      .leftJoin("orders as o", "o.order_id", "=", "od.order_id")
      .leftJoin("products as p", "p.product_id", "=", "od.product_id")
      .leftJoin("stores as s", "o.store_id", "=", "s.store_id")
      .leftJoin("variations as v", "v.variation_id", "=", "od.variation_id")
      .leftJoin("units as u", "v.unit_id", "=", "u.id")
      .leftJoin("packages as pkg", "v.packaging_id", "=", "pkg.id")
      .where("o.customer_id", customerId)
      .whereIn("order_status", [
        "new",
        "pending",
        "accept",
        "out_delivery",
        "ready",
        "arrive",
      ])
      .orderBy("o.order_date", "desc");
    await orderallquery.then(function (bots) {
      ordersdetails = bots;
    });

    var pastallorderquery = knex("orders as o")
      .select("o.*", "s.*", "o.total_amount as total_cost")
      .leftJoin("stores as s", "o.store_id", "=", "s.store_id")
      .where("o.customer_id", customerId)
      .whereIn("order_status", ["completed", "cancel", "delivered"])
      .orderBy("o.order_id", "desc");
    await pastallorderquery.then(function (bots) {
      pastorders = bots;
    });

    var pastorderquery = knex("order_details as od")
      .select(
        "od.price as cost",
        "o.total_amount as total_cost",
        "o.*",
        "od.*",
        "s.*",
        "v.*",
        "p.*",
        "u.name as unit",
        "pkg.name as package"
      )
      .leftJoin("orders as o", "o.order_id", "=", "od.order_id")
      .leftJoin("products as p", "p.product_id", "=", "od.product_id")
      .leftJoin("stores as s", "o.store_id", "=", "s.store_id")
      .leftJoin("variations as v", "v.variation_id", "=", "od.variation_id")
      .leftJoin("units as u", "v.unit_id", "=", "u.id")
      .leftJoin("packages as pkg", "v.packaging_id", "=", "pkg.id")
      .where("o.customer_id", customerId)
      .whereIn("order_status", ["completed", "cancel", "delivered"])
      .orderBy("o.order_date", "desc");

    await pastorderquery.then(function (bots) {
      pastordersdetails = bots;
    });

    var address;

    await knex("customers")
      .select()
      .leftJoin(
        "customer_addresses as cs",
        "cs.customer_id",
        "=",
        "customers.customer_id"
      )
      .where("customers.customer_id", customerId)
      .orderBy("cs.address_id", "desc")
      .then(function (bots) {
        address = bots;
      });

    var result = ordersdetails.reduce(function (r, a) {
      if (a.is_delete != 1) {
        r[a.order_id] = r[a.order_id] || [];
        var stillUtc = moment.utc(a.order_date).toDate();
        var local = moment(a.order_date).local().format("DD MMMM YYYY HH:mm a");
        a.order_date = local;
        r[a.order_id].push(a);
      }
      return r;
    }, {});

    var pastOrderResult = pastorders;
    var openOrderResult = orders;
    //pastOrderResult.ksort();
    //console.log(pastorders);

    var presult = pastordersdetails.reduce(function (r, a) {
      if (a.is_delete != 1) {
        r[a.order_id] = r[a.order_id] || [];
        var local = moment(a.order_date).local().format("DD MMMM YYYY HH:mm a");
        a.order_date = local;
        r[a.order_id].push(a);
      }
      return r;
    }, {});

    res.status(200).send({
      render: "myaccounts/myaccounts.ejs",
      data: {
        FlashMsg: flashMessage,
        pastorders: presult,
        succesMsg: req.flash("succesMsg"),
        message: "",
        orders: result,
        data,
        address,
        pastOrderResult,
        openOrderResult,
      },
    });
  },

  async placeorderApi(req, res) {
    const { body, session, cookies } = await getInfoFromBase64(
      req.body.info || req.params.info || req.query.info
    );
    var Id = session.user_id;
    var user_id = session.owner_id;
    var cart = session.cart;
    var order_details = {};
    var store_id = cookies.store_id;
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
      .where("promo_code", "=", body.formdata.promocode)
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
    var tip = body.formdata.tip || 0;
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
    order_details["order_type"] = body.formdata.order_type;

    if (body.formdata.order_type == "Pickup") {
      order_details["order_notes"] = body.formdata.c_note;
    }
    if (body.formdata.order_type == "Delivery") {
      order_details["order_notes"] = body.formdata.d_note;
    }
    order_details["order_status"] = "new";
    order_details["payment_status"] = "Unpaid";
    order_details["created"] = dategmt;
    order_details["modified"] = dategmt;
    order_details["address_id"] = body.formdata.addressId;
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

    var customerName = session.u_fname + " " + session.u_lname;
    customerName = customerName.trim();
    //--------------------------------
    //console.log(req.session.stripeCustId);
    if (
      false &&
      session.stripeCustId != null &&
      session.stripeCustId != "null" &&
      session.stripeCustId != ""
    ) {
      stripe.charges
        .create({
          amount: order_details["total_amount"] * 100,
          description: "Boozly Order",
          currency: "GBP",
          customer: session.stripeCustId,
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
          (session.cart = []),
            (obj = {}),
            (obj["order_id"] = order_id),
            res.send(obj);
        })
        .catch((err) => {
          (obj = {}), (obj["error"] = err), res.status(200).send(obj);
        });
    } else {
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
      (session.cart = []),
        (obj = {}),
        (obj["order_id"] = order_id),
        res.status(200).send(obj);
    }
  },

  async validatePromoApi(req, res) {
    const { headers, method, url, params, query, body, session } =
      await getInfoFromBase64(req.body.info);
    let valid = false;
    let value = 0;
    let id = 0;

    await knex
      .select("promo_code", "promo_id", "promo_value")
      .from("promos")
      .where("promo_code", "=", body.promo)
      .then(function (bots) {
        if (bots.length > 0) {
          valid = true;
          value = bots[0].promo_value;
          id = bots[0].promo_id;
        }
      });
    var obj = {};
    obj["valid"] = valid;
    obj["value"] = value;
    obj["promo_id"] = id;

    res.status(200).send(obj);
  },

  async forgetpasswordApi(req, res) {
    const { method, body } = await getInfoFromBase64(req.query.info);

    if (method == "POST") {
      if (body.email !== undefined) {
        var emailAddress = body.email;
        var result;
        var query = knex("customers").where("email", emailAddress);

        await query.then(function (bots) {
          result = bots;
        });

        if (result.length > 0) {
          var payload = {
            id: result[0].customer_id, // User ID from database
            email: emailAddress,
            token_gentime: dt.format("Y-m-d H:M:S"),
          };

          var secret = process.env.JWT_SECRET || JWT_SECRET;

          var token = jwt.encode(payload, secret);

          var mailOptions = {
            from: "hr@grepixit.com",
            to: emailAddress,
            cc: "vinner.2112@gmail.com",
            subject: "Change your password",
            // html: '<p>Click <a href="http://139.59.87.114:2105/boozly/resetpassword/' + payload.id + "/" + token + '">here</a> to reset your password</p>'
            html:
              '<html><head><link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600&display=swap" rel="stylesheet"></head><body><center><div class=""><div class="aHl"></div><div id=":oz" tabindex="-1"></div><div id=":ob" class="ii gt"><div id=":oc" class="a3s aXjCH msg-6654097468040732516"><u></u><div style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div style="min-width:100%;width:100%;background-color:#ffffff"><table class="m_-6654097468040732516email" style="width:100%;max-width:600px;margin-left:auto;margin-right:auto;padding-left:20px;padding-right:20px;padding-bottom:0px;color:#333332;line-height:1.4;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Ubuntu","Open Sans","Helvetica Neue",sans-serif;background:#ffffff"><tbody><tr><td style="min-width:100%;width:100%;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px"><div style="text-align:center"><img src="http://139.59.87.114:2105/assets/images/logo/01.png" alt="Boozly" width="200" style="width:200px;padding-top:30px;padding-bottom:30px"></div></td></tr></tbody></table></div><table class="m_-6654097468040732516email" style="width:100%;max-width:600px;margin-left:auto;margin-right:auto;padding-left:20px;padding-right:20px;padding-bottom:20px;color:#333332;line-height:1.4;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Ubuntu","Open Sans","Helvetica Neue",sans-serif;background:#ffffff"><tbody><tr><td style="min-width:100%;width:100%;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px"><h1 style="font-family: Quicksand, sans-serif;color:#333332;font-size:32px;font-weight:600;line-height:1.2;margin-bottom:20px;text-align:center;">Change your password.</h1><p style="margin-top:0;margin-bottom:20px;font-family: Quicksand, sans-serif;text-align:center;font-size: medium;font-style: normal;">We received a request to change your password for your Boozly account.</p><p style="margin-top:0;margin-bottom:20px;text-align:center"><a href="http://139.59.87.114:2105/boozly/resetpassword/' +
              payload.id +
              "/" +
              token +
              '" style="color:#ffffff;text-decoration:none;display:inline-block;height:38px;line-height:38px;padding-top:0;font-family: Quicksand, sans-serif;padding-right:24px;padding-bottom:0;padding-left:24px;border:0;outline:0;background-color:#fb524f;font-size:14px;font-style:normal;font-weight:600;text-align:center;white-space:nowrap;border-radius:4px;margin-top:35px;margin-bottom:35px">Change your password</a></p><div class="m_-6654097468040732516email-disclaimer" style="color:#b3b3b1;font-size:14px;text-align:center;margin-top:0px;margin-right:0;margin-bottom:50px;margin-left:0;font-family: Times;">If you did not make this request, you can safely ignore this email.</div></div></div></td></tr></tbody></table><div style="min-width:100%;width:100%;background-color:#ffffff"><table class="m_-6654097468040732516email" style="width:100%;max-width:600px;margin-left:auto;margin-right:auto;padding-left:20px;padding-right:20px;padding-bottom:20px;color:#333332;line-height:1.4;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Ubuntu","Open Sans","Helvetica Neue",sans-serif;background:#ffffff;background-color:#ffffff"><tbody><tr><td><div style="padding-top:15px;padding-right:0;padding-bottom:0;padding-left:0;margin-top:0px;color:rgba(0,0,0,0.68);font-size:12px;text-align:center;border-top:1px solid #8e8e8e;font-family: Times;">Sent by <a href="http://139.59.87.114:2105/boozly">Boozly</a>  Silicon Oasis Dubai, UAE <a href="javascript:void(0);">Privacy policy</a></div></td></tr></tbody></table></div><div class="yj6qo"></div><div class="adL"></div></div><div class="adL"></div></div></div><div id=":ou" class="ii gt" style="display:none"><div id=":ov" class="a3s aXjCH undefined"></div></div><div class="hi"></div></div></center></body></html>',
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              res.status(400).send({
                render: "login/forgetpassword.ejs",
                data: {
                  message: "Server Error Try after some time " + error,
                  err_msg: "",
                  email_exist: "",
                  oldData: "",
                },
              });
            }
            if (info) {
              console.log(info);
              res.status(200).send({
                render: "login/forgetpassword.ejs",
                data: {
                  message: "Password reset link has been sent to your email",
                  err_msg: "",
                  email_exist: "",
                  oldData: "",
                },
              });
            }
          });
        } else {
          res.status(400).send({
            render: "login/forgetpassword.ejs",
            data: {
              message: "Invalid Email ",
              err_msg: "",
              email_exist: "",
              oldData: "",
            },
          });
        }
      }
    } else {
      res
        .status(200)
        .send({ render: "login/forgetpassword.ejs", data: { message: "" } });
    }
  },

  async resetPasswordApi(req, res) {
    const { headers, method, url, params, body, session } =
      await getInfoFromBase64(req.body.info);
    var secret = process.env.JWT_SECRET || JWT_SECRET;
    var user_id;
    var payload = jwt.decode(body.token, secret);

    await knex("customers")
      .update({
        text_password: body.password,
        password: md5(body.password),
      })
      .where("customer_id", payload.id)
      .then(function (bots) {});

    await knex("customers")
      .where("customer_id", payload.id)
      .then(function (result) {
        user_id = result[0].user_id || 0;
      });

    await knex("owners")
      .update({
        u_password: md5(body.password),
        password: md5(body.password),
      })
      .where("user_id", user_id)
      .then(function (bots) {});

    res.status(200).send({
      redirect: "/boozly/login",
      data: {
        Flash: "Your password has been successfully changed.",
      },
    });
  },

  async saveAddressApi(req, res) {
    const { query, body, session } = await getInfoFromBase64(req.body.info);
    let user_id = session.user_id;
    var address = {};
    var address_data = [];
    if (body.address1) {
      address_data.push(body.address1);
    }
    if (body.address2) {
      address_data.push(body.address2);
    }
    if (body.city) {
      address_data.push(body.city);
    }
    if (body.post_code) {
      address_data.push(body.post_code);
    }
    if (body.country) {
      address_data.push(body.country);
    }
    address["address"] = address_data.toString();
    address["customer_id"] = user_id;
    address["created"] = dategmt;
    address["modified"] = dategmt;
    address["active"] = 1;
    await knex("customer_addresses")
      .insert(address)
      .then(function (bots) {});

    await knex("customers")
      .where("customer_id", user_id)
      .update("phone", body.phone)
      .then(function (bots) {});

    if (query.loc) {
      res.status(200).send({
        redirect: "/boozly/myaccounts",
        data: {
          FlashMsg: "Address Added Successfully",
        },
      });
    } else {
      res.status(200).send({
        redirect: "/boozly/checkout",
        data: {
          FlashMsg: "Address Updated Successfully",
        },
      });
    }
  },

  async deleteAddressApi(req, res) {
    await knex("customer_addresses")
      .where("address_id", req.params.id)
      .del()
      .then(function (bots) {});

    res.status(200).send({
      redirect: "/boozly/myaccounts",
      data: {
        FlashMsg: "Address Deleted Successfully",
      },
    });
  },
};

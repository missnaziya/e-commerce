const { sendEmailVerification, getInfoFromBase64 } = require("../utils/helper");
const md5 = require("md5");
const dateTime = require("node-datetime");
const dt = dateTime.create();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config.js");

module.exports = {
  userLoginApi: (req, res) => {
    let email = req.body.email;
    let pass = req.body.password;

    knex("customers")
      .select("customers.*", "customers.customer_id as id", "cs.*")
      .leftJoin(
        "customer_addresses as cs",
        "cs.customer_id",
        "=",
        "customers.customer_id"
      )
      .where("email", "=", email)
      .where("customers.is_delete", "0")
      .then(async function (user) {
        if (user.length < 1) {
          res.status(400).send({
            redirect: "/boozly/login",
            data: {
              FlashMsg:
                "Sorry, but we couldn’t find that email address in our records. Please try another.",
            },
          });
          // res.redirect("/boozly/login");
        } else if (user[0].text_password != pass) {
          res.status(400).send({
            redirect: "/boozly/login",
            data: {
              FlashMsg:
                "Sorry, but the password you have entered does not match our records. Please try again.",
            },
          });

          // res.redirect("/boozly/login");
        } else if (user[0].is_verified != 1) {
          gID = user[0].id;
          var payload = {
            id: gID, // User ID from database
            email: email,
            token_gentime: dt.format("Y-m-d H:M:S"),
          };
          var response = await sendEmailVerification(payload, email);
          if (response) {
            console.log("response", response);
            res.status(400).send({
              render: "login/login.ejs",
              data: {
                FlashMsg: "Server Error Try after some time",
                err_msg: "",
                email_exist: "",
                oldData: "",
                register: false,
              },
            });
          } else {
            res
              .status(400)
              .send({ render: "login/getverified.ejs", data: { email } });
          }
        } else {
          res.status(200).send({ user });
        }
      });
  },

  async getRegistrationApi(req, res) {
    if (req.method == "POST") {
      var exist;
      var email = req.body.email;
      await knex("customers")
        .where("email", email)
        .then(function (bots) {
          exist = bots;
        });
      if (exist.length > 0) {
        res.status(400).send({
          render: "login/login.ejs",
          data: {
            FlashMsg:
              "Sorry, but that email address is already in use, please try another. Alternatively, if you think you may have already registered, you can try logging in.",
            oldData: req.body,
            register: true,
          },
        });
      } else {
        var owner = {};
        var user_id;
        delete req.body.privacy;
        delete req.body.term;

        owner["api_key"] = md5(req.body["email"]);
        owner["group_id"] = 2;
        owner["username"] = req.body["email"];
        owner["password"] = md5(req.body["password"]);
        owner["u_name"] = req.body["fname"] + " " + req.body["lname"];
        owner["u_fname"] = req.body["fname"];
        owner["u_lname"] = req.body["lname"];
        owner["u_password"] = md5(req.body["password"]);
        owner["u_phone"] = " ";
        owner["ref_id"] = 0;
        owner["u_email"] = req.body["email"];
        owner["u_created"] = dategmt;
        owner["u_modified"] = dategmt;
        owner["u_street"] = "";
        owner["u_address"] = "";
        owner["u_city"] = "";
        owner["u_country"] = "";
        owner["u_zip"] = "";
        owner["active"] = 1;
        await knex("owners")
          .insert(owner)
          .then(function (result) {
            user_id = result[0];
          });

        req.body["name"] = req.body["fname"] + " " + req.body["lname"];
        req.body["created"] = dategmt;
        req.body["user_id"] = user_id;
        req.body["modified"] = dategmt;

        req.body["text_password"] = req.body["password"];
        req.body["password"] = md5(req.body["password"]);
        req.body["phone"] = " ";
        req.body["active"] = 1;
        req.body["is_delete"] = 0;
        await knex("customers")
          .insert([req.body])
          .then(function (result) {
            customer_id = result[0];
          });

        knex("customers")
          .select("customers.*", "customers.customer_id as id", "cs.*")
          .leftJoin(
            "customer_addresses as cs",
            "cs.customer_id",
            "=",
            "customers.customer_id"
          )
          .where("email", "=", req.body["email"])
          .then(async function (user) {
            // req.session.Logged = true;
            // req.session.user_id = user[0].id;
            // req.session.owner_id = user[0].user_id;
            // req.session.u_email = user[0].email;
            // req.session.u_fname = user[0].fname;
            // req.session.u_lname = user[0].lname;
            // req.session.u_phone = user[0].phone;
            // req.session.u_address = user[0].address;

            if (user.length > 0) {
              var payload = {
                id: user[0].id, // User ID from database
                email: user[0].email,
                token_gentime: dt.format("Y-m-d H:M:S"),
              };

              var response = await sendEmailVerification(payload, email);
              if (response) {
                res.status(400).send({
                  render: "login/login.ejs",
                  data: {
                    FlashMsg: "Server Error Try after some time",
                    err_msg: "",
                    email_exist: "",
                    oldData: "",
                    register: false,
                  },
                });
              } else {
                res.status(200).send({
                  render: "login/getverified.ejs",
                  data: { email: email },
                });
              }
            }

            //             // if (req.session.cart) {
            //             //     res.redirect('/boozly/checkout');
            //             // } else {

            //             //     res.redirect('/boozly');
            //             // }
          });
        //         // req.flash('FlashMsg', 'Congratulations, your account has been successfully created');
        //         // res.redirect('/boozly/login')
      }
    } else {
      res.status(200).send({
        render: "login/login.ejs",
        data: {
          FlashMsg: req.flash("FlashMsg"),
          oldData: "",
          register: true,
        },
      });
    }
  },

  async verifyApi(req, res) {
    var secret = process.env.JWT_SECRET || JWT_SECRET;
    var payload = jwt.decode(req.params.token, secret);
    var id = payload.id;

    await knex("customers")
      .select("customers.*", "customers.customer_id as id", "cs.*")
      .leftJoin(
        "customer_addresses as cs",
        "cs.customer_id",
        "=",
        "customers.customer_id"
      )
      .where("customers.customer_id", id)
      .where("customers.is_delete", "0")
      .then(function (user) {
        if (user.length < 1) {
          res.status(404).send({
            redirect: "/boozly/login",
            data: {
              FlashMsg:
                "Sorry, but we couldn’t find that email address in our records. Please try another.",
            },
          });
        } else {
          var FirstName = user[0].fname;
          knex("customers")
            .update("is_verified", 1)
            .where("customer_id", id)
            .then(function (result) {
              res.status(200).send({
                render: "myaccounts/verify.ejs",
                data: { fName: FirstName },
              });
            });
        }
      });
  },

  async getVerifiedApi(req, res) {
    const { headers, method, url, params, query, body, session } =
      await getInfoFromBase64(req.body.info);

    let gemail = body.email;
    let gID = session.user_id;

    if (gID != 0 && gemail) {
      var payload = {
        id: gID, // User ID from database
        email: gemail,
        token_gentime: dt.format("Y-m-d H:M:S"),
      };

      var response = await sendEmailVerification(payload, gemail);
      if (response) {
        res.status(400).send({
          render: "login/getverified.ejs",
          data: {
            FlashMsg: "Server Error Try after some time",
            err_msg: "",
            email_exist: "",
            oldData: "",
            register: false,
          },
        });
      } else {
        res
          .status(200)
          .send({ render: "login/getverified.ejs", data: { email: gemail } });
      }
    } else {
      res.status(400).send({
        render: "login/login.ejs",
        data: {
          FlashMsg: "Server Error Try after some time",
          err_msg: "",
          email_exist: "",
          oldData: "",
          register: false,
        },
      });
    }
  },
};

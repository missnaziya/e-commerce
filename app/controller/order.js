var dropdown = require("../model/dropdown");
var md5 = require("md5");
var moment = require("moment");
var dateTime = require("node-datetime");
var dt = dateTime.create();
const axios = require("axios");
const qs = require("qs");
const { APP_BASE_URL } = require("../utils/config.js");
const { getBase64 } = require("../utils/helper");

var cat = [],
  sub_cat = [];
var limit = 6;
var offset = 0;
var sortby;
var search = [];

module.exports = {
  async cartdata(req, res) {
    res.send(req.session.cart);
  },

  async getHomePage(req, res) {

        // Check if data is available in the cookies
        if (req.cookies.Logged) {
          // If 'Logged' cookie is present, set all session values from cookies
          req.session.Logged = req.cookies.Logged;
          req.session.user_id = req.cookies.user_id;
          req.session.owner_id = req.cookies.owner_id;
          req.session.u_email = req.cookies.u_email;
          req.session.u_fname = req.cookies.u_fname;
          req.session.u_lname = req.cookies.u_lname;
          req.session.u_phone = req.cookies.u_phone;
          req.session.u_address = req.cookies.u_address;
          req.session.stripeCustId = req.cookies.stripeCustId;
        }
    

    // var pincode = req.cookies.pincode;
    // search = [];
    // var storeName = [];
    // var store_id = req.cookies.store_id || 0;
    // var fstore_id = req.cookies.fstore_id || 0;
    // var storeExist = req.cookies.store || "";
    // var storeErr = req.cookies.store_err || 1;
    // if (
    //   store_id == 0 ||
    //   store_id == "" ||
    //   fstore_id == 0 ||
    //   fstore_id == "" ||
    //   storeExist != "exist"
    // ) {
    //   res.cookie("store_id", req.body.store_id, {
    //     maxAge: 0, // 24 hours
    //     httpOnly: true,
    //   });
    //   res.cookie("fstore_id", req.body.store_id, {
    //     maxAge: 0, // 24 hours
    //     httpOnly: false,
    //   });
    //   res.cookie("store", "exist", {
    //     maxAge: 0, // 24 hours
    //     httpOnly: false,
    //   });
    // }
    // if (store_id) {
    //   await knex("stores")
    //     .where("store_id", store_id)
    //     .then(function (bots) {
    //       storeName = bots;
    //     });
    // }
    // res.render("static/index.ejs", {
    //   pincode: pincode || "",
    //   FlashMsg: req.flash("FlashMsg"),
    //   storeName: storeName,
    //   storeID: store_id,
    //   storeErr: storeErr,
    // });

    try {
      //   console.log("REQ:::", req.config);
      const { headers, method, url, params, query, body, session, cookies } =
        req;
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const info = {
        body,
        cookies,
      };
      const base64Info = await getBase64(info);
      const response = await axios({
        method,
        url: `${baseUrl}/boozly/api/home`,
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
      console.log("Error::", error.message);
      if (error.response.status === 400 && error.response.data.redirect) {
        // req.flash("FlashMsg", error.response.data.data.FlashMsg);
        res.redirect(error.response.data.redirect);
      }
      if (error.response.status === 400 && error.response.data.render) {
        res.render(error.response.data.render, error.response.data.data);
      }
    }
  },

  //----------GET CONTACT US PAGE
  async getStores(req, res) {
    // var stores;
    // await knex("stores").then(function (bots) {
    //   stores = bots;
    // });
    // res.send(stores);
    try {
      //   console.log("REQ:::", req.config);
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const response = await axios({
        method: "GET",
        url: `${baseUrl}/boozly/api/store`,
      });

      if (response.status === 200) {
        res.send(response.data);
      }
    } catch (error) {
      // console.log("Error::", error.message);
      res.send([]);
    }
  },

  async checkoutPage(req, res) {
    // var cart = req.session.cart || [];
    // var store_id = req.cookies.store_id || 0;
    // var fstore_id = req.cookies.fstore_id || 0;
    // var storeExist = req.cookies.store || "";
    // var storeName = [];
    // if (
    //   store_id == 0 ||
    //   store_id == "" ||
    //   fstore_id == 0 ||
    //   fstore_id == "" ||
    //   storeExist != "exist"
    // ) {
    //   res.cookie("store_id", req.body.store_id, {
    //     maxAge: 0, // 24 hours
    //     httpOnly: true,
    //   });
    //   res.cookie("fstore_id", req.body.store_id, {
    //     maxAge: 0, // 24 hours
    //     httpOnly: false,
    //   });
    //   res.cookie("store", "exist", {
    //     maxAge: 0, // 24 hours
    //     httpOnly: false,
    //   });
    //   res.redirect("/boozly/");
    // }
    // if (cart.length > 0) {
    //   if (store_id) {
    //     await knex("stores")
    //       .where("store_id", store_id)
    //       .then(function (bots) {
    //         storeName = bots;
    //       });
    //   }
    //   var total = 0;
    //   var addresses;
    //   var tip;
    //   await knex("customer_addresses")
    //     .where("customer_id", req.session.user_id)
    //     .orderBy("address_id", "desc")
    //     .then(function (bots) {
    //       addresses = bots;
    //     });
    //   await knex("tips")
    //     .where("is_delete", 0)
    //     .then(function (bots) {
    //       tip = bots;
    //     });
    //   cart.forEach(function (element) {
    //     total += Number(element["total_price"]);
    //   });

    //   var taxes = Number((total * tax) / 100);

    //   res.render("orders/checkout.ejs", {
    //     cart: cart,
    //     sub_total: total,
    //     total: Number(total) + Number(deliver_charges),
    //     taxes,
    //     addresses,
    //     tip,
    //     storeName: storeName,
    //     storeID: store_id,
    //   });
    // } else {
    //   res.redirect("/boozly/finddrink");
    // }

    try {
      var store_id = req.cookies.store_id || 0;
      var fstore_id = req.cookies.fstore_id || 0;
      var storeExist = req.cookies.store || "";

      if (
        store_id == 0 ||
        store_id == "" ||
        fstore_id == 0 ||
        fstore_id == "" ||
        storeExist != "exist"
      ) {
        res.cookie("store_id", req.body.store_id, {
          maxAge: 0, // 24 hours
          httpOnly: true,
        });
        res.cookie("fstore_id", req.body.store_id, {
          maxAge: 0, // 24 hours
          httpOnly: false,
        });
        res.cookie("store", "exist", {
          maxAge: 0, // 24 hours
          httpOnly: false,
        });
        if (ISMOBILE === "1") {
          res.redirect("/boozly/finddrink");
        } else {
          res.redirect("/boozly");
        }
      }

      //   console.log("REQ:::", req.config);
      const { headers, method, url, params, query, body, session, cookies } =
        req;
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const base64Info = await getBase64({
        session,
        cookies,
      });
      const response = await axios({
        method: "GET",
        url: `${baseUrl}/boozly/api/checkout`,
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

  //------------Get product Page

  async getProductsPage(req, res) {
    // var store_id = req.cookies.store_id || 0;
    // var fstore_id = req.cookies.fstore_id || 0;
    // var storeExist = req.cookies.store || "";
    // if (
    //   store_id == 0 ||
    //   store_id == "" ||
    //   fstore_id == 0 ||
    //   fstore_id == "" ||
    //   storeExist != "exist"
    // ) {
    //   res.cookie("store_id", req.body.store_id, {
    //     maxAge: 0, // 24 hours
    //     httpOnly: true,
    //   });
    //   res.cookie("fstore_id", req.body.store_id, {
    //     maxAge: 0, // 24 hours
    //     httpOnly: false,
    //   });
    //   res.cookie("store", "exist", {
    //     maxAge: 0, // 24 hours
    //     httpOnly: false,
    //   });
    //   res.redirect("/boozly/");
    // }

    // if (req.body.type) {
    //   search = [];
    //   cat = [];
    //   sub_cat = [];
    //   search.push(req.body.type);
    // } else {
    //   search = [];
    // }

    // limit = 6;
    // offset = 0;
    // (cat = []), (sub_cat = []);
    // dropdown.category_dropdown(async function (category) {
    //   if (req.cookies.store_id) {
    //     var store_id = req.cookies.store_id;
    //   } else {
    //     var store_id = 0;
    //   }
    //   const page = 2;
    //   let store;
    //   let pagebtn;
    //   let total_prod;
    //   await knex("stores")
    //     .where("store_id", store_id)
    //     .then(function (bots) {
    //       store = bots[0];
    //     });
    //   await knex("products as p")
    //     .leftJoin("store_products as sp", "p.product_id", "=", "sp.product_id")
    //     .where("sp.store_id", store_id)
    //     .count()
    //     .where("store_id", store_id)
    //     .then(function (bots) {
    //       total_prod = bots[0]["count(*)"];
    //     });
    //   if (total_prod > limit) {
    //     pagebtn = "yes";
    //   } else {
    //     pagebtn = "no";
    //   }

    //   // console.log("INFO:::", {
    //   //   category: category,
    //   //   currentPage: page,
    //   //   pagebtn,
    //   //   search: search.toString(),
    //   //   store: store,
    //   //   FlashMsg: req.flash("FlashMsg"),
    //   //   storeID: store_id,
    //   // });

    //   res.render("orders/getproducts.ejs", {
    //     category: category,
    //     currentPage: page,
    //     pagebtn,
    //     search: search.toString(),
    //     store: store,
    //     FlashMsg: req.flash("FlashMsg"),
    //     storeID: store_id,
    //   });
    // }, req.cookies.store_id || 0);
    try {
      const { headers, method, url, params, query, body, session, cookies } =
        req;
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const base64Info = await getBase64({
        body,
        cookies,
      });
      const response = await axios({
        method,
        url: `${baseUrl}/boozly/api/finddrink`,
        params: { info: base64Info },
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
      console.log("Error::", error.message);
      if (error.response.status === 400 && error.response.data.redirect) {
        // req.flash("FlashMsg", error.response.data.data.FlashMsg);
        res.redirect(error.response.data.redirect);
      }
      if (error.response.status === 400 && error.response.data.render) {
        res.render(error.response.data.render, error.response.data.data);
      }
    }
  },

  //--------------------- Save Orders
  async setStoreId(req, res) {
    req.session.cart = [];
    var stores = [];
    var error = 0;
    if (
      req.body.store_id &&
      req.body.store_id != "0" &&
      req.body.store_id != ""
    ) {
      res.cookie("store_id", req.body.store_id, {
        maxAge: 86400 * 1000, // 24 hours
        httpOnly: true,
      });
      res.cookie("fstore_id", req.body.store_id, {
        maxAge: 86400 * 1000, // 24 hours
        httpOnly: false,
      });
      res.cookie("store_err", error, {
        maxAge: 0, // 24 hours
        httpOnly: true,
      });
      res.cookie("store", "exist", {
        maxAge: 86400 * 1000, // 24 hours
        httpOnly: false,
      });

      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const response = await axios({
        method: "GET",
        url: `${baseUrl}/boozly/api/store`,
        params: { store_id: req.body.store_id },
      });

      if (response.status === 200) {
        stores = response.data;
      }
    } else {
      error = 1;
      res.cookie("store_id", req.body.store_id, {
        maxAge: 0, // 24 hours
        httpOnly: true,
      });
      res.cookie("store_err", error, {
        maxAge: 0, // 24 hours
        httpOnly: true,
      });
      res.cookie("fstore_id", req.body.store_id, {
        maxAge: 0, // 24 hours
        httpOnly: false,
      });
      res.cookie("store", "exist", {
        maxAge: 0, // 24 hours
        httpOnly: false,
      });
    }

    req.session.cart = [];
    req.flash("FlashMsg", stores);
    //res.render(req.body.url, { error: error });
    res.redirect(req.body.url);
  },

  ///-----------------------------Get  product Ajax
  async getproductsajax(req, res) {
    // var store_id = req.cookies.store_id || 0;

    // var products;
    // // var limit = Number(req.body.limits)*ITEMS_PER_PAGE || ITEMS_PER_PAGE;
    // var ddd;
    // var prod_id = [];
    // var product_sstore = knex
    //   .select()
    //   .from("store_products")
    //   .where("store_id", store_id);

    // await product_sstore.then(async function (bots) {
    //   ddd = bots;
    // });

    // // console.log("Check", ddd);

    // for (let i = 0; i < ddd.length; i++) {
    //   prod_id.push(ddd[i].product_id);
    // }

    // if (req.body.search != undefined) {
    //   var a = [];
    //   var a = req.body.search.split(",");

    //   if (req.body.search != "") {
    //     search = a;
    //   } else {
    //     search = [];
    //   }
    //   limit = 6;
    //   offset = 0;
    // }

    // if (req.body.id) {
    //   limit = 6;
    //   offset = 0;
    // }

    // // filter category based on selected category
    // if (req.body.id) {
    //   var filter = req.body.id.split("_");
    //   if (filter) {
    //     limit = 6;
    //     offset = 0;
    //   }
    // }

    // var rest_count = knex
    //   .count()
    //   .from("store_products as sp")
    //   .leftJoin("products as p", "p.product_id", "=", "sp.product_id")
    //   .leftJoin("variations as v", "sp.variation_id", "=", "v.variation_id")
    //   .leftJoin("images as i", "v.image_id", "=", "i.image_id")
    //   .leftJoin("categories as c", "p.category_id", "=", "c.category_id")
    //   .leftJoin("categories as cs", "p.sub_category_id", "=", "cs.category_id")
    //   .where("p.is_delete", 0)
    //   .andWhere("sp.store_id", store_id)
    //   .andWhere("sp.is_available", 1)
    //   .whereIn("p.product_id", prod_id);

    // var rest = knex
    //   .select(
    //     "p.product_id",
    //     "p.slug",
    //     "p.category_id",
    //     "sp.store_id",
    //     "c.category_id",
    //     "p.sub_category_id",
    //     "p.is_delete",
    //     "sp.price as value",
    //     "c.cat_name as cat_name",
    //     "cs.cat_name as subcat_name",
    //     "title",
    //     "description",
    //     "sp.is_default",
    //     "v.variation_id",
    //     "v.image_id",
    //     "size",
    //     "i.image_id",
    //     "unit_id",
    //     "packaging_id",
    //     "qty_per_pack",
    //     "v.price",
    //     "img_name",
    //     "img_path"
    //   )
    //   .from("store_products as sp")
    //   .leftJoin("products as p", "p.product_id", "=", "sp.product_id")
    //   .leftJoin("variations as v", "sp.variation_id", "=", "v.variation_id")
    //   .leftJoin("images as i", "v.image_id", "=", "i.image_id")
    //   .leftJoin("categories as c", "p.category_id", "=", "c.category_id")
    //   .leftJoin("categories as cs", "p.sub_category_id", "=", "cs.category_id")
    //   .where("p.is_delete", 0)
    //   .andWhere("sp.store_id", store_id)
    //   .andWhere("sp.is_available", 1)
    //   .whereIn("p.product_id", prod_id);

    // if (req.body.sortby) {
    //   limit = 6;
    //   offset = 0;
    //   sortby = req.body.sortby;
    // }

    // if (req.body.limits) {
    //   offset = Number(offset) + Number(limit);
    // }

    // if (req.body.id) {
    //   if (filter[2] == "add") {
    //     cat.push(filter[1]);
    //     sub_cat.push(filter[0]);
    //   }
    //   if (filter[2] == "remove") {
    //     var index = cat.indexOf(filter[1]);
    //     if (index !== -1) cat.splice(index, 1);

    //     var i = sub_cat.indexOf(filter[0]);
    //     if (i !== -1) sub_cat.splice(i, 1);
    //     else {
    //     }
    //   }
    // }
    // var tag = "";
    // if (search.length > 0) {
    //   for (let i = 0; i < search.length; i++) {
    //     tag += search[i] + "|";
    //   }
    //   tag = tag.slice(0, -1);
    //   rest.where(function () {
    //     this.where(
    //       "title",
    //       "REGEXP",
    //       "(^|[[:space:]])" + tag + "([[:space:]]|$)"
    //     )
    //       .orWhere(
    //         "description",
    //         "REGEXP",
    //         "(^|[[:space:]])" + tag + "([[:space:]]|$)"
    //       )
    //       .orWhere(
    //         "c.cat_name",
    //         "REGEXP",
    //         "(^|[[:space:]])" + tag + "([[:space:]]|$)"
    //       )
    //       .orWhere(
    //         "cs.cat_name",
    //         "REGEXP",
    //         "(^|[[:space:]])" + tag + "([[:space:]]|$)"
    //       );
    //   });
    //   // rest
    //   rest_count.where(function () {
    //     this.where(
    //       "title",
    //       "REGEXP",
    //       "(^|[[:space:]])" + tag + "([[:space:]]|$)"
    //     )
    //       .orWhere(
    //         "description",
    //         "REGEXP",
    //         "(^|[[:space:]])" + tag + "([[:space:]]|$)"
    //       )
    //       .orWhere(
    //         "c.cat_name",
    //         "REGEXP",
    //         "(^|[[:space:]])" + tag + "([[:space:]]|$)"
    //       )
    //       .orWhere(
    //         "cs.cat_name",
    //         "REGEXP",
    //         "(^|[[:space:]])" + tag + "([[:space:]]|$)"
    //       );
    //   });
    // }
    // if (cat.length > 0) {
    //   rest.whereIn("p.category_id", cat);
    //   rest.whereIn("p.sub_category_id", sub_cat);
    //   rest_count.whereIn("p.category_id", cat);
    //   rest_count.whereIn("p.sub_category_id", sub_cat);
    // }
    // rest.groupBy("p.product_id");
    // rest_count.groupBy("p.product_id");
    // if (sortby == "price-ascending") {
    //   rest.orderBy("value", "asc");
    // } else if (sortby == "price-descending") {
    //   rest.orderBy("value", "desc");
    // } else if (sortby == "title-descending") {
    //   rest.orderBy("title", "desc");
    // } else if (sortby == "title-ascending") {
    //   rest.orderBy("title", "asc");
    // } else {
    //   rest.orderBy("p.product_id", "desc");
    // }

    // rest.limit(Number(limit)).offset(Number(offset));

    // //console.log(rest.toString())
    // //console.log(rest_count.toString())

    // await rest.then(async function (bots) {
    //   products = bots;
    // });
    // var products_count;
    // await rest_count.then(async function (bots) {
    //   var allProducts = bots;
    //   products_count = allProducts.length;
    // });

    // var vari;

    // var variquery = knex
    //   .select(
    //     "v.*",
    //     "i.img_path",
    //     "u.name as unit",
    //     "p.name as ptype",
    //     "sp.price as value",
    //     "sp.qty as qty"
    //   )
    //   .from("variations  as v")
    //   .leftJoin("units as u", "v.unit_id", "=", "u.id")
    //   .leftJoin("images as i", "v.image_id", "=", "i.image_id")
    //   .leftJoin("packages as p", "v.packaging_id", "=", "p.id")
    //   .leftJoin(
    //     "store_products as sp",
    //     "v.variation_id",
    //     "=",
    //     "sp.variation_id"
    //   )
    //   .where("store_id", store_id)
    //   .andWhere("sp.is_available", 1)
    //   .orderBy("v.price", "ASC");

    // await variquery.then(async function (bots) {
    //   vari = bots;
    // });
    // var stores;
    // await knex("stores")
    //   .where("is_delete", 0)
    //   .then(function (bots) {
    //     stores = bots;
    //   });

    // res.render("orders/ajaxdata.ejs", {
    //   products,
    //   vari,
    //   store_id,
    //   offset,
    //   products_count,
    //   limit,
    //   stores,
    //   cart: req.session.cart || [],
    // });

    try {
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
        url: `${baseUrl}/boozly/api/ajaxdata`,
        // headers,
        // params,
        // paramsSerializer: (params) => {
        //   return qs.stringify(params, { arrayFormat: "repeat" });
        // },
        data: { info: base64Info },
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
      console.log("Error::", error.message);
      if (error.response.status === 400 && error.response.data.redirect) {
        // req.flash("FlashMsg", error.response.data.data.FlashMsg);
        res.redirect(error.response.data.redirect);
      }
      if (error.response.status === 400 && error.response.data.render) {
        res.render(error.response.data.render, error.response.data.data);
      }
    }
  },

  ///-----------------------------Get  product Detail
  async getProductDetailPage(req, res) {
    // var store_id = req.cookies.store_id || 0;

    // var product;
    // var productID = 0;
    // if (req.params.slug && req.params.slug != "0" && req.params.slug != "") {
    //   var productquery = knex
    //     .select(
    //       "p.product_id",
    //       "p.slug",
    //       "p.category_id",
    //       "sp.store_id",
    //       "c.category_id",
    //       "p.sub_category_id",
    //       "p.is_delete",
    //       "sp.price as value",
    //       "c.cat_name as cat_name",
    //       "cs.cat_name as subcat_name",
    //       "title",
    //       "description",
    //       "sp.is_default",
    //       "v.variation_id",
    //       "v.image_id",
    //       "size",
    //       "i.image_id",
    //       "unit_id",
    //       "packaging_id",
    //       "qty_per_pack",
    //       "v.price",
    //       "img_name",
    //       "img_path"
    //     )
    //     .from("store_products as sp")
    //     .leftJoin("products as p", "p.product_id", "=", "sp.product_id")
    //     .leftJoin("variations as v", "sp.variation_id", "=", "v.variation_id")
    //     .leftJoin("images as i", "v.image_id", "=", "i.image_id")
    //     .leftJoin("categories as c", "p.category_id", "=", "c.category_id")
    //     .leftJoin(
    //       "categories as cs",
    //       "p.sub_category_id",
    //       "=",
    //       "cs.category_id"
    //     )
    //     .where("p.slug", req.params.slug)
    //     .andWhere("p.is_delete", 0)
    //     .andWhere("sp.store_id", store_id)
    //     .andWhere("sp.is_available", 1);

    //   await productquery.then(async function (bots) {
    //     product = bots[0];
    //   });
    // }

    // if (product != undefined && product.hasOwnProperty("product_id")) {
    //   productID = product.product_id;
    // }

    // var vari;

    // var variquery = knex
    //   .select(
    //     "v.*",
    //     "i.img_path",
    //     "u.name as unit",
    //     "p.name as ptype",
    //     "sp.price as value",
    //     "sp.qty as qty"
    //   )
    //   .from("variations  as v")
    //   .leftJoin("units as u", "v.unit_id", "=", "u.id")
    //   .leftJoin("images as i", "v.image_id", "=", "i.image_id")
    //   .leftJoin("packages as p", "v.packaging_id", "=", "p.id")
    //   .leftJoin(
    //     "store_products as sp",
    //     "v.variation_id",
    //     "=",
    //     "sp.variation_id"
    //   )
    //   .where("store_id", store_id)
    //   .andWhere("sp.product_id", productID)
    //   .andWhere("sp.is_available", 1)
    //   .orderBy("v.price", "ASC");

    // await variquery.then(async function (bots) {
    //   vari = bots;
    // });
    // var store;
    // await knex("stores")
    //   .where("store_id", store_id)
    //   .then(function (bots) {
    //     store = bots[0];
    //   });

    // res.render("orders/getproductdetailpage.ejs", {
    //   product,
    //   vari,
    //   store_id,
    //   store,
    //   productID,
    //   storeID: store_id,
    //   cart: req.session.cart || [],
    // });
    try {
      const { headers, method, url, params, query, body, session, cookies } =
        req;
      const slug = req.params.slug;
      const baseUrl = process.env.APP_BASE_URL || APP_BASE_URL;
      const base64Info = await getBase64({
        headers,
        method,
        url,
        params,
        session,
        cookies,
      });
      const response = await axios({
        method,
        url: `${baseUrl}/boozly/api/drink-detail`,
        // headers,
        // params,
        // paramsSerializer: (params) => {
        //   return qs.stringify(params, { arrayFormat: "repeat" });
        // },
        // data: { info: base64Info },
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

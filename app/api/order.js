const { sendEmailVerification, getInfoFromBase64 } = require("../utils/helper");
const dropdown = require("../model/dropdown");

module.exports = {
  async getHomePageApi(req, res) {
    const { body, cookies } = await getInfoFromBase64(req.query.info);
    var pincode = cookies.pincode;
    search = [];
    var storeName = [];
    var store_id = cookies.store_id || 0;
    var fstore_id = cookies.fstore_id || 0;
    var storeExist = cookies.store || "";
    var storeErr = cookies.store_err || 1;
    if (
      store_id == 0 ||
      store_id == "" ||
      fstore_id == 0 ||
      fstore_id == "" ||
      storeExist != "exist"
    ) {
      res.cookie("store_id", body.store_id, {
        maxAge: 0, // 24 hours
        httpOnly: true,
      });
      res.cookie("fstore_id", body.store_id, {
        maxAge: 0, // 24 hours
        httpOnly: false,
      });
      res.cookie("store", "exist", {
        maxAge: 0, // 24 hours
        httpOnly: false,
      });
    }
    if (store_id) {
      await knex("stores")
        .where("store_id", store_id)
        .then(function (bots) {
          storeName = bots;
        });
    }
    res.status(200).send({
      render: "static/index.ejs",
      data: {
        pincode: pincode || "",
        FlashMsg: req.flash("FlashMsg"),
        storeName: storeName,
        storeID: store_id,
        storeErr: storeErr,
      },
    });
  },

  async getProductsPageApi(req, res) {
    const { body, cookies } = await getInfoFromBase64(req.query.info);
    var cat = [];
    var sub_cat = [];
    var limit = 6;
    var offset = 0;
    var sortby;
    var search = [];
    var store_id = cookies.store_id || 0;
    var fstore_id = cookies.fstore_id || 0;
    var storeExist = cookies.store || "";
    if (
      store_id == 0 ||
      store_id == "" ||
      fstore_id == 0 ||
      fstore_id == "" ||
      storeExist != "exist"
    ) {
      res.cookie("store_id", body.store_id, {
        maxAge: 0, // 24 hours
        httpOnly: true,
      });
      res.cookie("fstore_id", body.store_id, {
        maxAge: 0, // 24 hours
        httpOnly: false,
      });
      res.cookie("store", "exist", {
        maxAge: 0, // 24 hours
        httpOnly: false,
      });
      res.status(200).send({ redirect: "/boozly/" });
    }

    if (body.type) {
      search = [];
      cat = [];
      sub_cat = [];
      search.push(body.type);
    } else {
      search = [];
    }

    limit = 6;
    offset = 0;
    (cat = []), (sub_cat = []);
    dropdown.category_dropdown(async function (category) {
      if (cookies.store_id) {
        var store_id = cookies.store_id;
      } else {
        var store_id = 0;
      }
      const page = 2;
      let store;
      let pagebtn;
      let total_prod;
      await knex("stores")
        .where("store_id", store_id)
        .then(function (bots) {
          store = bots[0];
        });
      await knex("products as p")
        .leftJoin("store_products as sp", "p.product_id", "=", "sp.product_id")
        .where("sp.store_id", store_id)
        .count()
        .where("store_id", store_id)
        .then(function (bots) {
          total_prod = bots[0]["count(*)"];
        });
      if (total_prod > limit) {
        pagebtn = "yes";
      } else {
        pagebtn = "no";
      }

      // console.log("INFO:::", {
      //   category: category,
      //   currentPage: page,
      //   pagebtn,
      //   search: search.toString(),
      //   store: store,
      //   FlashMsg: req.flash("FlashMsg"),
      //   storeID: store_id,
      // });
      res.status(200).send({
        render: "orders/getproducts.ejs",
        data: {
          category: category,
          currentPage: page,
          pagebtn,
          search: search.toString(),
          store: store,
          FlashMsg: req.flash("FlashMsg"),
          storeID: store_id,
        },
      });
    }, cookies.store_id || 0);
  },

  async getProductDetailPageApi(req, res) {
    const { params, session, cookies } = await getInfoFromBase64(
      req.query.info
    );
    var store_id = cookies.store_id || 0;
    var product;
    var productID = 0;
    console.log(params.slug);
    if (params.slug && params.slug != "0" && params.slug != "") {
      var productquery = knex
        .select(
          "p.product_id",
          "p.slug",
          "p.category_id",
          "sp.store_id",
          "c.category_id",
          "p.sub_category_id",
          "p.is_delete",
          "sp.price as value",
          "c.cat_name as cat_name",
          "cs.cat_name as subcat_name",
          "title",
          "description",
          "sp.is_default",
          "v.variation_id",
          "v.image_id",
          "size",
          "i.image_id",
          "unit_id",
          "packaging_id",
          "qty_per_pack",
          "v.price",
          "img_name",
          "img_path"
        )
        .from("store_products as sp")
        .leftJoin("products as p", "p.product_id", "=", "sp.product_id")
        .leftJoin("variations as v", "sp.variation_id", "=", "v.variation_id")
        .leftJoin("images as i", "v.image_id", "=", "i.image_id")
        .leftJoin("categories as c", "p.category_id", "=", "c.category_id")
        .leftJoin(
          "categories as cs",
          "p.sub_category_id",
          "=",
          "cs.category_id"
        )
        .where("p.slug", params.slug)
        .andWhere("p.is_delete", 0)
        .andWhere("sp.store_id", store_id)
        .andWhere("sp.is_available", 1);

      await productquery.then(async function (bots) {
        product = bots[0];
      });
    }

    if (product != undefined && product.hasOwnProperty("product_id")) {
      productID = product.product_id;
    }

    var vari;

    var variquery = knex
      .select(
        "v.*",
        "i.img_path",
        "u.name as unit",
        "p.name as ptype",
        "sp.price as value",
        "sp.qty as qty"
      )
      .from("variations  as v")
      .leftJoin("units as u", "v.unit_id", "=", "u.id")
      .leftJoin("images as i", "v.image_id", "=", "i.image_id")
      .leftJoin("packages as p", "v.packaging_id", "=", "p.id")
      .leftJoin(
        "store_products as sp",
        "v.variation_id",
        "=",
        "sp.variation_id"
      )
      .where("store_id", store_id)
      .andWhere("sp.product_id", productID)
      .andWhere("sp.is_available", 1)
      .orderBy("v.price", "ASC");

    await variquery.then(async function (bots) {
      vari = bots;
    });

    var store;
    await knex("stores")
      .where("store_id", store_id)
      .then(function (bots) {
        store = bots[0];
      });

    res.status(200).send({
      render: "orders/getproductdetailpage.ejs",
      data: {
        product,
        vari,
        store_id,
        store,
        productID,
        storeID: store_id,
        cart: session.cart || [],
      },
    });
  },

  async checkoutPageApi(req, res) {
    const { session, cookies } = await getInfoFromBase64(req.query.info);
    var cart = session.cart || [];
    var store_id = cookies.store_id || 0;
    var storeName = [];

    if (cart.length > 0) {
      if (store_id) {
        await knex("stores")
          .where("store_id", store_id)
          .then(function (bots) {
            storeName = bots;
          });
      }

      var total = 0;
      var addresses;
      var tip;

      await knex("customer_addresses")
        .where("customer_id", session.user_id)
        .orderBy("address_id", "desc")
        .then(function (bots) {
          addresses = bots;
        });

      await knex("tips")
        .where("is_delete", 0)
        .then(function (bots) {
          tip = bots;
        });

      cart.forEach(function (element) {
        total += Number(element["total_price"]);
      });

      var taxes = Number((total * tax) / 100);

      res.status(200).send({
        render: "orders/checkout.ejs",
        data: {
          cart: cart,
          sub_total: total,
          total: Number(total) + Number(deliver_charges),
          taxes,
          addresses,
          tip,
          storeName: storeName,
          storeID: store_id,
        },
      });
    } else {
      res.status(200).send({ redirect: "/boozly/finddrink" });
    }
  },

  async getproductsajaxApi(req, res) {
    const { body, session, cookies } = await getInfoFromBase64(req.body.info);
    var cat = [],
      sub_cat = [];
    var limit = 6;
    var offset = 0;
    var sortby;
    var search = [];
    var store_id = cookies.store_id || 0;

    var products;
    // var limit = Number(req.body.limits)*ITEMS_PER_PAGE || ITEMS_PER_PAGE;
    var ddd;
    var prod_id = [];
    var product_sstore = knex
      .select()
      .from("store_products")
      .where("store_id", store_id);

    await product_sstore.then(async function (bots) {
      ddd = bots;
    });

    // console.log("Check", ddd);

    for (let i = 0; i < ddd.length; i++) {
      prod_id.push(ddd[i].product_id);
    }

    if (body.search != undefined) {
      var a = [];
      var a = body.search.split(",");

      if (body.search != "") {
        search = a;
      } else {
        search = [];
      }
      limit = 6;
      offset = 0;
    }

    if (body.id) {
      limit = 6;
      offset = 0;
    }

    // filter category based on selected category
    if (body.id) {
      var filter = body.id.split("_");
      if (filter) {
        limit = 6;
        offset = 0;
      }
    }

    var rest_count = knex
      .count()
      .from("store_products as sp")
      .leftJoin("products as p", "p.product_id", "=", "sp.product_id")
      .leftJoin("variations as v", "sp.variation_id", "=", "v.variation_id")
      .leftJoin("images as i", "v.image_id", "=", "i.image_id")
      .leftJoin("categories as c", "p.category_id", "=", "c.category_id")
      .leftJoin("categories as cs", "p.sub_category_id", "=", "cs.category_id")
      .where("p.is_delete", 0)
      .andWhere("sp.store_id", store_id)
      .andWhere("sp.is_available", 1)
      .whereIn("p.product_id", prod_id);

    var rest = knex
      .select(
        "p.product_id",
        "p.slug",
        "p.category_id",
        "sp.store_id",
        "c.category_id",
        "p.sub_category_id",
        "p.is_delete",
        "sp.price as value",
        "c.cat_name as cat_name",
        "cs.cat_name as subcat_name",
        "title",
        "description",
        "sp.is_default",
        "v.variation_id",
        "v.image_id",
        "size",
        "i.image_id",
        "unit_id",
        "packaging_id",
        "qty_per_pack",
        "v.price",
        "img_name",
        "img_path"
      )
      .from("store_products as sp")
      .leftJoin("products as p", "p.product_id", "=", "sp.product_id")
      .leftJoin("variations as v", "sp.variation_id", "=", "v.variation_id")
      .leftJoin("images as i", "v.image_id", "=", "i.image_id")
      .leftJoin("categories as c", "p.category_id", "=", "c.category_id")
      .leftJoin("categories as cs", "p.sub_category_id", "=", "cs.category_id")
      .where("p.is_delete", 0)
      .andWhere("sp.store_id", store_id)
      .andWhere("sp.is_available", 1)
      .whereIn("p.product_id", prod_id);

    if (body.sortby) {
      limit = 6;
      offset = 0;
      sortby = body.sortby;
    }

    if (body.limits) {
      offset = Number(offset) + Number(limit);
    }

    if (body.id) {
      if (filter[2] == "add") {
        cat.push(filter[1]);
        sub_cat.push(filter[0]);
      }
      if (filter[2] == "remove") {
        var index = cat.indexOf(filter[1]);
        if (index !== -1) cat.splice(index, 1);

        var i = sub_cat.indexOf(filter[0]);
        if (i !== -1) sub_cat.splice(i, 1);
        else {
        }
      }
    }
    var tag = "";
    if (search.length > 0) {
      for (let i = 0; i < search.length; i++) {
        tag += search[i] + "|";
      }
      tag = tag.slice(0, -1);
      rest.where(function () {
        this.where(
          "title",
          "REGEXP",
          "(^|[[:space:]])" + tag + "([[:space:]]|$)"
        )
          .orWhere(
            "description",
            "REGEXP",
            "(^|[[:space:]])" + tag + "([[:space:]]|$)"
          )
          .orWhere(
            "c.cat_name",
            "REGEXP",
            "(^|[[:space:]])" + tag + "([[:space:]]|$)"
          )
          .orWhere(
            "cs.cat_name",
            "REGEXP",
            "(^|[[:space:]])" + tag + "([[:space:]]|$)"
          );
      });
      // rest
      rest_count.where(function () {
        this.where(
          "title",
          "REGEXP",
          "(^|[[:space:]])" + tag + "([[:space:]]|$)"
        )
          .orWhere(
            "description",
            "REGEXP",
            "(^|[[:space:]])" + tag + "([[:space:]]|$)"
          )
          .orWhere(
            "c.cat_name",
            "REGEXP",
            "(^|[[:space:]])" + tag + "([[:space:]]|$)"
          )
          .orWhere(
            "cs.cat_name",
            "REGEXP",
            "(^|[[:space:]])" + tag + "([[:space:]]|$)"
          );
      });
    }
    if (cat.length > 0) {
      rest.whereIn("p.category_id", cat);
      rest.whereIn("p.sub_category_id", sub_cat);
      rest_count.whereIn("p.category_id", cat);
      rest_count.whereIn("p.sub_category_id", sub_cat);
    }
    rest.groupBy("p.product_id");
    rest_count.groupBy("p.product_id");
    if (sortby == "price-ascending") {
      rest.orderBy("value", "asc");
    } else if (sortby == "price-descending") {
      rest.orderBy("value", "desc");
    } else if (sortby == "title-descending") {
      rest.orderBy("title", "desc");
    } else if (sortby == "title-ascending") {
      rest.orderBy("title", "asc");
    } else {
      rest.orderBy("p.product_id", "desc");
    }

    rest.limit(Number(limit)).offset(Number(offset));

    //console.log(rest.toString())
    //console.log(rest_count.toString())

    await rest.then(async function (bots) {
      products = bots;
    });

    var products_count;
    await rest_count.then(async function (bots) {
      var allProducts = bots;
      products_count = allProducts.length;
    });

    var vari;

    var variquery = knex
      .select(
        "v.*",
        "i.img_path",
        "u.name as unit",
        "p.name as ptype",
        "sp.price as value",
        "sp.qty as qty"
      )
      .from("variations  as v")
      .leftJoin("units as u", "v.unit_id", "=", "u.id")
      .leftJoin("images as i", "v.image_id", "=", "i.image_id")
      .leftJoin("packages as p", "v.packaging_id", "=", "p.id")
      .leftJoin(
        "store_products as sp",
        "v.variation_id",
        "=",
        "sp.variation_id"
      )
      .where("store_id", store_id)
      .andWhere("sp.is_available", 1)
      .orderBy("v.price", "ASC");

    await variquery.then(async function (bots) {
      vari = bots;
    });

    var stores;
    await knex("stores")
      .where("is_delete", 0)
      .then(function (bots) {
        stores = bots;
      });

    res.status(200).send({
      render: "orders/ajaxdata.ejs",
      data: {
        products,
        vari,
        store_id,
        offset,
        products_count,
        limit,
        stores,
        cart: session.cart || [],
      },
    });
  },

  async getStoresApi(req, res) {
    let { store_id } = req.query;
    var stores;
    if (store_id) {
      await knex("stores")
        .where("store_id", store_id)
        .then(function (bots) {
          stores = bots;
        });
    } else {
      await knex("stores").then(function (bots) {
        stores = bots;
      });
    }
    res.status(200).send(stores);
  },
};

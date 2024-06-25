const { getInfoFromBase64 } = require("../utils/helper");

module.exports = {
  async deliveryApi(req, res) {
    let { params, session } = await getInfoFromBase64(req.query.info);
    var Id = session.user_id;
    var orderId = params.id;
    var data;
    var orders;

    await knex("customers")
      .select()
      .leftJoin(
        "customer_addresses as cs",
        "cs.customer_id",
        "=",
        "customers.customer_id"
      )
      .where("customers.customer_id", Id)
      .orderBy("cs.address_id", "desc")
      .then(function (bots) {
        data = bots[0];
      });

    var orderquery = knex("order_details as od")
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
      .where("o.customer_id", Id)
      .where("o.order_id", orderId)
      .orderBy("o.order_id", "desc");

    await orderquery.then(function (bots) {
      orders = bots;
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
      .where("customers.customer_id", Id)
      .orderBy("cs.address_id", "desc")
      .then(function (bots) {
        address = bots;
      });

    var result = orders.reduce(function (r, a) {
      if (a.is_delete != 1) {
        r[a.order_id] = r[a.order_id] || [];
        r[a.order_id].push(a);
      }
      return r;
    }, {});

    res.status(200).send({
      render: "orders/delivery.ejs",
      data: {
        message: "",
        orders: result,
        data,
        address,
        orderId,
      },
    });
  },
};

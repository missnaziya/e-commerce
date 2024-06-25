module.exports = {
  //----------------------------------------------------Category Dropdown----------------------------------------------------------------

  async category_dropdown(callback, storeId) {
    var a = {};
    var parent_cat;
    var cat_data;

    let store_id = storeId || 0;

    // Fetch store details
    const store = await knex("stores").where("stores.store_id", store_id);

    let brandTypes = [];
    if (Array.isArray(store) && store.length > 0 && store[0].brand_id) {
      // Fetch brand types for the store
      brandTypes = await knex("brand_types")
        .select("types.name", "types.type_id")
        .join("types", "brand_types.type_id", "types.type_id")
        .where("brand_types.brand_id", store[0].brand_id);
    }

    // Create an object with type_id as key and corresponding brand type as value
    const typeIds = brandTypes.map((element) => element.type_id);

    await knex("categories")
      .select("category_id", "parent_id", "cat_name")
      .where("is_delete", 0)
      .whereIn("type_id", typeIds)
      .then(async function (bots) {
        parent_cat = bots;
      });

    var obj = parent_cat.reduce((acc, val) => {
      if (val.parent_id == 0) {
        acc[val.category_id] = val.cat_name;
      }
      return acc;
    }, {});

    var result = parent_cat.reduce(function (r, a) {
      if (a.parent_id != 0) {
        r[a.parent_id] = r[a.parent_id] || [[], []];
        r[a.parent_id][0].push(a);
        r[a.parent_id][1] = obj[a.parent_id];
      }
      return r;
    }, {});

    // console.log("Bots::", JSON.stringify(result));

    callback(result);
  },
};

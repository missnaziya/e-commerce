var dropdown = require("../model/dropdown"),
  md5 = require("md5");
module.exports = {
  async myaccounts(e, s) {
    if ("POST" == e.method) {
      var t = e.session.user_id,
        a = [];
      await knex("users")
        .where("user_id", "=", t)
        .update(e.body)
        .then(function () {}),
        await knex("users")
          .select()
          .where("user_id", t)
          .then(function (e) {
            a = e[0];
          }),
        (e.session.u_name = e.body.u_name);
      dropdown.cities_dropdown(function (t) {
        dropdown.category_dropdown(function (r) {
          s.render("myaccounts/myaccounts.ejs", {
            city: t,
            category: r,
            FlashMsg: e.flash("FlashMsg"),
            message: "Details update successfully",
            data: a,
          });
        });
      });
    } else
      dropdown.cities_dropdown(function (t) {
        dropdown.category_dropdown(function (a) {
          s.render("myaccounts/myaccounts.ejs", {
            city: t,
            category: a,
            FlashMsg: e.flash("FlashMsg"),
            message: "",
            data: "",
          });
        });
      });
  },
  changepassword: (e, s) => {
    var t = e.session.user_id;
    if ("POST" == e.method) {
      var a = e.body.oldpassword,
        r = e.body.u_password;
      knex("users")
        .select("text_password")
        .where("user_id", t)
        .then(function (o) {
          a == o[0].text_password
            ? (knex("users")
                .where("user_id", "=", t)
                .update({
                  text_password: r,
                  u_password: md5(r),
                  u_password: md5(r),
                })
                .then(function () {}),
              e.flash("FlashMsg", "Password updated successfully"),
              s.redirect("/boozly/change-password"))
            : (e.flash("FlashMsg", "Old Password not matched"),
              s.redirect("/boozly/change-password"));
        });
    } else
      dropdown.cities_dropdown(function (t) {
        dropdown.category_dropdown(function (a) {
          s.render("myaccounts/changepassword.ejs", {
            city: t,
            category: a,
            FlashMsg: e.flash("FlashMsg"),
          });
        });
      });
  },
  async bookings(e, s) {
    var t;
    await knex("jobs")
      .where("user_id", e.session.user_id)
      .then(function (e) {
        t = e;
      }),
      s.render("myaccounts/bookings.ejs", {
        history: t,
        FlashMsg: e.flash("FlashMsg"),
      });
  },
  async userwallet(e, s) {
    var t;
    await knex("trans_usrs")
      .where("user_id", e.session.user_id)
      .then(function (e) {
        t = e;
      }),
      console.log(e.session.user_id),
      s.render("myaccounts/userwallet.ejs", {
        history: t,
        FlashMsg: e.flash("FlashMsg"),
      });
  },
  updatewallet(e, s) {
    let t = e.session.user_id;
    var a =
      "INSERT INTO `transactions`( `trans_date`, `trans_type`, `trans_pay_mode`, `trans_total_amt`, `trans_commission_amt`, `trans_tax_amt`, `trans_other_amt`, `trans_net_amt`, `trans_status`, `created`, `modified`) VALUES ('" +
      dategmt +
      "','CR','Wallet','" +
      e.body.add_money +
      "','','','','','Valid','" +
      dategmt +
      "','" +
      dategmt +
      "')";
    db.query(a, (a, r) => {
      if (a) return s.status(500).send(a);
      var o = r.insertId,
        d =
          "UPDATE users set u_wallet=u_wallet+" +
          e.body.add_money +
          " where user_id=" +
          t;
      db.query(d, (a, r) => {
        if (a) return s.status(500).send(a);
        var d = "SELECT u_wallet FROM users where user_id=" + t;
        db.query(d, (a, r) => {
          if (a) return s.status(500).send(a);
          var d = r[0].u_wallet,
            n =
              "INSERT INTO `trans_usrs`( `transaction_id`, `trans_type`, `user_id`, `amount`, `current_bal`, `remarks`, `created`, `modified`) VALUES ('" +
              o +
              "','CR','" +
              t +
              "','" +
              e.body.add_money +
              "','" +
              d +
              "','','" +
              dategmt +
              "','" +
              dategmt +
              "')";
          db.query(n, (t, a) => {
            if (t) return s.status(500).send(t);
            e.flash("FlashMsg", "Wallet Updated Successfully"),
              s.redirect("/boozly/user-wallet");
          });
        });
      });
    });
  },
  async walletpagination(e, s) {
    var t,
      a,
      r = e.query.start,
      o = e.query.length,
      d = knex("trans_usrs").where("user_id", e.session.user_id).count(""),
      n = knex("trans_usrs")
        .where("user_id", e.session.user_id)
        .select()
        .orderBy("trans_user_id", "desc")
        .limit(Number(o))
        .offset(Number(r));
    await d.then(function (e) {
      console.log(e[0]["count(*)"]), (t = e[0]["count(*)"]);
    }),
      await n.then(function (e) {
        a = e;
      });
    var i = {},
      u = [];
    for (let e = 0; e < a.length; e++) {
      var l = [],
        c = a[e].trans_user_id;
      l.push(""),
        l.push(c),
        l.push(new Date(a[e].created).toDateString().slice(4)),
        l.push(a[e].trans_type),
        l.push(a[e].amount),
        l.push(a[e].current_bal),
        u.push(l);
    }
    (i.draw = e.query.draw),
      (i.recordsTotal = t),
      (i.recordsFiltered = t),
      (i.data = u),
      s.send(JSON.stringify(i));
  },
  async bookingpagination(e, s) {
    var t,
      a,
      r = e.query.start,
      o = e.query.length,
      d = knex("jobs").where("user_id", e.session.user_id).count(""),
      n = knex("jobs")
        .where("user_id", e.session.user_id)
        .select()
        .orderBy("job_id", "desc")
        .limit(Number(o))
        .offset(Number(r));
    console.log(n.toString()),
      await d.then(function (e) {
        console.log(e[0]["count(*)"]), (t = e[0]["count(*)"]);
      }),
      await n.then(function (e) {
        (a = e), console.log(e);
      });
    var i = {},
      u = [];
    for (let e = 0; e < a.length; e++) {
      var l = [],
        c = a[e].job_id;
      l.push(""),
        l.push(c),
        l.push(new Date(a[e].job_date).toDateString().slice(4)),
        l.push(new Date(a[e].job_date).toLocaleTimeString()),
        l.push(a[e].job_to_loc),
        l.push(a[e].job_status.toUpperCase()),
        "ongoing" == a[e].job_status || "request" == a[e].job_status
          ? l.push(
              '<input id="myBtn" data-toggle="modal" data-target="#myModal' +
                c +
                '" class="btn btn-danger" type="submit" value="Cancel"><div class="modal fade formd" id="myModal' +
                c +
                '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content" id="subscribe-email-form" ><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="myModalLabel">Are you sure ?</h4></div><div class="modal-body"><div class="md-form"><i class="fas fa-pencil prefix grey-text"></i><label data-error="wrong" name="cancel_reason" data-success="right" value=""for="form' +
                c +
                '</label>">Reason for Cancel</label><textarea type="text" name="cancel_reason" id="form' +
                c +
                '" class="md-textarea form-control" rows="4"></textarea><input type="hidden" name="id" value="' +
                c +
                '"></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button class="btn btn-default btn-danger pay" data-dismiss="modal" onclick="form_submit(' +
                c +
                ')">Cancel job</button></div></div></div>'
            )
          : l.push(""),
        l.push(a[e].job_reason),
        u.push(l);
    }
    (i.draw = e.query.draw),
      (i.recordsTotal = t),
      (i.recordsFiltered = t),
      (i.data = u),
      s.send(JSON.stringify(i));
  },
  logout: (e, s) => {
    e.session.destroy(function () {
      res.clearCookie('Logged');
      res.clearCookie('user_id');
      res.clearCookie('owner_id');
      res.clearCookie('u_email');
      res.clearCookie('u_fname');
      res.clearCookie('u_lname');
      res.clearCookie('u_phone');
      res.clearCookie('u_address');
      res.clearCookie('stripeCustId');
      s.redirect("/boozly");
    });
  },
};

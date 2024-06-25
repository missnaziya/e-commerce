var nodemailer = require("nodemailer");
var jwt = require("jwt-simple");
const {
  NODEMAILER_HOST,
  NODEMAILER_PORT,
  NODEMAILER_PASSWORD,
  NODEMAILER_USER,
} = require("./config.js");

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
  async sendEmailVerification(payload, toEmail) {
    var IsError = false;
    var secret = "fe1a1915a379f3be5394b64d14794932-1506868106675";
    var token = jwt.encode(payload, secret);
    var mailOptions = {
      from: "hr@grepixit.com",
      cc: "vinner.2112@gmail.com",
      to: toEmail,
      subject: "Email Verification",
      // html: '<html><head><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500&display=swap" rel="stylesheet"></head><body><center><div class=""><div class="aHl"></div><div id=":oz" tabindex="-1"></div><div id=":ob" class="ii gt"><div id=":oc" class="a3s aXjCH msg-6654097468040732516"><u></u><div style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div style="min-width:100%;width:100%;background-color:#ffffff"><table class="m_-6654097468040732516email" style="width:100%;max-width:600px;margin-left:auto;margin-right:auto;padding-left:20px;padding-right:20px;padding-bottom:0px;color:#333332;line-height:1.4;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Ubuntu","Open Sans","Helvetica Neue",sans-serif;background:#ffffff"><tbody><tr><td style="min-width:100%;width:100%;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px"><div style="text-align:center"><img src="http://139.59.87.114:2105/assets/images/logo/01.png" alt="Boozly" width="200" style="width:200px;padding-top:30px;padding-bottom:30px"></div></td></tr></tbody></table></div><table class="m_-6654097468040732516email" style="width:100%;max-width:600px;margin-left:auto;margin-right:auto;padding-left:20px;padding-right:20px;padding-bottom:20px;color:#333332;line-height:1.4;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Ubuntu","Open Sans","Helvetica Neue",sans-serif;background:#ffffff"><tbody><tr><td style="min-width:100%;width:100%;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px"><h1 style="font-family:"Poppins", sans-serif;color:#333332;font-size:32px;font-weight:300;line-height:1.2;margin-bottom:20px;text-align:center;">You are almost there.</h1><p style="margin-top:0;margin-bottom:20px;font-family:"Poppins", sans-serif; font-weight:300;">Click the link below to confirm your email and finish creating your account.</p><p style="margin-top:0;margin-bottom:20px;font-family:"Poppins", sans-serif;">This link will expire in 2 hours.</p><p style="margin-top:0;margin-bottom:20px;text-align:center"><a href="http://139.59.87.114:2105/boozly/verify/' + payload.id + "/" + token + '" style="color:#ffffff;text-decoration:none;display:inline-block;height:38px;line-height:38px;padding-top:0;font-family:"Poppins", sans-serif;padding-right:24px;padding-bottom:0;padding-left:24px;border:0;outline:0;background-color:#0066cc;font-size:14px;font-style:normal;font-weight:400;text-align:center;white-space:nowrap;border-radius:50px;margin-top:35px;margin-bottom:35px">Verify your account</a></p><div class="m_-6654097468040732516email-disclaimer" style="color:#b3b3b1;font-size:14px;text-align:center;margin-top:0px;margin-right:0;margin-bottom:50px;margin-left:0">If you did not make this request, you can safely ignore this email.</div></div></div></td></tr></tbody></table><div style="min-width:100%;width:100%;background-color:#ffffff"><table class="m_-6654097468040732516email" style="width:100%;max-width:600px;margin-left:auto;margin-right:auto;padding-left:20px;padding-right:20px;padding-bottom:20px;color:#333332;line-height:1.4;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Ubuntu","Open Sans","Helvetica Neue",sans-serif;background:#ffffff;background-color:#ffffff"><tbody><tr><td><div style="padding-top:15px;padding-right:0;padding-bottom:0;padding-left:0;margin-top:0px;color:rgba(0,0,0,0.68);font-size:12px;text-align:center;border-top:1px solid #8e8e8e">Sent by <a href="".base_url()."">Boozly&nbsp;</a>Silicon Oasis Dubai, UAE <a href="".PRIVACY_POLICY."">Privacy policy</a></div></td></tr></tbody></table></div><div class="yj6qo"></div><div class="adL"></div></div><div class="adL"></div></div></div><div id=":ou" class="ii gt" style="display:none"><div id=":ov" class="a3s aXjCH undefined"></div></div><div class="hi"></div></div></center></body></html>'
      html:
        '<html><head><link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600&display=swap" rel="stylesheet"></head><body><center><div class=""><div class="aHl"></div><div id=":oz" tabindex="-1"></div><div id=":ob" class="ii gt"><div id=":oc" class="a3s aXjCH msg-6654097468040732516"><u></u><div style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"><div style="min-width:100%;width:100%;background-color:#ffffff"><table class="m_-6654097468040732516email" style="width:100%;max-width:600px;margin-left:auto;margin-right:auto;padding-left:20px;padding-right:20px;padding-bottom:0px;color:#333332;line-height:1.4;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Open Sans,Helvetica Neue,sans-serif;background:#ffffff"><tbody><tr><td style="min-width:100%;width:100%;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px"><div style="text-align:center"><img src="http://139.59.87.114:2105/assets/images/logo/01.png" alt="Boozly" width="200" style="width:200px;padding-top:30px;padding-bottom:30px"></div></td></tr></tbody></table></div><table class="m_-6654097468040732516email" style="width:100%;max-width:600px;margin-left:auto;margin-right:auto;padding-left:20px;padding-right:20px;padding-bottom:20px;color:#333332;line-height:1.4;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Open Sans,Helvetica Neue,sans-serif;background:#ffffff"><tbody><tr><td style="min-width:100%;width:100%;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px"><h1 style="font-family: Quicksand !important;color:#333332;font-size:32px;font-weight:600;line-height:1.2;margin-bottom:20px;text-align:center;">You are almost there.</h1><p style="margin-top:0;margin-bottom:20px;font-family: Quicksand !important;font-size: medium;  font-style: normal;">Click the link below to confirm your email and finish creating your account.</p><p style="margin-top:0;margin-bottom:20px;font-family: Quicksand !important;font-weight: 600;font-size: medium;  font-style: normal;">This link will expire in 2 hours.</p><p style="margin-top:0;margin-bottom:20px;text-align:center"><a href="http://139.59.87.114:2105/boozly/verify/' +
        payload.id +
        "/" +
        token +
        '" style="color:#ffffff;text-decoration:none;display:inline-block;height:38px;line-height:38px;padding-top:0;font-family: Quicksand !important;padding-right:24px;padding-bottom:0;padding-left:24px;border:0;outline:0;background-color:#fb524f;font-size:14px;font-style:normal;font-weight:600;text-align:center;white-space:nowrap;border-radius:4px;margin-top:35px;margin-bottom:35px">Verify your account</a></p><div class="m_-6654097468040732516email-disclaimer" style="color:#b3b3b1;font-size:14px;text-align:center;margin-top:0px;margin-right:0;margin-bottom:50px;margin-left:0;font-family: Times !important;">If you did not make this request, you can safely ignore this email.</div></div></div></td></tr></tbody></table><div style="min-width:100%;width:100%;background-color:#ffffff"><table class="m_-6654097468040732516email" style="width:100%;max-width:600px;margin-left:auto;margin-right:auto;padding-left:20px;padding-right:20px;padding-bottom:20px;color:#333332;line-height:1.4;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Open Sans,Helvetica Neue,sans-serif;background:#ffffff;background-color:#ffffff"><tbody><tr><td><div style="padding-top:15px;padding-right:0;padding-bottom:0;padding-left:0;margin-top:0px;color:rgba(0,0,0,0.68);font-size:12px;text-align:center;border-top:1px solid #8e8e8e;font-family: Times !important;">Sent by <a href="http://139.59.87.114:2105/boozly">Boozly</a>  Silicon Oasis Dubai, UAE <a href="javascript:void(0);">Privacy policy</a></div></td></tr></tbody></table></div><div class="yj6qo"></div><div class="adL"></div></div><div class="adL"></div></div></div><div id=":ou" class="ii gt" style="display:none"><div id=":ov" class="a3s aXjCH undefined"></div></div><div class="hi"></div></div></center></body></html>',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        IsError = true;
      }
      if (info) {
        IsError = false;
      }
    });
    return IsError;
  },

  async getBase64(info) {
    const infoString = JSON.stringify(info);
    return Buffer.from(infoString).toString("base64");
  },

  async getInfoFromBase64(base64Info) {
    const infoString = Buffer.from(base64Info, "base64");
    return JSON.parse(infoString);
  },
};

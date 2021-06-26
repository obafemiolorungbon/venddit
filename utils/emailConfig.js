const nodemailer = require("nodemailer");
module.exports.transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USERNAME,
    accessToken: process.env.ACCESS_TOKENS,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKENS,
  },
});

module.exports.senderConfig = (encodedData, payload, email, subject) => {
  return congfig = ()=>{ 
      return {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: subject,
    html: encodedData(payload),
  };
}
};

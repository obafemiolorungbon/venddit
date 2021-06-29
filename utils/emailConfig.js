/**
 * nodemailer transporter config with sensible defaults
 * @param { class } nodemailer node mailer module instance 
 * @param { String } host Email host provider 
 * @param { Number } port Port for email 
 * @param { Boolean } secure enable secure protocol 
 * @param { String } user User email to configure 
 * @param { String } accessToken access token provided for the given user 
 * @param { String } clientId Id for user
 * @param { String } clientSecret secret token for the provided clientID
 * @param { String } refreshToken secret token to use for sending multiple emails 
 * @returns nodemailer transport object with defined values
*/

module.exports = (
  nodemailer,
  host = process.env.EMAIL_HOST,
  port = 465,
  secure = true,
  user = process.env.EMAIL_USERNAME,
  accessToken = process.env.ACCESS_TOKENS,
  clientId = process.env.CLIENT_ID,
  clientSecret = process.env.CLIENT_SECRET,
  refreshToken = process.env.REFRESH_TOKENS
) => {
  return nodemailer.createTransport({
    host: host,
    port: port,
    secure: secure,
    auth: {
      type: "OAuth2",
      user: user,
      accessToken: accessToken, 
      clientId: clientId,
      clientSecret: clientSecret,
      refreshToken: refreshToken,
    },
  });
};

/**
 * formats nodemailer transport options
 * @param { Object } payload the main file to be transported
 * @param { String } email recipient email address
 * @param { String } subject The subject for the email 
 * @param { String } from Sender Email
 * @returns { Object } an object containing the neccesary options for nodemailer
 */

module.exports.senderConfig = ( 
  payload, 
  email, 
  subject, 
  from = process.env.FROM_EMAIL ) => {
  return  () => { 
      return {
    from: from,
    to: email,
    subject: subject,
    html: payload,
  };
}
};

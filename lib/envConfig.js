const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  dbName: process.env.dbName,
  secretKey: process.env.secretKey,
  sessionMaxAge: process.env.sessionMaxAg,
  sessionSecret: process.env.sessionSecret,
  RedisPort: process.env.RedisPort,
  RedisLocalHost: process.env.RedisLocalHost,
  RedisPassword:process.env.RedisPassword,
};
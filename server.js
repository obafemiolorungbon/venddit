const winston = require("winston");
const app = require("./index.js");
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  winston.info(`Server is now running on port ${PORT}`);
});

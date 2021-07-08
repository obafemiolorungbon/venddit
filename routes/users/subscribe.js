const express = require("express");
const router = express.Router();
const path = require("path");
router.use(express.static(path.join(__dirname, "../../public")));

const formParser = require("../../lib/formParser.js");

router.post("/", formParser, (req, res) => {
  console.log("user has subscribed to our mailing list");
  console.log(req.data);
  res
    .status(200)
    .send({
      status: "Success",
      message: "Your email was successfully added to our subscriber's list",
    });
});

module.exports = router;

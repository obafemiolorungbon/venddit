var webshot = require("node-webshot");
let url = "/getTicket?msisdn=" + msisdn;
let htmlAsImageFileLocation = "ticket.png";

// Define screenshot options
var options = {
  screenSize: {
    width: 550,
    height: 450,
  },
  shotSize: {
    width: 550,
    height: 450,
  },
  userAgent:
    "Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g",
};

// Save html as an image
webshot(url, htmlAsImageFileLocation, options, function (err) {
  // TODO: Upload image to a publicly accessible URL
});

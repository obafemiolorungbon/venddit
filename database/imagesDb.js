const mongoose = require("mongoose");

module.exports = () => {
  const imagesSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectID,
      required: ["User is required to add a new image", true],
      ref:"user",
    },
    productName: {
      type: String,
      required: ["Product name must be provided", true],
    },
    url: { type: String, required: ["Url is not provided", true] },
    dateCreated:{
      type:Date,
      default:Date.now,
    }
  });
  //if the environment is test, use a different db to avoid polluting the db
  if (process.env.NODE_ENV == "test") {
    //add an extra path to the db if it is in test mode which will automatically
    // delete the entry after some time
    //this is to avoid a 500 error that might arise from duplicate emails
    imagesSchema.add({
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 360,
      },
    });
    let images = mongoose.model("image", imagesSchema);
    return images;
  } else {
    let images = mongoose.model("image", imagesSchema);
    return images;
  }
};
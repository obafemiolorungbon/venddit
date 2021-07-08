module.exports = (req, model, userID) => {
  return new Promise((resolve, reject) => {
    const newImage = new model({
      user: userID,
      productName: req.body.productName,
      url: req.body.url,
      description: req.body.description,
      price: req.body.price,
    });

    newImage.save((err, newImage) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ message: "Image saved succesfully", image: newImage });
    });
  });
};

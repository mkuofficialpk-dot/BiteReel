// food.model.js
const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  video: {
    type: String, // video ki type string isliya ha kio ka hum apna DB ma video ka URL store karna wala hain(direct file store nahi karain ga, kar sakta hain but bohot inefficient tareeka ha) or ya URL hama video tak pooncha da gi but hamari video kahan pari hogi --> to usko hum cloud ma store karain ga(cloud storege provier)
    require: true,
  },
  description: {
    type: String,
  },
  foodPartner: { // Konsa foodPartner na is food item ko add kiya ha.
    type: mongoose.Schema.Types.ObjectId,
    ref: "foodpartner",
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  saveCount: {
    type: Number,
    default: 0,
  },
});

const foodModel = mongoose.model("food", foodSchema);

module.exports = foodModel;

// now create new rout and controller for this module;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
        },
        profilePhotoLocation: {
            type: String,
        },
        imgType: {
            type: String,
        },
    },
  
  { timestamps: true },
  { collection: 'products'}
);


const model = mongoose.model('Product',ProductSchema);
module.exports = model;
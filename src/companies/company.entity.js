const mongoose = require('mongoose');
var URLSlug = require("mongoose-slug-generator");

mongoose.plugin(URLSlug);


const CompanySchema = new mongoose.Schema({
  
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
  resolution: {
    type: String,
  },
  description: {
    type: String
  },
  slug: { type: String,
     slug: "name"},
  tags:[String],
  category:{type:String},



},
{ versionKey: false },
{ timestamps: true },
{ collection: 'products'});


const Company = mongoose.model('Company', CompanySchema,
 );

module.exports = Company;

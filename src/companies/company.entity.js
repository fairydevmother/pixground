const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({ name: String });

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
    type: String
  },
  description: {
    type: String
  },
  tags:[String],

},
{ versionKey: false });

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company ;

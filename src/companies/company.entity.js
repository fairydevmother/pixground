const mongoose = require('mongoose');



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
  tags:[String],
  category: [String],

},
{ versionKey: false },
{ timestamps: true },
{ collection: 'products'});

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company ;

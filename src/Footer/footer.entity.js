const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FooterSchema = new Schema(
  {
    aboutTitle: { type: String },
    aboutContent: { type: String },
    privacyPolicyTitle: { type: String },
    privacyPolicyContent: { type: String },
    termsofuseTitle:{type:String},
    termsofuseContent:{type:String},
    companyEmail:{type:String},
    companyContact:{String},
    contactAddress:{String},
    companyName:{String}
  },
);

 

const model = mongoose.model('Footer',FooterSchema);
module.exports = model;

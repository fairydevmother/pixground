const express = require('express');
const { default: AdminBro } = require('admin-bro');
const mongoose = require('mongoose');
const options = require('./admin.options');
const buildAdminRouter = require('./admin.router');

const app = express();


const run = async () => {
  
  dotenv.config();
  const mongo=process.env.MONGO_URI;
  await mongoose.connect( mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  
  })
  const admin = new AdminBro(options);
  const router = buildAdminRouter(admin);

  app.use(admin.options.rootPath, router);

  app.use('/uploads', express.static('uploads'));

  const PORT = process.env.PORT || 3000;
   app.listen(PORT || process.env.Port , function () {
  console.log('Server is started on http://localhost:'+PORT);
 });

};


module.exports = run;


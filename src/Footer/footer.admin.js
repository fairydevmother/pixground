const AdminBro = require('admin-bro');

const Footer = require('./footer.entity');


/** @type {AdminBro.ResourceOptions} */
const options = {
    parent: {
             name: 'Footer',
          },
          
    
          

};

module.exports = {
  options,
  resource: Footer,
};

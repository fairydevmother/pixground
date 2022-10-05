const { default: AdminBro } = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');

AdminBro.registerAdapter(AdminBroMongoose);

const AdminCompany = require('./companies/company.admin');
const Footer = require('./Footer/footer.admin');
const User =require('./users/users.admin')
 
/** @type {import('admin-bro').AdminBroOptions} */
const options = {
  resources: [AdminCompany, User, Footer

  ],
  dashboard: {
    handler: async () => {

    },
    component: AdminBro.bundle('./companies/components/dashboard.tsx')
  },
  branding: {
    companyName: 'Pixground',
    softwareBrothers: false,
    logo: false, // OR false to hide the default one
   },
  locale: {
    translations: {
        messages: {
            loginWelcome: 'Pixground represents...' // the smaller text
        },
        labels: {
            loginWelcome: 'Welcome to Pixground', // this could be your project name
        },
    }
  },
};

module.exports = options;

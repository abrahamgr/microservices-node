const path = require('path');

module.exports = {
  development: {
    sitename: 'Roux Meetups [Development]',
    serviceRegistryURL: "http://localhost:3000",
    serviceVersion: "1.x.x",
  },
  production: {
    sitename: 'Roux Meetups',
    serviceRegistryURL: "http://localhost:3000",
    serviceVersion: "1.x.x",
  },
};

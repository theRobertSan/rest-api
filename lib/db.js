// Knex Options
const options = {
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'robert',
    password: 'root',
    database: 'assignment4',
  },
};

// Connect
const knex = require('knex')(options);

module.exports = knex;

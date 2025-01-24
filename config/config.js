require('dotenv').config();

module.exports = {
  development: {
    use_env_variable: 'CONNECTION_STRING',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'CONNECTION_STRING',
    dialect: 'postgres',
  },
};

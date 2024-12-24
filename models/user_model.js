const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize('node_auth', 'root', 'root@123', {
  host: 'localhost',
  dialect: 'mysql', // Adjust as needed for your database
});

// Define the User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

// Export sequelize and User model
module.exports = { sequelize, User };

// Optionally, sync the model when app.js is executed
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    await User.sync(); // Creates the table if it doesn't exist
    console.log('User table synced successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();

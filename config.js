// Add your MongoDB connection details here
require('dotenv').config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  COLLECTION_NAME: process.env.COLLECTION_NAME,
  IMAGE_FIELD_NAME: process.env.IMAGE_FIELD_NAME
};
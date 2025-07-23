const mongoose = require('mongoose');
const dotenv = require('dotenv')
const {mongo_url} = require('../config/env.config.js')

dotenv.config()


 exports.dbconnect = async () => {
  try{
    const connect = await mongoose.connect(`${mongo_url}`);
    console.log(`Database connected: ${connect.connection.host}, ${connect.connection.name}`)
  } catch (err){
    console.error("error connecting to database", err)
  }
}


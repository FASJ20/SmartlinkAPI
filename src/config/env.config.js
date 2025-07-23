const dotenv = require('dotenv')
dotenv.config()

exports.port = process.env.PORT 
exports.api_key = process.env.API_KEYS
exports.mongo_url= process.env.MONGO_URL
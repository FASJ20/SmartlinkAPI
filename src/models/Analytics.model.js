const mongoose = require('mongoose');

const AnalyticSchema = new mongoose.Schema({
    shortCode: {
    type: String,
    required: true,
    index: true,
    },
    visitTime: {
    type: Date,
    default: Date.now,
    },
    ipAddress: {
        type: String,
        required: false,
    },
    userAgent: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
})
module.exports = mongoose.model('Analytics', AnalyticSchema);
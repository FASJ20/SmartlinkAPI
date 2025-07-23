const mongoose = require('mongoose');

const QrSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    qrImage: {
        type: Buffer,
        required: true
    },
    format: {
        type: String
    },
    createdAt: {
    type: Date,
    default: Date.now,
    }
});

module.exports = mongoose.model('Qr', QrSchema);
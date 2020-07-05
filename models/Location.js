const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
    clockId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    biome: {
        type: String,
        required: true
    },
    roads: {
        type: [],
        default: []
    }
});

module.exports = mongoose.model('Locations', LocationSchema);
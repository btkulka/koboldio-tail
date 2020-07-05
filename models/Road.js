const mongoose = require('mongoose');

const RoadSchema = mongoose.Schema({
    clockId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    location1Id: {
        type: String,
        required: true
    },
    location2Id: {
        type: String,
        required: true
    },
    length: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Roads', RoadSchema);
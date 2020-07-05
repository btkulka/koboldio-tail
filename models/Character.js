const mongoose = require('mongoose');

const CharacterSchema = mongoose.Schema({
    clockId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    race: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    class: {
        type: String
    },
    inParty: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Characters', CharacterSchema);
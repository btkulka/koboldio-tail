const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    clockId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        required: true
    },
    locationId: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    dateType: {
        type: String,
        required: true
    },
    isAllDay: {
        type: Boolean,
        default: false
    },
    date: {
        y: {
            type: Number,
            default: 0
        },
        month: {
            type: Number,
            default: 0
        },
        d: { 
            type: Number,
            default: 0
        },
        h: {
            type: Number,
            default: 0
        },
        m: {
            type: Number,
            default: 0
        },
        s: {
            type: Number,
            default: 0
        },
        ms: {
            type: Number,
            default: 0
        }
    },
    length: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Events', EventSchema);
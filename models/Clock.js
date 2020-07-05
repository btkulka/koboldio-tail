const mongoose = require('mongoose');

const ClockSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    campaignName: {
        type: String,
        required: true
    },
    elapsedTime: {
        type: Number,
        default: 0
    },
    elapsedWorldTime: {
        type: Number,
        default: 0
    },
    worldTime: {
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
    campaignDay: {
        type: Number,
        default: 1
    },
    mode: {
        type: String,
        default: 'Pause'
    },
    currentLocationId: {
        type: Number
    },
    party: {
        type: []
    }
});

module.exports = mongoose.model('Clocks', ClockSchema);
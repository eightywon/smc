const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    eventDescription: {
        type: String,
        trim: true,
    },
    eventCreatedByUserId: {
        type: mongoose.Types.ObjectId,
        required: false,
    },
    creationDate: {
        type: Date,
        required: true
    },
    eventDateTime: {
        type: Date,
        required: true
    },
    eventType: {
        type: String,
        trim: true,
        required: true
    },
    eventOtherDesc: {
        type: String,
        trim: true
    },
    eventBuyin: {
        type: String,
        trim: true
    },
    eventRebuys: {
        type: String,
        trim: true
    },
    eventMaxRegs: {
        type: String,
        trim: true
    },
    eventCurrentRegs: {
        type: String,
        trim: true
    },
    registrations: [{
        postText: {
            type: String,
            trim: true,
        },
        regUserId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        regDate: {
            type: Date,
            required: true
        },
        eventId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        displayName: {
            type: String,
            trim: true,
        },
        receiveSMSAlerts: {
            type: Boolean,
            default: true
        },
        receiveEmailAlerts: {
            type: Boolean,
            default: true
        },
    }]


});

const Event = mongoose.model("Events", EventSchema);

module.exports = Event;
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
    }
});

const Event = mongoose.model("Events", EventSchema);

module.exports = Event;
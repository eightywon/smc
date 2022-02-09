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
    eventDate: {
        type: Date,
        required: true
    },
    eventType: {
        type: String,
        trim: true,
    },
    eventTime: {
        type: String,
        trim: true,
    },
});

const Event = mongoose.model("Events", EventSchema);

module.exports = Event;

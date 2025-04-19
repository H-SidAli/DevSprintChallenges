const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema({
    eventRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ParticipationRequests",
        required: true,
    },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    isAccepted: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
});

const Notifications = mongoose.model("Notifications", notificationSchema);
module.exports = Notifications;

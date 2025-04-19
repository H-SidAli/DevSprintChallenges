const mongoose = require('mongoose');
const { Schema } = mongoose;

const ParticipationRequestsSchema = new Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Events', required: true },
    participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    status: { type: String, enum: ['Accepted', 'Rejected', 'Pending', 'CanceledByUser'], default: 'Pending' },
    // encoded in base64
    qrCode : { type: String ,default: null },
})

const ParticipationRequests = mongoose.model('ParticipationRequests', ParticipationRequestsSchema);
module.exports = ParticipationRequests ;
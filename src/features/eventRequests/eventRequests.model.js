const mongoose = require('mongoose');
const { Schema } = mongoose;

const ParticipationRequestsSchema = new Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Events', required: true },
    participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    status: { type: String, enum: ['Accepted', 'Rejected', 'Pending'], default: 'Pending' },
})

const ParticipationRequests = mongoose.model('ParticipationRequests', ParticipationRequestsSchema);
module.exports = ParticipationRequests ;
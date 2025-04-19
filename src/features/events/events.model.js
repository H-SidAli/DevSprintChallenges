const mongoose = require('mongoose');
const { Schema } = mongoose;
const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    responsible_person: { type: String, required: true },
    status: {type: String,enum: ['Completed','Upcoming','Cancelled'],required: true,default: 'Upcoming'},
    type: { type: String, enum: ['Hackathon', 'Workshop', 'Test', 'Meeting','Sprint','Hack Day','Bootcamp','Talk'], required: true },
    duration: { type: Number, required: true },
});
const Events = mongoose.model('Events', eventSchema);
module.exports = Events;



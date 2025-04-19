const Users = require("../users/users.model");
const Events = require("./events.model");

async function getAllEvents() {
    try {
        const events = await Events.find().lean();
        return events;
    
    } catch (error) {
        console.error('Error fetching events:', error);
        throw new Error('Failed to fetch events');
    }
}

async function editEvent(eventId, updatedEvent) {
    try {
        const event = await Events.findById(eventId);
        if (!event) {
            throw new Error('Event not found');
        }
        Object.assign(event, updatedEvent);
        await event.save();
        return event;
    } catch (error) {
        console.error('Error updating event:', error);
        throw new Error('Failed to update event');
    }
}


module.exports = {
    getAllEvents,
    
};
const Users = require("../users/users.model");
const Events = require("./events.model");

async function getAllEvents() {
    try {
        const events = await Events.find().lean();
        return events;
    } catch (error) {
        console.error("Error fetching events:", error);
        throw new Error("Failed to fetch events");
    }
}

async function editEvent(eventId, updatedEvent) {
    try {
        const event = await Events.findById(eventId);
        if (!event) {
            throw new Error("Event not found");
        }
        Object.assign(event, updatedEvent);
        await event.save();
        return event;
    } catch (error) {
        console.error("Error updating event:", error);
        throw new Error("Failed to update event");
    }
}

async function addEventsFromCSV(eventsData) {
    // Map the CSV data to your model schema - fixed field mapping
    const formattedEvents = eventsData.map((event) => ({
        title: event.title,           // changed from event.name
        description: event.description || "",
        date: new Date(event.date),
        location: event.location,
        responsible_person: event.responsible_person,
        status: event.status,
        type: event.type,
        duration: parseInt(event.duration, 10),  // Convert to number
    }));

    // Insert many events at once
    const insertedEvents = await Events.insertMany(formattedEvents);
    return insertedEvents;
}

module.exports = {
    getAllEvents,
    editEvent,
    addEventsFromCSV,
};

const Users = require("../users/users.model");
const Events = require("./events.model");
const eventsService = require("./events.service");

async function getAllEvents(req, res) {
    try {
        const events = await eventsService.getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving events" });
    }
    }

async function editEvent(req, res) {
    try {
        const eventId = req.params.id;
        const eventData = req.body;
        const updatedEvent = await eventsService.editEvent(eventId, eventData);
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: "Error updating event" });
    }

}

module.exports = {
    getAllEvents,
    editEvent,
}

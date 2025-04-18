const Users = require("../users/users.model");
const Events = require("./events.model");
const eventsService = require("./events.service");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const eventRequests = require("../eventRequests/eventRequests.controller");
const Notifications = require("../notifications/notifications.model");
const ParticipationRequests = require("../eventRequests/eventRequests.model");

//jebthom mn gpt jma3a, middlewares ta3 l upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, "../../uploads");
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept only CSV files
        if (
            file.mimetype === "text/csv" ||
            file.originalname.endsWith(".csv")
        ) {
            cb(null, true);
        } else {
            cb(new Error("Only CSV files are allowed"), false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB max size
});

async function getAllEvents(req, res) {
    try {
        // Get the user from the request
        const user = req.user;
        let events;

        if (user && user.isAdmin) {
            // Admin users can see all events
            events = await Events.find({});
        } else {
            // Regular users only see non-cancelled events
            events = await Events.find({ status: "Upcoming" });
        }

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving events" });
    }
}

function validateEventData(data, rowNumber) {
    // Required fields (adjust based on your event model)
    const requiredFields = [
        "title",
        "description",
        "date",
        "location",
        "responsible_person",
        "status",
        "type",
        "duration",
    ];

    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === "") {
            return {
                row: rowNumber,
                message: `Missing required field: ${field}`,
            };
        }
    }

    // Validate date format
    if (
        data.date &&
        !/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/.test(data.date)
    ) {
        return {
            row: rowNumber,
            message:
                "Invalid date format. Use YYYY-MM-DD or YYYY-MM-DDThh:mm:ss",
        };
    }

    return null;
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

async function addEventsCSV(req, res) {
    // Use multer as middleware
    // the file sent from postman lazem ykon esmo csvFile
    upload.single("csvFile")(req, res, async function (err) {
        if (err) {
            return res
                .status(400)
                .json({ success: false, message: err.message });
        }

        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: "No file uploaded" });
        }

        try {
            const results = [];
            const errors = [];
            let rowCount = 0;

            // Process the CSV file
            fs.createReadStream(req.file.path)
                .pipe(csv())
                .on("data", (data) => {
                    rowCount++;
                    // Validate required fields
                    const validationError = validateEventData(data, rowCount);
                    if (validationError) {
                        errors.push(validationError);
                    } else {
                        results.push(data);
                    }
                })
                .on("end", async () => {
                    // Delete the file after processing
                    fs.unlinkSync(req.file.path);

                    if (errors.length > 0) {
                        return res.status(400).json({
                            success: false,
                            message: "Validation errors in CSV file",
                            errors,
                        });
                    }

                    // Insert valid records
                    try {
                        const insertedEvents =
                            await eventsService.addEventsFromCSV(results);
                        res.status(201).json({
                            success: true,
                            message: `Successfully added ${insertedEvents.length} events`,
                            data: insertedEvents,
                        });
                    } catch (dbError) {
                        res.status(500).json({
                            success: false,
                            message: "Error inserting events to database",
                            error: dbError.message,
                        });
                    }
                });
        } catch (error) {
            // Make sure to delete the file if an error occurs
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            res.status(500).json({
                success: false,
                message: "Error processing CSV file",
                error: error.message,
            });
        }
    });
}

async function getEventById(req, res) {
    try {
        const eventId = req.params.id;
        const event = await eventsService.getEventById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving event" });
    }
}

// deleting an event softly, and only when the event is still "Upcoming"
async function deleteEvent(req, res) {
    try {
        const eventId = req.params.id;
        const event = await eventsService.getEventById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.status !== "Upcoming") {
            return res.status(400).json({
                message:
                    "Cannot delete an event that is not upcoming (Already completed or cancelled)",
            });
        }

        event.status = "Cancelled"; // Soft delete by changing status
        await event.save();

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event" });
    }
}

// Function to handle participant requests
async function participantRequest(req, res) {
    try {
        const eventId = req.params.id;
        const { participantId } = req.body;

        // Check if the request already exists
        const existingRequest = await ParticipationRequests.findOne({
            eventId,
            participantId,
        });
        if (existingRequest) {
            return res.status(400).json({ message: "Request already exists" });
        }

        const newRequest = new ParticipationRequests({
            eventId,
            participantId,
            status: "Pending",
        });
        await newRequest.save();

        // Create a new notification for the admin
        const notification = new Notifications({
            eventRequestId: newRequest._id,
            content: `New participation request for event ID: ${eventId}`,
            isRead: false,
        });
        // notifying the admin in the platform, no need for spam emails
        await notification.save();


        res.status(201).json({
            message: "Request created successfully",
            request: newRequest,
            id: newRequest._id,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating request",
            error: error.message,
        });
    }
}

module.exports = {
    getAllEvents,
    editEvent,
    addEventsCSV,
    getEventById,
    deleteEvent,
    participantRequest,
};

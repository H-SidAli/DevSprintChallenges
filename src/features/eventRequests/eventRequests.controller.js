const eventRequestsService = require("./eventRequests.service");
const eventRequests = require("./eventRequests.model");
const {
    approveParticipant,
} = require("../notifications/notifications.service");
const ParticipationRequests = require("./eventRequests.model");
const Notifications = require("../notifications/notifications.model");

async function handleRequest(req, res) {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        const request = await ParticipationRequests.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (status === "Accepted") {
            request.status = "Accepted";
            await request.save();

            await approveParticipant(requestId);

            return res
                .status(200)
                .json({ message: "Request approved and email sent" });
        } else if (status === "Rejected") {
            request.status = "Rejected";
            await request.save();

            // Send notification to the participant about rejection per mail

            return res.status(200).json({ message: "Request rejected" });
        } else {
            return res.status(400).json({ message: "Invalid action" });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error handling request",
            error: error.message,
        });
    }
}

async function getAllEventsRequests(req, res) {
    try {
        if (req.user.isAdmin) {
            const requests = await eventRequests.find({});
            res.status(200).json({ message: "All requests", requests });
        } else {
            const requests = await eventRequests.find({
                participantId: req.user.id,
            });
            res.status(200).json({ message: "All requests", requests });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error fetching requests",
            error: error.message,
        });
    }
}
async function cancelRequest(req, res) {
    try {
        const { requestId } = req.params;
        const request = await ParticipationRequests.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.status === "Accepted") {
            return res.status(400).json({
                message: "Cannot cancel an accepted request",
            });
        }

        request.status = "CanceledByUser";
        await request.save();

        res.status(200).json({ message: "Request canceled successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching requests",
            error: error.message,
        });
    }
}

module.exports = { handleRequest, getAllEventsRequests, cancelRequest };

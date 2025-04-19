const express = require("express");
const router = express.Router();
const eventsController = require("./events.controller");
const {
    authenticate,
    restrictTo,
} = require("../../middlewares/auth.middleware");

router.post(
    "/addEventCSV",
    authenticate,
    restrictTo("admin"),
    eventsController.addEventsCSV
);

// get all the events requests for the admin, the user will get only the upcoming ones
router.get("/", authenticate, eventsController.getAllEvents);
// router.get("/:id", eventsController.getEventById);
router.put(
    "/:id",
    authenticate,
    restrictTo("admin"),
    eventsController.editEvent
);

router.delete(
    "/:id",
    authenticate,
    restrictTo("admin"),
    eventsController.deleteEvent
);
router.post(
    "/:id/participate",
    authenticate,
    restrictTo("user"),
    eventsController.participantRequest
);

module.exports = router;

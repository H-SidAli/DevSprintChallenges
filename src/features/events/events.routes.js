const express = require("express");
const router = express.Router();
const {
    authenticate,
    restrictTo,
} = require("../../middlewares/auth.middleware");

const eventsController = require("./events.controller");

router.post("/addEventCSV", authenticate, restrictTo("admin"), eventsController.addEventsCSV);
router.get("/", authenticate, eventsController.getAllEvents);
// router.get("/:id", eventsController.getEventById);
router.put(
    "/:id",
    authenticate,
    restrictTo("admin"),
    eventsController.editEvent
);

module.exports = router;

const express = require("express");
const router = express.Router();
const eventRequestsController = require("./eventRequests.controller");
const {
    restrictTo,
    authenticate,
} = require("../../middlewares/auth.middleware");

// handle event requests (Approve/Reject)
router.put(
    "/:requestId/handle",
    authenticate,
    restrictTo("admin"),
    eventRequestsController.handleRequest
);

// get all the event requests for the admin, only the requests of the logged in user for the participant
router.get(
    "/",
    authenticate,
    eventRequestsController.getAllEventsRequests
);

// allowing the user to cancel their request
router.put(
    "/:requestId/cancel",
    authenticate,
    restrictTo("user"),
    eventRequestsController.cancelRequest
);

module.exports = router;

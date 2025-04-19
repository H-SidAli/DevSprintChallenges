const express = require("express");
const router = express.Router();

// importing the features
const authRoutes = require("./features/auth/auth.routes");
const eventsRoutes = require("./features/events/events.routes");
const eventRequestsRoutes = require("./features/eventRequests/eventRequests.routes");
const notificationsRoutes = require("./features/notifications/notifications.routes");

// using the "/auth" for the auth route
router.use("/auth", authRoutes);
// using the "/api/" for others
router.use("/api/events", eventsRoutes)
router.use("/api/eventRequests", eventRequestsRoutes);
router.use("/api/notifications", notificationsRoutes);


module.exports = router;

const express = require("express");
const router = express.Router();

// importing the features
const authRoutes = require("./features/auth/auth.routes");
const eventsRoutes = require("./features/events/events.routes");

// using the "/auth" for the auth route
router.use("/auth", authRoutes);
// using the "/api/" for others
router.use("/api/events", eventsRoutes)




module.exports = router;

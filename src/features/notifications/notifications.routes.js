const express = require('express');
const router = express.Router();
const { restrictTo, authenticate } = require("../../middlewares/auth.middleware");
const notificationsController = require("./notifications.controller");

// getting all the notifications
router.get('/', authenticate, restrictTo('admin'), notificationsController.getAllNotifications);
// getting a specific notification by id and marking it as read
router.post('/:id/read', authenticate, restrictTo('admin'), notificationsController.markAsRead);
// getting a specific notification by id and marking it as unread
router.post('/:id/unread', authenticate, restrictTo('admin'), notificationsController.markAsUnread);
module.exports = router;



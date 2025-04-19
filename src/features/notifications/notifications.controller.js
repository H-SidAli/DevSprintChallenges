const Notification = require("../notifications/notifications.model");

// l Admin y fetchi notifications li mazal ma 9rahom
async function getAllNotifications(req, res) {
    const notifications = await Notification.find({ isRead: false }).sort({
        createdAt: -1,
    });
    res.json(notifications);
}

// l Admin marks y marki notifications li 9rahom as read
async function markAsRead(req, res) {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
}

async function markAsUnread(req, res) {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: false });
    res.json({ success: true });
}

module.exports = {
    getAllNotifications,
    markAsRead,
    markAsUnread,
}

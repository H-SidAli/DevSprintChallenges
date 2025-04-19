const Users = require("../users/users.model");
const Events = require("./events.model");
const eventsService = require("./events.service");

// l user y submitti participation request
app.post('/event-request', async (req, res) => {
    const { userName, eventName } = req.body;

    const notification = new Notification({
        message: `${userName} has requested to join the event: ${eventName}`
    });

    await notification.save();

    res.status(200).json({ success: true, message: 'Request submitted!' });
});

// l Admin y fetchi notifications li mazal ma 9rahom
app.get('/admin/notifications', async (req, res) => {
    const notifications = await Notification.find({ isRead: false }).sort({ createdAt: -1 });
    res.json(notifications);
});

// l Admin marks y marki notifications li 9rahom as read
app.post('/admin/notifications/:id/read', async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
});
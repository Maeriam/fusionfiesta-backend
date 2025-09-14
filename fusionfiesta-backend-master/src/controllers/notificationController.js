import Notification from "../models/Notification.js";

// Create notification
export const createNotification = async (req, res) => {
  try {
    const { userId, message, type } = req.body;
    const notif = await Notification.create({ user: userId, message, type });
    res.status(201).json({ message: "Notification created", notif });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark as read
export const markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ message: "Notification not found" });

    notif.read = true;
    await notif.save();
    res.json({ message: "Notification marked as read", notif });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

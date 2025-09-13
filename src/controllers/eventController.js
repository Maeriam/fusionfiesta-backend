import Event from "../models/Event.js";
import User from "../models/User.js";
import Certificate from "../models/certificate.js";
import Feedback from "../models/feedback.js";


// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single event
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create event (organizer or admin only)
export const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const event = new Event({
      title,
      description,
      date,
      createdBy: req.user._id,
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Register for event (student)
export const registerForEvent = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if already registered
    if (event.registeredUsers.includes(user._id)) {
      return res.status(400).json({ message: "Already registered" });
    }

    event.registeredUsers.push(user._id);
    await event.save();

    res.json({ message: "Registered successfully", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve event (admin only)
export const approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.approved = true;
    await event.save();

    res.json({ message: "Event approved", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload certificate
export const uploadCertificate = async (req, res) => {
  try {
    const { eventId, participantId, fileUrl, paid, qrCode } = req.body;

    const certificate = await Certificate.create({
      event: eventId,
      participant: participantId,
      fileUrl,
      paid,
      qrCode,
    });

    res.status(201).json({ message: "Certificate uploaded", certificate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Download certificates for a student
export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ participant: req.user._id }).populate("event", "title date");
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Submit feedback
export const submitFeedback = async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;

    const feedback = await Feedback.create({
      event: eventId,
      participant: req.user._id,
      rating,
      comment,
      approved: true,
    });

    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update event status (organizer only)
export const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body; // Live, Completed, etc.
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Access denied" });

    event.status = status;
    await event.save();

    res.json({ message: "Event status updated", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelRegistration = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.registeredUsers = event.registeredUsers.filter(
      id => id.toString() !== req.user._id.toString()
    );

    await event.save();
    res.json({ message: "Registration cancelled", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
import Event from "../models/Event.js";
<<<<<<< HEAD
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
=======

// Create Event (Organizer only)
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, bannerUrl } = req.body;

>>>>>>> 7779c856bd7116de54fee311847d516524e35faf
    const event = new Event({
      title,
      description,
      date,
<<<<<<< HEAD
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
=======
      bannerUrl,
      createdBy: req.user._id,
    });

    await event.save();

    res.status(201).json({
      message: "Event created successfully (pending admin approval)",
      event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all events (public, only approved)
export const getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ approved: true }).populate("createdBy", "name email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all events (admin only - see unapproved too)
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email role");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve Event (Admin only)
>>>>>>> 7779c856bd7116de54fee311847d516524e35faf
export const approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.approved = true;
    await event.save();

    res.json({ message: "Event approved", event });
<<<<<<< HEAD
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
=======
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single event (public if approved OR organizer/admin)
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email role");
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.approved && req.user?.role !== "Admin" && !event.createdBy.equals(req.user?._id)) {
      return res.status(403).json({ message: "Event not approved yet" });
    }
    // if (!event.approved && req.user?.role !== "Admin" && !event.createdBy.equals(req.user?._id)) {
    //   return res.status(403).json({ message: "Event not approved yet" });
    // }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Update Event (Organizer or Admin)
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, bannerUrl } = req.body;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Allow only Admin or event creator
    if (
      req.user.role !== "Admin" &&
      event.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to update this event" });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.bannerUrl = bannerUrl || event.bannerUrl;
    event.approved = false; // if organizer edits, event needs re-approval

    await event.save();

    res.json({ message: "Event updated (awaiting re-approval if edited)", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Event (Organizer or Admin)
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Allow only Admin or event creator
    if (
      req.user.role !== "Admin" &&
      event.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
>>>>>>> 7779c856bd7116de54fee311847d516524e35faf
  }
};
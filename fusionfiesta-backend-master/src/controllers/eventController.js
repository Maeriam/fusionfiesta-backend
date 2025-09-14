import Event from "../models/Event.js";
import User from "../models/User.js";
import Certificate from "../models/certificate.js";
import Feedback from "../models/feedback.js";
import crypto from "crypto"; 

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

    // Only participants can register
    if (user.role !== "student") {
      return res.status(403).json({ message: "Only participants can register for events" });
    }

    // Check duplicate registration
    if (event.registeredUsers.includes(user._id)) {
      const existingCert = await Certificate.findOne({ event: event._id, participant: user._id });
      return res.status(200).json({ 
        message: "Already registered", 
        certificate: existingCert,
      });
    }

    // Register user
    event.registeredUsers.push(user._id);
    await event.save();

    // Generate QR code
    const qrCode = crypto.randomBytes(4).toString("hex"); // 8-char code

    // Create certificate
    const certificate = await Certificate.create({
      event: event._id,
      participant: user._id,
      fileUrl: `http://localhost:5000/certificates/certificate-${event._id}-${user._id}.pdf`,
      paid: true,
      qrCode,
    });

    res.status(201).json({
      message: "Registered successfully and certificate created",
      certificate,
    });

  } catch (err) {
    console.error("❌ registerForEvent error:", err);
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
// Upload certificate (only for registered participants)
export const uploadCertificate = async (req, res) => {
  try {
    const { eventId, participantId, fileUrl, paid, qrCode } = req.body;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if participant is registered
    if (!event.registeredUsers.includes(participantId)) {
      return res.status(400).json({ message: "User is not registered for this event" });
    }

    // Create certificate
    const certificate = await Certificate.create({
      event: eventId,
      participant: participantId,
      fileUrl,
      paid,
      qrCode,
    });

    res.status(201).json({ message: "Certificate uploaded", certificate });
  } catch (err) {
    console.error("❌ uploadCertificate error:", err);
    res.status(500).json({ message: err.message });
  }
};


// Download certificates for a student
export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ participant: req.user._id })
      .populate("event", "title date");
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

export const upgradeToParticipant = async (req, res) => {
  try {
    const { enrolmentNumber, department, collegeIdProof } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "participant";
    user.enrolmentNumber = enrolmentNumber;
    user.department = department;
    user.collegeIdProof = collegeIdProof;

    await user.save();

    res.status(200).json({ message: "Upgraded to participant", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/events/:id/stats
export const getEventStats = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("registeredUsers", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Only organizer who created the event or admin can view stats
    if (req.user.role === "organizer" && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const feedbacks = await Feedback.find({ event: event._id })
      .populate("participant", "name email");

    res.json({
      participantCount: event.registeredUsers.length,
      feedbacks: feedbacks.map(f => ({
        participant: f.participant.name,
        rating: f.rating,
        comment: f.comment,
      })),
    });
  } catch (err) {
    console.error("❌ getEventStats error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/events/:id/participants
export const getParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "registeredUsers",
      "name email enrolmentNumber department"
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Access denied" });

    res.json({ participants: event.registeredUsers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// POST /api/events/:id/co-organizers
export const addCoOrganizer = async (req, res) => {
  try {
    const { userId } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Access denied" });

    if (!event.coOrganizers.includes(userId)) {
      event.coOrganizers.push(userId);
      await event.save();
    }

    res.json({ message: "Co-organizer added", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/events/:id/co-organizers/:userId
export const removeCoOrganizer = async (req, res) => {
  try {
    const { userId } = req.params;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Access denied" });

    event.coOrganizers = event.coOrganizers.filter(id => id.toString() !== userId);
    await event.save();

    res.json({ message: "Co-organizer removed", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Access denied" });

    await event.remove();
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// PATCH /api/events/:id
export const editEvent = async (req, res) => {
  try {
    const { title, description, date, venue, category, registrationLimit } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });
    // if (event.createdBy.toString() !== req.user._id.toString())
    //   return res.status(403).json({ message: "Access denied" });

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (venue) event.venue = venue;
    if (category) event.category = category;
    if (registrationLimit) event.registrationLimit = registrationLimit;

    await event.save();
    res.json({ message: "Event updated", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyEvents = async (req, res) => {
  const events = await Event.find({ createdBy: req.user._id });
  res.json(events);
};

export const getDashboardData = async (req, res) => {
  try {
    const organizerId = req.user._id;

    // All events created by this organizer
    const eventsCreated = await Event.find({ createdBy: organizerId })
      .populate("registeredUsers", "name email")
      .populate("coOrganizers", "name email");

    // Total registrations per event
    const registrationCounts = eventsCreated.map(event => ({
      eventId: event._id,
      count: event.registeredUsers.length,
    }));

    // Optional: gather feedbacks for all events
    const feedbacks = await Feedback.find({ event: { $in: eventsCreated.map(e => e._id) } })
      .populate("participant", "name email");

    res.json({
      eventsCreated,
      registrationCounts,
      feedbacks: feedbacks.map(f => ({
        participant: f.participant.name,
        rating: f.rating,
        comment: f.comment,
      })),
    });
  } catch (err) {
    console.error("❌ getDashboardData error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


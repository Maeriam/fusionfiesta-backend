import Event from "../models/Event.js";

// Create Event (Organizer only)
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, bannerUrl } = req.body;

    const event = new Event({
      title,
      description,
      date,
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
export const approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.approved = true;
    await event.save();

    res.json({ message: "Event approved", event });
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
  }
};
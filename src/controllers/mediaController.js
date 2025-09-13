import Media from "../models/Media.js";

// Upload media (organizer/admin)
export const uploadMedia = async (req, res) => {
  try {
    const { title, type, url, event, category } = req.body;
    const media = await Media.create({
      title,
      type,
      url,
      event,
      category,
      uploadedBy: req.user._id,
      approved: req.user.role === "admin" ? true : false,
    });
    res.status(201).json({ message: "Media uploaded", media });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get media gallery
export const getMediaGallery = async (req, res) => {
  try {
    const media = await Media.find({ approved: true }).populate("event", "title date");
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve media (admin)
export const approveMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    media.approved = true;
    await media.save();
    res.json({ message: "Media approved", media });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

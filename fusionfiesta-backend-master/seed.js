import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "./src/models/User.js";
import Event from "./src/models/Event.js";
import Certificate from "./src/models/certificate.js";
import Feedback from "./src/models/feedback.js";
import Media from "./src/models/Media.js";
import Notification from "./src/models/Notification.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Certificate.deleteMany({});
    await Feedback.deleteMany({});
    await Media.deleteMany({});
    await Notification.deleteMany({});
    console.log("🗑️ Cleared existing data");

    // Hash passwords
    const password = await bcrypt.hash("password123", 10);

    // ===== Users =====
    const admin = await User.create({
      name: "Admin User",
      email: "admin@college.edu",
      password,
      role: "admin",
      approved: true,
    });

    const organizer1 = await User.create({
      name: "Organizer One",
      email: "org1@college.edu",
      password,
      role: "organizer",
      approved: true,
    });

    const organizer2 = await User.create({
      name: "Organizer Two",
      email: "org2@college.edu",
      password,
      role: "organizer",
      approved: true,
    });

    const studentVisitor = await User.create({
      name: "Student Visitor",
      email: "visitor1@student.edu",
      password,
      role: "student",
      approved: true,
    });

    const participant1 = await User.create({
      name: "Student Participant 1",
      email: "participant1@student.edu",
      password,
      role: "student",
      enrolmentNumber: "ENR001",
      department: "Computer Science",
      collegeIdProof: "proof1.jpg",
      approved: true,
    });

    const participant2 = await User.create({
      name: "Student Participant 2",
      email: "participant2@student.edu",
      password,
      role: "student",
      enrolmentNumber: "ENR002",
      department: "Mechanical",
      collegeIdProof: "proof2.jpg",
      approved: true,
    });

    console.log("👤 Sample users created");

    // ===== Events =====
    const event1 = await Event.create({
      title: "Tech Talk",
      description: "A session on modern web technologies.",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      venue: "Auditorium",
      category: "technical",
      registrationLimit: 50,
      bannerImage: "tech_talk.jpg",
      guidelinesDocument: "guidelines1.pdf",
      coOrganizers: [organizer2._id],
      createdBy: organizer1._id,
      approved: true,
      status: "Live",
    });

    const event2 = await Event.create({
      title: "Cultural Fest",
      description: "A day of cultural performances and competitions.",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      venue: "Open Ground",
      category: "cultural",
      registrationLimit: 100,
      bannerImage: "cultural_fest.jpg",
      createdBy: organizer2._id,
      approved: true,
      status: "Pending",
    });

    const event3 = await Event.create({
      title: "Sports Meet",
      description: "Annual sports competition across departments.",
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      venue: "Sports Complex",
      category: "sports",
      registrationLimit: 200,
      createdBy: organizer1._id,
      approved: true,
      status: "Pending",
    });

    console.log("📅 Sample events created");

    // ===== Event Registrations =====
    event1.registeredUsers.push(participant1._id);
    event2.registeredUsers.push(participant1._id, participant2._id);
    await event1.save();
    await event2.save();

    // ===== Certificates =====
    await Certificate.create({
      event: event1._id,
      participant: participant1._id,
      fileUrl: "certificate1.pdf",
      paid: true,
      qrCode: "QR123ABC",
    });

    console.log("🏆 Certificates created");

    // ===== Feedback =====
    await Feedback.create({
      event: event1._id,
      participant: participant1._id,
      rating: 5,
      comment: "Amazing session, very informative!",
      approved: true,
    });

    await Feedback.create({
      event: event2._id,
      participant: participant2._id,
      rating: 4,
      comment: "Great organization and fun activities.",
      approved: true,
    });

    console.log("📝 Feedback added");

    // ===== Media Gallery =====
    await Media.create({
      title: "Tech Talk Banner",
      type: "image",
      url: "https://example.com/tech_talk.jpg",
      event: event1._id,
      uploadedBy: organizer1._id,
      approved: true,
    });

    await Media.create({
      title: "Cultural Dance Video",
      type: "video",
      url: "https://example.com/cultural_dance.mp4",
      event: event2._id,
      uploadedBy: organizer2._id,
      approved: true,
    });

    console.log("🖼 Media gallery seeded");

    // ===== Bookmarks =====
    participant1.bookmarkedEvents.push(event2._id); // Cultural Fest
    participant2.bookmarkedEvents.push(event1._id); // Tech Talk
    await participant1.save();
    await participant2.save();

    console.log("🔖 Bookmarks seeded");


    await Notification.create([
  {
    user: participant1._id,
    type: "event",
    message: "You are registered for Tech Talk on 2025-09-20.",
    relatedEvent: event1._id,
    read: false,
  },
  {
    user: participant1._id,
    type: "system",
    message: "New event Cultural Fest has been approved!",
    read: false,
  },
  {
    user: organizer1._id,
    type: "event",
    message: "Participant1 has registered for Tech Talk.",
    relatedEvent: event1._id,
    read: false,
  },
  {
    user: admin._id,
    type: "system",
    message: "3 events are pending approval.",
    read: false,
  },
]);

console.log("🔔 Notifications seeded");

    console.log("✅ Database seeding completed!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

connectDB().then(seedData);

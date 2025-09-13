import User from "../models/User.js";
import Event from "../models/Event.js";
import Certificate from "../models/certificate.js";
import Feedback from "../models/feedback.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";


// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // create token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Upgrade a student visitor to participant
export const upgradeToParticipant = async (req, res) => {
  try {
    const { enrolmentNumber, department, collegeIdProof } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "student") return res.status(400).json({ message: "Only students can upgrade" });

    user.enrolmentNumber = enrolmentNumber;
    user.department = department;
    user.collegeIdProof = collegeIdProof;
    await user.save();

    res.json({ message: "Upgraded to participant", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin approves staff member
export const approveStaff = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    if (staff.role !== "organizer") return res.status(400).json({ message: "User is not a staff member" });

    staff.approved = true;
    await staff.save();

    res.json({ message: "Staff approved", staff });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get dashboard data
export const getDashboard = async (req, res) => {
  try {
    const user = req.user;

    if (user.role === "student") {
      const registeredEvents = await Event.find({ registeredUsers: user._id });
      const upcomingEvents = await Event.find({ approved: true, date: { $gte: new Date() } });

      res.json({
        role: "student",
        registeredEvents,
        upcomingEvents,
        bookmarks: user.bookmarkedEvents,
      });
    } else if (user.role === "organizer") {
      const eventsCreated = await Event.find({ createdBy: user._id });
      const registrationCounts = await Promise.all(
        eventsCreated.map(async (ev) => ({ eventId: ev._id, count: ev.registeredUsers.length }))
      );

      res.json({
        role: "organizer",
        eventsCreated,
        registrationCounts,
      });
    } else if (user.role === "admin") {
      const totalUsers = await User.countDocuments();
      const totalEvents = await Event.countDocuments();
      const pendingEvents = await Event.find({ approved: false });

      res.json({
        role: "admin",
        totalUsers,
        totalEvents,
        pendingEvents,
      });
    } else {
      res.status(400).json({ message: "Unknown role" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email (simplified)
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      text: `Use this token to reset your password: ${resetToken}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset token sent to email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { User, UserSchemaValidation } = require("./User.model");
const Project = require("./Project.model");
const authGuard = require("./auth.middleware");

// =====================
// REGISTER
// =====================
router.post("/register", async (req, res) => {
  try {
    const validation = UserSchemaValidation.safeParse(req.body);

    if (!validation.success) {
      const errors = validation.error.issues.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));

      return res.status(400).json({ errors });
    }

    const { username, email, password } = req.body;

    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: { username, email },
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }

    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

// =====================
// LOGIN
// =====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error during login",
    });
  }
});

// =====================
// PROFILE (Protected)
// =====================
router.get("/profile", authGuard, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
    });
  }
});

// =====================
// CREATE PROJECT (Protected)
// =====================
router.post("/projects", authGuard, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }

    const project = new Project({
      name,
      owner: req.user.userId,
    });

    await project.save();

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error creating project",
    });
  }
});

// =====================
// GET PROJECTS (Protected)
// =====================
router.get("/projects", authGuard, async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error fetching projects",
    });
  }
});

router.delete("/project/:id", authGuard, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId,
    });

    if (!project) {
      return res
        .status(404)
        .json({ error: "Project not found or unauthorized" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error during deletion" });
  }
});

module.exports = router;

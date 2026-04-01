const mongoose = require("mongoose");
const { z } = require("zod");
const bcrypt = require("bcrypt");

// Zod validation schema
const UserSchemaValidation = z.object({
  username: z.string().min(3, "Username must be 3 chars"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password too short"),
});

// Mongoose schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Optional: method to compare password (useful for login)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = { User, UserSchemaValidation };

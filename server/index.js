const express = require("express");
const connectDB = require("./db");
require("dotenv").config();
const userRoutes = require("./user.routes");

const app = express();

connectDB();

app.use(express.json());

app.use("/api", userRoutes);

app.get("/status", (req, res) => {
  res.send({
    status: "Online",
    message: "Server is running like a pro",
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server flying on ${PORT}`));

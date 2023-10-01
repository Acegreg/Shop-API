const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://oshodingregory:kibagatsuga419@cluster0.alejsfs.mongodb.net/Node-API?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const shopItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  isInStock: Boolean,
});

const ShopItem = mongoose.model("ShopItem", shopItemSchema);

const userSchema = new mongoose.Schema({
  fullName: String,
  username: String,
  password: String,
  role: { type: String, enum: ["user", "admin"] },
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("Welcome to the Shop API!");
});

// View all shop items
app.get("/shopitems", async (req, res) => {
  const items = await ShopItem.find();
  res.json(items);
});

// View a single shop item by ID
app.get("/shopitems/:id", async (req, res) => {
  const item = await ShopItem.findById(req.params.id);
  res.json(item);
});

// Add a new shop item (only for admins)
app.post("/shopitems", (req, res) => {
  const userRole = req.body.userRole; // Assuming you have a way to identify the user's role

  if (userRole === "admin") {
    const newItem = new ShopItem(req.body);
    newItem.save();
    res.json(newItem);
  } else {
    res.status(403).json({ error: "action-not-allowed" });
  }
});

// Update a shop item by ID (only for admins)
app.put("/shopitems/:id", (req, res) => {
  const userRole = req.body.userRole; // Assuming you have a way to identify the user's role

  if (userRole === "admin") {
    ShopItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (err, updatedItem) => {
        if (err) throw err;
        res.json(updatedItem);
      }
    );
  } else {
    res.status(403).json({ error: "action-not-allowed" });
  }
});

// Delete a shop item by ID (only for admins)
app.delete("/shopitems/:id", (req, res) => {
  const userRole = req.body.userRole; // Assuming you have a way to identify the user's role

  if (userRole === "admin") {
    ShopItem.findByIdAndRemove(req.params.id, (err, deletedItem) => {
      if (err) throw err;
      res.json(deletedItem);
    });
  } else {
    res.status(403).json({ error: "action-not-allowed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

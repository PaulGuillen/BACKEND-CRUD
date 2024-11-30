const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const BASE_URL =
  "mongodb+srv://paulguillen190:TTe2PBa5Ab3cDRaS@ecommerce.1dyca.mongodb.net/ecommerce?retryWrites=true&w=majority";

mongoose
  .connect(BASE_URL)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("No se pudo conectar a MongoDB", err));

const Item = require("./models/item");

app.post("/api/items", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await Item.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({message: "Item deleted"});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

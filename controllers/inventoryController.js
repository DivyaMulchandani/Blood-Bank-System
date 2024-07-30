const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

const createInventoryController = async (req, res) => {
  try {
    //validation
    const { email, inventoryType } = req.body;
    const { name, description, price, quantity } = req.body;
    const user = await userModel.findOne({
      email: email,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (inventoryType === "in" && user.role !== "donar") {
      res
        .status(403)
        .json({ message: "You are not authorized to add inventory" });
      throw new Error("Not a Donar account."); ///a change done check here if error comes
    }
    if (inventoryType === "out" && user.role !== "hospital") {
      throw new Error("Not a hospital");
    }

    //save record
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    res.status(201).json({
      success: true,
      message: "Inventory created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error creating inventory",
      success: false,
      error,
    });
  }
};

//GET ALL INVENTORY
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Inventory found successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error fetching inventory",
      success: false,
      error,
    });
  }
};

module.exports = { createInventoryController, getInventoryController };

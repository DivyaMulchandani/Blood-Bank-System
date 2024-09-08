const mongoose = require("mongoose");
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
    // if (inventoryType === "in" && user.role !== "donar") {
    //   res
    //     .status(403)
    //     .json({ message: "You are not authorized to add inventory" });
    //   throw new Error("Not a Donar account."); ///a change done check here if error comes
    // }
    // if (inventoryType === "out" && user.role !== "hospital") {
    //   throw new Error("Not a hospital");
    // }

    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);
      //calculate Blood Quantity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      //console.log("Total in:", totalInOfRequestedBlood);
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;

      //calculate out blood Quantity
      const totalOutOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      //console.log("Total out:", totalOutOfRequestedBlood);
      const totalOut = totalOutOfRequestedBlood[0]?.total || 0;

      //in and out calc
      const availableQuatityOfBloodGroup = totalIn - totalOut;

      //quantity validation
      if (availableQuatityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
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

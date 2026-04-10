const transectionModel = require("../models/transectionModel");
const moment = require("moment");
const { customAlphabet } = require("nanoid");
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const getAllTransaction = async (req, res) => {
  try {
    const { frequency, selectedDate, type } = req.body;
    const transactions = await transectionModel.find({
      ...(frequency !== "custom"
        ? {
            date: {
              $gt: moment().subtract(Number(frequency), "d").toDate(),
            },
          }
        : {
            date: {
              $gte: selectedDate[0],
              $lte: selectedDate[1],
            },
          }),
      expenseAppUserId: req.user.expenseAppUserId,
      ...(type !== "all" && { type }),
    });
    res
      .status(200)
      .json({
        status: "success.",
        message: "All transactions fetched successfully.",
        transactions: transactions,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        status: "failed",
        message: "Failed to fetch transactions.",
        error: error,
      });
  }
};
const getOneTransaction = async (req, res) => {
  const { transactionId } = req.params;
  try {
    const transaction = await transectionModel.findOne({
      transactionId: transactionId,
      expenseAppUserId: req.user.expenseAppUserId, // Ensure user can only access their own transactions
    });
    
    if (!transaction) {
      return res.status(404).json({
        status: "failed",
        message: "Transaction not found or you don't have access to this transaction.",
      });
    }
    
    res
      .status(200)
      .json({
        status: "success",
        message: "Transaction fetched successfully.",
        transaction: transaction,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        status: "failed",
        message: "Failed to fetch transaction.",
        error: error,
      });
  }
};
const addTransaction = async (req, res) => {
  const { amount, type, category, refrence, description, date } = req.body;
  try {
    // Generate a Nano ID for user
    const nanoid = customAlphabet(alphabet, 10); // 10 is the length of the Nano ID
    const nanoId = nanoid();

    // const newTransection = new transectionModel(req.body);
    const newTransection = new transectionModel({
      expenseAppUserId: req.user.expenseAppUserId,
      transactionId: nanoId,
      amount: amount,
      type: type,
      category: category,
      refrence: refrence,
      description: description,
      date: date,
    });
    await newTransection.save();
    res.status(201).send({
      status: "success",
      message: "Transaction created successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "Failed to create transaction.",
      error: error,
    });
  }
};

const editTransaction = async (req, res) => {
  const { amount, type, category, refrence, description, date } = req.body;
  const { transactionId } = req.params;
  try {
    // Verify transaction belongs to the user before updating
    const transaction = await transectionModel.findOne({
      transactionId: transactionId,
      expenseAppUserId: req.user.expenseAppUserId,
    });
    
    if (!transaction) {
      return res.status(404).json({
        status: "failed",
        message: "Transaction not found or you don't have access to this transaction.",
      });
    }
    
    await transectionModel.findOneAndUpdate(
      { 
        transactionId: transactionId,
        expenseAppUserId: req.user.expenseAppUserId, // Ensure user can only update their own transactions
      },
      {
        $set: {
          amount: amount,
          type: type,
          category: category,
          refrence: refrence,
          description: description,
          date: date,
        },
      }
    );
    return res.status(200).send({
      status: "success",
      message: "Transaction updated successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "Failed to update transaction.",
      error: error,
    });
  }
};
const deleteTransaction = async (req, res) => {
  const { transactionId } = req.params;
  try {
    // Verify transaction belongs to the user before deleting
    const transaction = await transectionModel.findOne({
      transactionId: transactionId,
      expenseAppUserId: req.user.expenseAppUserId,
    });
    
    if (!transaction) {
      return res.status(404).json({
        status: "failed",
        message: "Transaction not found or you don't have access to this transaction.",
      });
    }
    
    await transectionModel.findOneAndDelete({ 
      transactionId: transactionId,
      expenseAppUserId: req.user.expenseAppUserId, // Ensure user can only delete their own transactions
    });
    res
      .status(200)
      .send({
        status: "success",
        message: "Transaction deleted successfully.",
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        status: "failed",
        message: "Failed to delete transaction.",
        error: error,
      });
  }
};

module.exports = {
  getAllTransaction,
  getOneTransaction,
  addTransaction,
  editTransaction,
  deleteTransaction,
};

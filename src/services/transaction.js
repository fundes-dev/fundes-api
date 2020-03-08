const Transaction = require('../models/transaction');

const postTransaction = async ({
  user,
  amount,
  date,
  package,
  fundesFee,
  stripeFee
}) => {
  try {
    const newTransaction = new Transaction({
      user,
      amount,
      date,
      package,
      fundesFee,
      stripeFee
    });
    const transaction = await newTransaction.save();
    return transaction;
  } catch (ex) {
    throw ex;
  }
};

module.exports = { postTransaction }